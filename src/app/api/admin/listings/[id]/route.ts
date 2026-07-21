import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId, logAdminActivity } from "@/lib/admin";
import { deleteListing, getAdminListingDetail } from "@/lib/admin-listings";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const { id } = await params;
  const listing = await getAdminListingDetail(id);
  if (!listing) {
    return NextResponse.json({ error: "Iklan tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(listing);
}

export async function DELETE(
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

  await deleteListing(id);
  await logAdminActivity({
    adminUserId,
    action: "delete_listing",
    targetType: "listing",
    targetId: id,
    reason,
  });

  return NextResponse.json({ ok: true });
}
