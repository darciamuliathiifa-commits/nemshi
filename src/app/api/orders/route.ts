import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { createOrder } from "@/lib/orders";
import { PRODUCT_PRICES, type OrderProductType } from "@/lib/pricing";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const productType = body.productType as OrderProductType;

  if (!(productType in PRODUCT_PRICES)) {
    return NextResponse.json({ error: "Jenis produk tidak dikenali" }, { status: 400 });
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  }

  const order = await createOrder(
    userId,
    productType,
    typeof body.listingId === "string" ? body.listingId : undefined
  );

  return NextResponse.json(order, { status: 201 });
}
