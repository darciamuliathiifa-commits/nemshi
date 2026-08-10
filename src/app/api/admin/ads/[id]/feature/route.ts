import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/server/require-admin";

const FEATURE_DAYS = 7;

interface FeatureAdBody {
  featured?: boolean;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: FeatureAdBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  if (typeof body.featured !== "boolean") {
    return NextResponse.json(
      { error: "Field featured (boolean) wajib diisi." },
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

  const forbidden = await requireAdmin(supabase, user.id);
  if (forbidden) return forbidden;

  const featuredUntil = body.featured
    ? new Date(Date.now() + FEATURE_DAYS * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const { data, error } = await supabase
    .from("ads")
    .update({ featured_until: featuredUntil, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, featured_until")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Iklan tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ id: data.id, featuredUntil: data.featured_until });
}
