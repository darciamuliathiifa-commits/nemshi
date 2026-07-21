import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId, logAdminActivity } from "@/lib/admin";
import { confirmRefund } from "@/lib/orders";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const order = await confirmRefund(id);
    await logAdminActivity({
      adminUserId,
      action: "confirm_refund",
      targetType: "order",
      targetId: id,
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal memproses refund" },
      { status: 400 }
    );
  }
}
