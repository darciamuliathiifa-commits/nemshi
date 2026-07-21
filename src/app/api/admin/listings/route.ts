import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/admin";
import { getAdminListings } from "@/lib/admin-listings";
import { listingStatusEnum } from "@/db/schema";

export async function GET(request: NextRequest) {
  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const statusParam = request.nextUrl.searchParams.get("status");
  const status = listingStatusEnum.enumValues.includes(statusParam as never)
    ? (statusParam as (typeof listingStatusEnum.enumValues)[number])
    : undefined;
  const q = request.nextUrl.searchParams.get("q") ?? undefined;

  const listingsList = await getAdminListings({ status, q });
  return NextResponse.json(listingsList);
}
