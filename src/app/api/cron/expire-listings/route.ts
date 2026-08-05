import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { MASTER_ACCOUNT_EMAIL } from "@/lib/server/quota-store";

// Runs daily via Vercel Cron (see vercel.json). Public browse queries already
// filter out ads/sayembara whose expires_at has passed, so this doesn't
// affect what's shown — it just syncs the `status` column to "Kedaluwarsa"
// so things like "Iklan Saya" filters and status badges stay accurate too.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET belum diset." },
      { status: 500 },
    );
  }
  if (authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase admin belum dikonfigurasi." },
      { status: 500 },
    );
  }

  const now = new Date().toISOString();

  const { data: masterProfile } = await supabase
    .from("profiles")
    .select("id")
    .ilike("email", MASTER_ACCOUNT_EMAIL)
    .maybeSingle();

  let expiredAdsQuery = supabase
    .from("ads")
    .update({ status: "Kedaluwarsa" })
    .eq("status", "Aktif")
    .lt("expires_at", now);
  let expiredSayembaraQuery = supabase
    .from("sayembara")
    .update({ status: "Kedaluwarsa" })
    .eq("status", "Aktif")
    .lt("expires_at", now);

  if (masterProfile?.id) {
    expiredAdsQuery = expiredAdsQuery.neq("owner_id", masterProfile.id);
    expiredSayembaraQuery = expiredSayembaraQuery.neq(
      "owner_id",
      masterProfile.id,
    );
  }

  const [{ data: expiredAds, error: adsError }, { data: expiredSayembara, error: sayembaraError }] =
    await Promise.all([
      expiredAdsQuery.select("id"),
      expiredSayembaraQuery.select("id"),
    ]);

  if (adsError || sayembaraError) {
    return NextResponse.json(
      { error: adsError?.message || sayembaraError?.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    expiredAds: expiredAds?.length ?? 0,
    expiredSayembara: expiredSayembara?.length ?? 0,
  });
}
