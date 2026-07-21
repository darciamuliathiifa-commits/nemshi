import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/admin";
import { getAllOrdersForAdmin } from "@/lib/admin-orders";

export async function GET(request: NextRequest) {
  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const params = request.nextUrl.searchParams;
  const ordersList = await getAllOrdersForAdmin({
    productType: params.get("productType") ?? undefined,
    paymentStatus: params.get("paymentStatus") ?? undefined,
    from: params.get("from") ?? undefined,
    to: params.get("to") ?? undefined,
  });

  return NextResponse.json(ordersList);
}
