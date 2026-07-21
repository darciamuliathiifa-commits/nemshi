import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { getOrderById, payOrder } from "@/lib/orders";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  }

  const order = await getOrderById(id);

  if (!order || order.userId !== userId) {
    return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  }

  const body = await request.json();
  const paymentMethod = typeof body.paymentMethod === "string" ? body.paymentMethod : "QRIS";
  const simulateFailure = body.simulateFailure === true;

  try {
    const updated = await payOrder(id, paymentMethod, simulateFailure);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal memproses pembayaran" },
      { status: 400 }
    );
  }
}
