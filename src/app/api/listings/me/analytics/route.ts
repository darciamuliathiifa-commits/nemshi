import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { getListingAnalyticsForUser } from "@/lib/analytics";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  }

  const analytics = await getListingAnalyticsForUser(userId);
  return NextResponse.json(analytics);
}
