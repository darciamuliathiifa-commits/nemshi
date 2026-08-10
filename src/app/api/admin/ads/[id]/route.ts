import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/server/require-admin";

export async function DELETE(
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Belum masuk akun." }, { status: 401 });
  }

  const forbidden = await requireAdmin(supabase, user.id);
  if (forbidden) return forbidden;

  // RLS has no admin-delete policy on `ads` (only owner-delete), so this uses
  // the service-role client to bypass RLS once requireAdmin has already
  // confirmed the caller is an admin — same pattern as /api/admin/users.
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return NextResponse.json(
      { error: "Supabase admin key belum dikonfigurasi." },
      { status: 500 },
    );
  }

  const { data, error } = await adminClient
    .from("ads")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Iklan tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ status: "ok" });
}

const FOCAL_POINT_PATTERN = /^\d{1,3}%\s+\d{1,3}%$/;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: { coverFocalPoint?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  if (!body.coverFocalPoint || !FOCAL_POINT_PATTERN.test(body.coverFocalPoint)) {
    return NextResponse.json(
      { error: "Field coverFocalPoint tidak valid." },
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

  // RLS already has an "Admins can update any ad" policy, so the
  // cookie-scoped client works here (unlike DELETE above).
  const { data, error } = await supabase
    .from("ads")
    .update({ cover_focal_point: body.coverFocalPoint, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, cover_focal_point")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Iklan tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ id: data.id, coverFocalPoint: data.cover_focal_point });
}
