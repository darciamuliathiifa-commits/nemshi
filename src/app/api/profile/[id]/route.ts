import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Public seller profile — only trust-building fields (PRD §4.7), never
// contact details. WhatsApp numbers are exposed per-ad via /api/ads/[id],
// not here.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi." },
      { status: 500 },
    );
  }

  const [{ data: profile, error: profileError }, { count: activeAdsCount }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, name, created_at")
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("ads")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", id)
        .eq("status", "Aktif"),
    ]);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  if (!profile) {
    return NextResponse.json({ error: "Profil tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({
    id: profile.id,
    name: profile.name,
    joinedYear: new Date(profile.created_at).getFullYear(),
    activeAdsCount: activeAdsCount ?? 0,
  });
}
