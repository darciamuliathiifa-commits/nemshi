import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { listingImpressions } from "@/db/schema";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.insert(listingImpressions).values({ listingId: id });
  return NextResponse.json({ ok: true });
}
