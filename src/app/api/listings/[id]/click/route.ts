import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { clickAnalytics } from "@/db/schema";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await db.insert(clickAnalytics).values({
    listingId: id,
    userAgent: request.headers.get("user-agent"),
  });

  return NextResponse.json({ ok: true });
}
