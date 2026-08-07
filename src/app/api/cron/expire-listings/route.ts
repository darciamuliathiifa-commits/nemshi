import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { MASTER_ACCOUNT_EMAIL } from "@/lib/server/quota-store";
import { EXPIRY_REMINDER_DAYS } from "@/lib/expiry";

// Runs daily via Vercel Cron (see vercel.json). Two sweeps, in order:
//
// 1. Remind owners whose listings expire soon, so a listing never dies without
//    warning — renewing is free, but nobody renews what they didn't know was
//    about to lapse.
// 2. Sync the `status` column to "Kedaluwarsa" for listings already past their
//    expiry. Public browse queries already filter on expires_at, so this
//    doesn't change what's shown — it keeps "Iklan Saya" filters and status
//    badges accurate too.

interface ExpiringRow {
  id: string;
  owner_id: string;
  title: string;
}

/**
 * Notifies owners of listings expiring within the reminder window, then stamps
 * `expiry_reminded_at` so tomorrow's run doesn't notify them again. Extending a
 * listing clears that stamp, which re-arms the reminder for the new window.
 */
async function remindExpiringSoon(
  supabase: SupabaseClient,
  table: "ads" | "sayembara",
  masterProfileId: string | undefined,
): Promise<number> {
  const now = new Date();
  const windowEnd = new Date(
    now.getTime() + EXPIRY_REMINDER_DAYS * 24 * 60 * 60 * 1000,
  );

  let query = supabase
    .from(table)
    .select("id, owner_id, title")
    .eq("status", "Aktif")
    .is("expiry_reminded_at", null)
    .gt("expires_at", now.toISOString())
    .lte("expires_at", windowEnd.toISOString());

  if (masterProfileId) {
    query = query.neq("owner_id", masterProfileId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as ExpiringRow[];
  if (rows.length === 0) return 0;

  const isAd = table === "ads";
  const label = isAd ? "Iklan" : "Sayembara";

  const { error: notifyError } = await supabase.from("notifications").insert(
    rows.map((row) => ({
      user_id: row.owner_id,
      type: isAd ? "ad_expiring" : "sayembara_expiring",
      title: `${label} kamu segera berakhir`,
      body: `"${row.title}" berakhir dalam ${EXPIRY_REMINDER_DAYS} hari. Masih tersedia? Perpanjang gratis dari halaman Iklan Saya.`,
      link: "/iklan-saya",
    })),
  );
  if (notifyError) throw new Error(notifyError.message);

  // Only stamped after the notifications actually landed, so a failed insert
  // is retried on the next run instead of being silently skipped forever.
  const { error: stampError } = await supabase
    .from(table)
    .update({ expiry_reminded_at: now.toISOString() })
    .in(
      "id",
      rows.map((row) => row.id),
    );
  if (stampError) throw new Error(stampError.message);

  return rows.length;
}

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

  let remindedAds = 0;
  let remindedSayembara = 0;
  try {
    [remindedAds, remindedSayembara] = await Promise.all([
      remindExpiringSoon(supabase, "ads", masterProfile?.id),
      remindExpiringSoon(supabase, "sayembara", masterProfile?.id),
    ]);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Gagal mengirim pengingat." },
      { status: 500 },
    );
  }

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
    remindedAds,
    remindedSayembara,
    expiredAds: expiredAds?.length ?? 0,
    expiredSayembara: expiredSayembara?.length ?? 0,
  });
}
