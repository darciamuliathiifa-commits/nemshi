import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { getUserNeedsServiceListings } from "@/lib/listings";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  }

  const listingsList = await getUserNeedsServiceListings(userId);
  return NextResponse.json(listingsList);
}
