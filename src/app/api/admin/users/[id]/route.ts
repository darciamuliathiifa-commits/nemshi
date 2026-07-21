import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId, logAdminActivity } from "@/lib/admin";
import { updateUserVerificationStatus } from "@/lib/admin-users";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const verificationStatus = body.verificationStatus;

  if (!["Unverified", "Identity_Verified", "Skill_Verified"].includes(verificationStatus)) {
    return NextResponse.json({ error: "Status verifikasi tidak valid" }, { status: 400 });
  }

  const updated = await updateUserVerificationStatus(id, verificationStatus);

  await logAdminActivity({
    adminUserId,
    action: "update_verification_status",
    targetType: "user",
    targetId: id,
    reason: `Diubah menjadi ${verificationStatus}`,
  });

  return NextResponse.json(updated);
}
