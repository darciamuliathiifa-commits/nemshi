import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { initiateMayarPayment } from "@/lib/orders";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const link = await initiateMayarPayment(id, userId);
    return NextResponse.json({ link });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal memulai pembayaran" },
      { status: 400 }
    );
  }
}
