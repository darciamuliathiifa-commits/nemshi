import { NextResponse } from "next/server";
import { getAdminUserId, logAdminActivity } from "@/lib/admin";
import { markReportReviewed } from "@/lib/reports";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const { id } = await params;
  const report = await markReportReviewed(id);

  await logAdminActivity({
    adminUserId,
    action: "resolve_report",
    targetType: "report",
    targetId: id,
  });

  return NextResponse.json(report);
}
