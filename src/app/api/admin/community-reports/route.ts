import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/admin";
import { getAllReportsForAdmin } from "@/lib/reports";

export async function GET() {
  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const reportsList = await getAllReportsForAdmin();
  return NextResponse.json(reportsList);
}
