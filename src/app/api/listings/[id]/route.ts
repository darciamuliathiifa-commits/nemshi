import { NextRequest, NextResponse } from "next/server";
import { getListingById } from "@/lib/listings";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    return NextResponse.json({ error: "Iklan tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(listing);
}
