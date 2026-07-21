import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/admin";
import {
  getAvgClicksPerCategory,
  getMonthlyRevenue,
  getRenewalRatio,
  getTotalRevenue,
} from "@/lib/admin-reports";

export async function GET() {
  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const [totalRevenue, avgClicksPerCategory, renewalRatio, monthlyRevenue] = await Promise.all([
    getTotalRevenue(),
    getAvgClicksPerCategory(),
    getRenewalRatio(),
    getMonthlyRevenue(3),
  ]);

  return NextResponse.json({ totalRevenue, avgClicksPerCategory, renewalRatio, monthlyRevenue });
}
