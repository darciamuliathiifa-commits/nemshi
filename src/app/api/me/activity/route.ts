import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { getUserActivitySummary } from "@/lib/users";

export async function GET() {
  const userId = await getCurrentUserId();
  const activity = await getUserActivitySummary(userId);
  return NextResponse.json(activity);
}
