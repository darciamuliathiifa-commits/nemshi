import { NextRequest, NextResponse } from "next/server";
import { rejectListingOrder } from "@/lib/orders";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const listing = await rejectListingOrder(id);
    return NextResponse.json(listing);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal menolak iklan" },
      { status: 400 }
    );
  }
}
