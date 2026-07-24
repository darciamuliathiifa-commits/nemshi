import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/server/require-admin";

interface ReportRow {
  id: string;
  reason: string;
  status: string;
  created_at: string;
  ads: { id: string; title: string } | { id: string; title: string }[] | null;
  profiles: { name: string } | { name: string }[] | null;
}

export async function GET() {
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

  const forbidden = await requireAdmin(supabase, user.id);
  if (forbidden) return forbidden;

  const { data, error } = await supabase
    .from("ad_reports")
    .select(
      `id, reason, status, created_at,
       ads ( id, title ),
       profiles ( name )`,
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as unknown as ReportRow[];

  const reports = rows.map((row) => {
    const ad = Array.isArray(row.ads) ? row.ads[0] : row.ads;
    const reporter = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.id,
      reason: row.reason,
      status: row.status,
      createdAt: row.created_at,
      adId: ad?.id ?? null,
      adTitle: ad?.title ?? null,
      reporterName: reporter?.name ?? null,
    };
  });

  return NextResponse.json({ reports });
}
