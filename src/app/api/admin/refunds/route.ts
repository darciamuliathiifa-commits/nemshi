import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/admin";
import { getPendingRefunds } from "@/lib/orders";

export async function GET() {
  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const refunds = await getPendingRefunds();
  return NextResponse.json(refunds);
}
