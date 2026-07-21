import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { getEmergencyContactsForUser, saveEmergencyContacts } from "@/lib/emergency-contacts";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  }

  const contacts = await getEmergencyContactsForUser(userId);
  return NextResponse.json(contacts);
}

export async function PUT(request: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  }

  const body = await request.json();
  const contacts = Array.isArray(body.contacts) ? body.contacts : [];

  try {
    const updated = await saveEmergencyContacts(userId, contacts);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Kontak darurat tidak valid" },
      { status: 400 }
    );
  }
}
