import { NextResponse } from "next/server";
import { getAreas } from "@/lib/listings";

export async function GET() {
  const areas = await getAreas();
  return NextResponse.json(areas);
}
