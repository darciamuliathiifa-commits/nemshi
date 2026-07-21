import { NextRequest, NextResponse } from "next/server";
import { getUserActiveListings } from "@/lib/users";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const listings = await getUserActiveListings(id);
  return NextResponse.json(listings);
}
