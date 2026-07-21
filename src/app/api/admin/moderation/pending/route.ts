import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/admin";
import { getPendingListings } from "@/lib/admin-listings";

export async function GET(request: NextRequest) {
  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const type = request.nextUrl.searchParams.get("type");
  if (type !== "Offers_Service" && type !== "Needs_Service") {
    return NextResponse.json({ error: "Parameter type tidak valid" }, { status: 400 });
  }

  const listingsList = await getPendingListings(type);
  return NextResponse.json(listingsList);
}
