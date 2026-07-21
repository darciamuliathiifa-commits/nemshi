import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { getPublicProfile, updateUserProfile } from "@/lib/users";

export async function GET() {
  const userId = await getCurrentUserId();
  const profile = await getPublicProfile(userId);
  return NextResponse.json(profile);
}

export async function PATCH(request: NextRequest) {
  const userId = await getCurrentUserId();
  const body = await request.json();

  const updated = await updateUserProfile(userId, {
    fullName: typeof body.fullName === "string" ? body.fullName : undefined,
    avatarUrl: typeof body.avatarUrl === "string" ? body.avatarUrl : undefined,
    whatsappLink: typeof body.whatsappLink === "string" ? body.whatsappLink : undefined,
  });

  return NextResponse.json(updated);
}
