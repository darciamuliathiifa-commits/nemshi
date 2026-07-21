import { NextRequest, NextResponse } from "next/server";
import { expireOldListings } from "@/lib/listings";

/**
 * Dipanggil Vercel Cron (lihat vercel.json) untuk menandai iklan yang sudah
 * lewat expires_at sebagai "Expired". Query publik sudah aman tanpa ini
 * (lihat isCurrentlyLive di lib/listings.ts), sweep ini hanya menjaga
 * kolom status akurat untuk dasbor admin/laporan.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }

  const expiredCount = await expireOldListings();
  return NextResponse.json({ expiredCount });
}
