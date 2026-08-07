import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isMasterAccountEmail } from "@/lib/server/quota-store";

// Mirrors /api/my-ads/[id]/extend. Kept shorter than the ads default (14) to
// match the sayembara free window: a request for help is more time-sensitive
// than a for-sale listing, so re-confirming it more often keeps the board
// honest. Renewing is free and unlimited either way.
const DEFAULT_EXTEND_DAYS = 7;
const MAX_EXTEND_DAYS = 90;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let days = DEFAULT_EXTEND_DAYS;
  try {
    const body = (await request.json()) as { days?: number };
    if (typeof body.days === "number" && Number.isFinite(body.days)) {
      days = body.days;
    }
  } catch {
    // no body / not JSON — fall back to the default extension length
  }

  if (days <= 0 || days > MAX_EXTEND_DAYS) {
    return NextResponse.json(
      { error: `Jumlah hari harus antara 1 dan ${MAX_EXTEND_DAYS}.` },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi." },
      { status: 500 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Belum masuk akun." }, { status: 401 });
  }

  const { data: sayembara, error: fetchError } = await supabase
    .from("sayembara")
    .select("id, owner_id, expires_at, status")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!sayembara || sayembara.owner_id !== user.id) {
    return NextResponse.json(
      { error: "Sayembara tidak ditemukan atau bukan milikmu." },
      { status: 404 },
    );
  }

  // Browse only shows status = 'Aktif', so renewing something the cron already
  // swept has to flip it back or it stays invisible. Only "Kedaluwarsa" is
  // revived — a Selesai/Ditutup sayembara stays closed, and one still awaiting
  // moderation must not skip the queue just because it was extended.
  const statusUpdate =
    sayembara.status === "Kedaluwarsa" ? { status: "Aktif" } : {};

  // Extending re-arms the H-2 reminder for the new window.
  const reminderReset = { expiry_reminded_at: null };

  if (isMasterAccountEmail(user.email)) {
    const { data: updated, error: updateError } = await supabase
      .from("sayembara")
      .update({ ...statusUpdate, ...reminderReset, expires_at: null })
      .eq("id", id)
      .eq("owner_id", user.id)
      .select("id, expires_at, status")
      .maybeSingle();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      id: updated?.id,
      expiresAt: null,
      status: updated?.status,
    });
  }

  const now = Date.now();
  const currentExpiry = sayembara.expires_at
    ? new Date(sayembara.expires_at).getTime()
    : now;
  const base = Math.max(now, currentExpiry);
  const newExpiresAt = new Date(base + days * 24 * 60 * 60 * 1000).toISOString();

  const { data: updated, error: updateError } = await supabase
    .from("sayembara")
    .update({ ...statusUpdate, ...reminderReset, expires_at: newExpiresAt })
    .eq("id", id)
    .eq("owner_id", user.id)
    .select("id, expires_at, status")
    .maybeSingle();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    id: updated?.id,
    expiresAt: updated?.expires_at,
    status: updated?.status,
  });
}
