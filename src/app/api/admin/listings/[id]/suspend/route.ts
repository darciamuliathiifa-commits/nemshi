import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId, logAdminActivity } from "@/lib/admin";
import { suspendListing } from "@/lib/admin-listings";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const reason = typeof body.reason === "string" ? body.reason : "";

  if (!reason.trim()) {
    return NextResponse.json({ error: "Alasan penangguhan wajib diisi" }, { status: 400 });
  }

  const listing = await suspendListing(id, reason);

  await logAdminActivity({
    adminUserId,
    action: "suspend_listing",
    targetType: "listing",
    targetId: id,
    reason,
  });

  return NextResponse.json(listing);
}
