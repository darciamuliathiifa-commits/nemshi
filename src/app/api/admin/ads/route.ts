import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/server/require-admin";

interface AdminAdRow {
  id: string;
  title: string;
  kind: "produk" | "jasa";
  category: string;
  status: string;
  flag_reason: string | null;
  created_at: string;
  profiles: { name: string } | { name: string }[] | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "Menunggu Validasi";

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
    .from("ads")
    .select(`id, title, kind, category, status, flag_reason, created_at, profiles ( name )`)
    .eq("status", status)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as unknown as AdminAdRow[];

  const ads = rows.map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.id,
      title: row.title,
      kind: row.kind,
      category: row.category,
      status: row.status,
      flagReason: row.flag_reason,
      createdAt: row.created_at,
      submittedBy: profile?.name ?? null,
    };
  });

  return NextResponse.json({ ads });
}
