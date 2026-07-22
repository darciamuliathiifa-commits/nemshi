import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { listings } from "@/db/schema";
import { getCurrentUserId } from "@/lib/current-user";
import { isListingSaved, saveListing, unsaveListing } from "@/lib/saved-listings";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  }

  const { id } = await params;

  const [listing] = await db.select({ id: listings.id }).from(listings).where(eq(listings.id, id)).limit(1);
  if (!listing) {
    return NextResponse.json({ error: "Iklan tidak ditemukan" }, { status: 404 });
  }

  const alreadySaved = await isListingSaved(userId, id);
  if (alreadySaved) {
    await unsaveListing(userId, id);
    return NextResponse.json({ saved: false });
  }

  await saveListing(userId, id);
  return NextResponse.json({ saved: true });
}
