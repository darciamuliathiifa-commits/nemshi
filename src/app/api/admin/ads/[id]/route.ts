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

export async function GET(
  _request: Request,
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

  const { data: ad, error } = await supabase
    .from("ads")
    .select(
      `id, kind, title, description, category, price_label, location, status,
       condition, delivery_method, scope, estimated_duration, cover_focal_point, social_media`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!ad) {
    return NextResponse.json({ error: "Iklan tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({
    id: ad.id,
    kind: ad.kind,
    title: ad.title,
    description: ad.description,
    category: ad.category,
    priceLabel: ad.price_label,
    location: ad.location,
    status: ad.status,
    condition: ad.condition,
    deliveryMethod: ad.delivery_method,
    scope: ad.scope,
    estimatedDuration: ad.estimated_duration,
    coverFocalPoint: ad.cover_focal_point,
    socialMedia: ad.social_media,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
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

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.coverFocalPoint !== undefined) {
    if (typeof body.coverFocalPoint !== "string" || !FOCAL_POINT_PATTERN.test(body.coverFocalPoint)) {
      return NextResponse.json(
        { error: "Field coverFocalPoint tidak valid." },
        { status: 400 },
      );
    }
    updatePayload.cover_focal_point = body.coverFocalPoint;
  }

  if (typeof body.title === "string") {
    const title = body.title.trim();
    if (title.length < 5) {
      return NextResponse.json(
        { error: "Judul iklan minimal 5 karakter." },
        { status: 400 },
      );
    }
    updatePayload.title = title;
  }

  if (typeof body.description === "string") {
    const description = body.description.trim();
    if (description.length < 15) {
      return NextResponse.json(
        { error: "Deskripsi iklan minimal 15 karakter." },
        { status: 400 },
      );
    }
    updatePayload.description = description;
  }

  if (typeof body.category === "string") updatePayload.category = body.category;
  // Empty is valid on purpose — see the ads POST route for why.
  if (typeof body.priceLabel === "string") updatePayload.price_label = body.priceLabel.trim();
  if (typeof body.location === "string") updatePayload.location = body.location.trim();
  if (typeof body.socialMedia === "string")
    updatePayload.social_media = body.socialMedia.trim() || null;
  if (body.condition !== undefined) {
    updatePayload.condition = typeof body.condition === "string" ? body.condition : null;
  }
  if (body.deliveryMethod !== undefined) {
    updatePayload.delivery_method =
      typeof body.deliveryMethod === "string" ? body.deliveryMethod.trim() : null;
  }
  if (body.scope !== undefined) {
    updatePayload.scope = typeof body.scope === "string" ? body.scope.trim() : null;
  }
  if (body.estimatedDuration !== undefined) {
    updatePayload.estimated_duration =
      typeof body.estimatedDuration === "string" ? body.estimatedDuration.trim() : null;
  }

  // RLS already has an "Admins can update any ad" policy, so the
  // cookie-scoped client works here (unlike DELETE above).
  const { data, error } = await supabase
    .from("ads")
    .update(updatePayload)
    .eq("id", id)
    .select(
      "id, title, category, price_label, location, cover_focal_point, condition, delivery_method, scope, estimated_duration, social_media",
    )
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Iklan tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({
    id: data.id,
    title: data.title,
    category: data.category,
    priceLabel: data.price_label,
    location: data.location,
    coverFocalPoint: data.cover_focal_point,
    condition: data.condition,
    deliveryMethod: data.delivery_method,
    scope: data.scope,
    estimatedDuration: data.estimated_duration,
    socialMedia: data.social_media,
  });
}
