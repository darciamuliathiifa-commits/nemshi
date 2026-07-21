import { NextRequest, NextResponse } from "next/server";
import { getActiveListings } from "@/lib/listings";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const listings = await getActiveListings({
    q: searchParams.get("q") ?? undefined,
    categorySlug: searchParams.get("category") ?? undefined,
    areaSlug: searchParams.get("area") ?? undefined,
  });

  return NextResponse.json(listings);
}
