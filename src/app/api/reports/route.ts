import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { createReport, type ReportReason } from "@/lib/reports";

const VALID_REASONS: ReportReason[] = [
  "Penipuan",
  "Informasi_Palsu",
  "Spam",
  "Konten_Tidak_Pantas",
  "Lainnya",
];

export async function POST(request: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  }

  const body = await request.json();
  const listingId = typeof body.listingId === "string" ? body.listingId : "";
  const reason = body.reason as ReportReason;
  const description = typeof body.description === "string" ? body.description : undefined;

  if (!listingId || !VALID_REASONS.includes(reason)) {
    return NextResponse.json({ error: "Iklan dan alasan laporan wajib diisi" }, { status: 400 });
  }

  const report = await createReport(userId, listingId, reason, description);
  return NextResponse.json(report, { status: 201 });
}
