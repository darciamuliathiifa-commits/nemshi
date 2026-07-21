import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { getUserOrders } from "@/lib/orders";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  }

  const ordersList = await getUserOrders(userId);
  return NextResponse.json(ordersList);
}
