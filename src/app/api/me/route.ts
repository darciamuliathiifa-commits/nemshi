import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { getOwnProfile, updateUserProfile } from "@/lib/users";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  }

  const profile = await getOwnProfile(userId);
  return NextResponse.json(profile);
}

export async function PATCH(request: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  }

  const body = await request.json();

  const updated = await updateUserProfile(userId, {
    fullName: typeof body.fullName === "string" ? body.fullName : undefined,
    avatarUrl: typeof body.avatarUrl === "string" ? body.avatarUrl : undefined,
    whatsappLink: typeof body.whatsappLink === "string" ? body.whatsappLink : undefined,
    phoneNumber: typeof body.phoneNumber === "string" ? body.phoneNumber : undefined,
  });

  return NextResponse.json(updated);
}
