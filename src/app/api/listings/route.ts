import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { addListingPhotos, createListing, getActiveListings } from "@/lib/listings";
import { createOrder } from "@/lib/orders";
import { consumeListingSlotQuota } from "@/lib/quotas";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const listings = await getActiveListings({
    q: searchParams.get("q") ?? undefined,
    categorySlug: searchParams.get("category") ?? undefined,
    areaSlug: searchParams.get("area") ?? undefined,
    type: "Offers_Service",
  });

  return NextResponse.json(listings);
}

export async function POST(request: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  }

  const body = await request.json();
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const whatsappLink = typeof body.whatsappLink === "string" ? body.whatsappLink.trim() : "";
  const categoryId = typeof body.categoryId === "string" ? body.categoryId : "";
  const areaId = typeof body.areaId === "string" ? body.areaId : "";
  const priceType = body.priceType === "Range" ? "Range" : "Contact";
  const paymentMethod = body.paymentMethod === "Kuota" ? "Kuota" : "Bayar";
  const photos: string[] = Array.isArray(body.photos)
    ? body.photos.filter((p: unknown) => typeof p === "string" && p.trim()).slice(0, 5)
    : [];

  if (!title || !description || !whatsappLink || !categoryId || !areaId) {
    return NextResponse.json({ error: "Semua kolom wajib diisi" }, { status: 400 });
  }

  let paidWithQuota = false;

  if (paymentMethod === "Kuota") {
    const consumed = await consumeListingSlotQuota(userId);
    if (!consumed) {
      return NextResponse.json(
        { error: "Kuota Tawarkan Jasa tidak tersedia. Silakan bayar Rp50.000." },
        { status: 400 }
      );
    }
    paidWithQuota = true;
  }

  const listing = await createListing(userId, {
    type: "Offers_Service",
    categoryId,
    areaId,
    title,
    description,
    whatsappLink,
    priceType,
    priceMin: priceType === "Range" ? Number(body.priceMin) || null : null,
    priceMax: priceType === "Range" ? Number(body.priceMax) || null : null,
    isPriority: false,
    paidWithQuota,
  });

  await addListingPhotos(listing.id, photos);

  if (paidWithQuota) {
    return NextResponse.json({ listing, order: null }, { status: 201 });
  }

  const order = await createOrder(userId, "Iklan_Tawarkan_Jasa", listing.id);
  return NextResponse.json({ listing, order }, { status: 201 });
}
