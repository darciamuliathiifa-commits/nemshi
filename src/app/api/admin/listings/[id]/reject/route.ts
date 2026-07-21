import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId, logAdminActivity } from "@/lib/admin";
import { rejectListingOrder } from "@/lib/orders";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const reason = typeof body.reason === "string" ? body.reason : undefined;

  try {
    const listing = await rejectListingOrder(id, reason);
    await logAdminActivity({
      adminUserId,
      action: "reject_listing",
      targetType: "listing",
      targetId: id,
      reason,
    });
    return NextResponse.json(listing);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal menolak iklan" },
      { status: 400 }
    );
  }
}
