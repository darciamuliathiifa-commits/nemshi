import { NextRequest, NextResponse } from "next/server";
import { expireOldListings } from "@/lib/listings";

/**
 * Menandai iklan yang sudah lewat expires_at sebagai "Expired". Query
 * publik sudah aman tanpa ini (lihat isCurrentlyLive di lib/listings.ts),
 * sweep ini hanya menjaga kolom status akurat untuk dasbor admin/laporan.
 *
 * Sweep otomatis per jam dijalankan oleh pg_cron di database Supabase
 * (bukan Vercel Cron — plan Hobby Vercel membatasi cron maksimal 1x/hari).
 * Endpoint ini tetap ada sebagai trigger manual/cadangan, masih dilindungi
 * CRON_SECRET.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 401 });
  }

  const expiredCount = await expireOldListings();
  return NextResponse.json({ expiredCount });
}
