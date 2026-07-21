import { NextRequest, NextResponse } from "next/server";
import { getPublicProfile } from "@/lib/users";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const profile = await getPublicProfile(id);

  if (!profile) {
    return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(profile);
}
