import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/server/require-admin";

interface AdminAdRow {
  id: string;
  title: string;
  kind: "produk" | "jasa";
  category: string;
  status: string;
  price_label: string;
  location: string;
  flag_reason: string | null;
  created_at: string;
  featured_until: string | null;
  profiles: { name: string } | { name: string }[] | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.trim();

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

  // No status (or "Semua") lists every ad for the admin ads browser; the
  // moderation queue always passes a specific status and relies on the
  // ascending order below to show the oldest-waiting ad first.
  let query = supabase
    .from("ads")
    .select(
      `id, title, kind, category, status, price_label, location, flag_reason, created_at, featured_until, profiles!owner_id ( name )`,
    );

  if (status && status !== "Semua") {
    query = query.eq("status", status);
  }
  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const { data, error } = await query.order("created_at", {
    ascending: Boolean(status),
  });

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
      priceLabel: row.price_label,
      location: row.location,
      flagReason: row.flag_reason,
      createdAt: row.created_at,
      submittedBy: profile?.name ?? null,
      featured: !!row.featured_until && new Date(row.featured_until) > new Date(),
      featuredUntil: row.featured_until,
    };
  });

  return NextResponse.json({ ads });
}
