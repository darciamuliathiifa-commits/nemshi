import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import {
  countRecentFreeNeedsServiceListings,
  createListing,
  getActiveListings,
} from "@/lib/listings";
import { createOrder } from "@/lib/orders";
import { consumeQuota } from "@/lib/quotas";
import { isUserSuspended } from "@/lib/users";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sayembaraList = await getActiveListings({
    type: "Needs_Service",
    q: searchParams.get("q") ?? undefined,
    categorySlug: searchParams.get("category") ?? undefined,
    areaSlug: searchParams.get("area") ?? undefined,
  });

  return NextResponse.json(sayembaraList);
}

export async function POST(request: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  }

  if (await isUserSuspended(userId)) {
    return NextResponse.json(
      { error: "Akun Anda telah ditangguhkan permanen dan tidak dapat membuat permintaan baru." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const whatsappLink = typeof body.whatsappLink === "string" ? body.whatsappLink.trim() : "";
  const categoryId = typeof body.categoryId === "string" ? body.categoryId : "";
  const areaId = typeof body.areaId === "string" ? body.areaId : "";
  const priceType = body.priceType === "Range" ? "Range" : "Contact";
  const tier = body.tier === "Prioritas" ? "Prioritas" : "Gratis";
  const paymentMethod = body.paymentMethod === "Kuota" ? "Kuota" : "Bayar";

  if (!title || !description || !whatsappLink || !categoryId || !areaId) {
    return NextResponse.json({ error: "Semua kolom wajib diisi" }, { status: 400 });
  }

  const isPriority = tier === "Prioritas";

  if (!isPriority) {
    const recentCount = await countRecentFreeNeedsServiceListings(userId);
    if (recentCount >= 1) {
      return NextResponse.json(
        { error: "Kuota Cari Jasa Gratis sudah dipakai. Coba lagi setelah 30 hari, atau pilih Prioritas." },
        { status: 400 }
      );
    }
  }

  let paidWithQuota = false;

  if (isPriority && paymentMethod === "Kuota") {
    const consumed = await consumeQuota(userId, "Priority_Slot");
    if (!consumed) {
      return NextResponse.json(
        { error: "Kuota Cari Jasa Prioritas tidak tersedia. Silakan bayar Rp12.000." },
        { status: 400 }
      );
    }
    paidWithQuota = true;
  }

  const listing = await createListing(userId, {
    type: "Needs_Service",
    categoryId,
    areaId,
    title,
    description,
    whatsappLink,
    priceType,
    priceMin: priceType === "Range" ? Number(body.priceMin) || null : null,
    priceMax: priceType === "Range" ? Number(body.priceMax) || null : null,
    isPriority,
    paidWithQuota,
  });

  if (!isPriority || paidWithQuota) {
    return NextResponse.json({ listing, order: null }, { status: 201 });
  }

  const order = await createOrder(userId, "Cari_Jasa_Prioritas", listing.id);
  return NextResponse.json({ listing, order }, { status: 201 });
}
