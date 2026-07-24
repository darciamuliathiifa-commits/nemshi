import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const DEFAULT_EXTEND_DAYS = 14;
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

  const { data: ad, error: fetchError } = await supabase
    .from("ads")
    .select("id, owner_id, expires_at")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!ad || ad.owner_id !== user.id) {
    return NextResponse.json(
      { error: "Iklan tidak ditemukan atau bukan milikmu." },
      { status: 404 },
    );
  }

  const now = Date.now();
  const currentExpiry = ad.expires_at ? new Date(ad.expires_at).getTime() : now;
  const base = Math.max(now, currentExpiry);
  const newExpiresAt = new Date(base + days * 24 * 60 * 60 * 1000).toISOString();

  const { data: updated, error: updateError } = await supabase
    .from("ads")
    .update({ expires_at: newExpiresAt, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("owner_id", user.id)
    .select("id, expires_at")
    .maybeSingle();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ id: updated?.id, expiresAt: updated?.expires_at });
}
