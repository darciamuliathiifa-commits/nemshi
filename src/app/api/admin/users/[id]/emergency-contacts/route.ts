import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/admin";
import { getEmergencyContactsForUser } from "@/lib/emergency-contacts";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const { id } = await params;
  const contacts = await getEmergencyContactsForUser(id);
  return NextResponse.json(contacts);
}
