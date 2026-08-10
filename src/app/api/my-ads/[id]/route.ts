import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { evaluateAdSubmission } from "@/lib/server/ad-filter";

const VALID_STATUSES = [
  "Aktif",
  "Menunggu Validasi",
  "Terjual",
  "Selesai",
  "Kedaluwarsa",
  "Ditutup",
];

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

  const { data: ad, error } = await supabase
    .from("ads")
    .select(
      `id, kind, title, description, category, price_label, location, status,
       condition, delivery_method, scope, estimated_duration, whatsapp_number,
       created_at, cover_focal_point, social_media`,
    )
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!ad) {
    return NextResponse.json(
      { error: "Iklan tidak ditemukan atau bukan milikmu." },
      { status: 404 },
    );
  }

  const { data: photoRows } = await supabase
    .from("ad_photos")
    .select("url")
    .eq("ad_id", id)
    .order("position", { ascending: true });

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
    whatsappNumber: ad.whatsapp_number,
    createdAt: ad.created_at,
    coverFocalPoint: ad.cover_focal_point ?? "50% 0%",
    socialMedia: ad.social_media ?? "",
    photos: (photoRows ?? []).map((p) => p.url),
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

  // Check existing ad
  const { data: existingAd } = await supabase
    .from("ads")
    .select("id, status, title, description, price_label")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!existingAd) {
    return NextResponse.json(
      { error: "Iklan tidak ditemukan atau bukan milikmu." },
      { status: 404 },
    );
  }

  // Simple status update
  if (Object.keys(body).length === 1 && typeof body.status === "string") {
    const newStatus = body.status;
    if (!VALID_STATUSES.includes(newStatus)) {
      return NextResponse.json(
        { error: `Status harus salah satu dari: ${VALID_STATUSES.join(", ")}.` },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("ads")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("owner_id", user.id)
      .select("id, status")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id, status: data.status });
  }

  // Full ad details edit
  const title = typeof body.title === "string" ? body.title.trim() : undefined;
  const description =
    typeof body.description === "string" ? body.description.trim() : undefined;
  const category = typeof body.category === "string" ? body.category : undefined;
  const priceLabel = typeof body.priceLabel === "string" ? body.priceLabel.trim() : undefined;
  const location = typeof body.location === "string" ? body.location.trim() : undefined;
  const condition = typeof body.condition === "string" ? body.condition : null;
  const deliveryMethod =
    typeof body.deliveryMethod === "string" ? body.deliveryMethod.trim() : null;
  const scope = typeof body.scope === "string" ? body.scope.trim() : null;
  const estimatedDuration =
    typeof body.estimatedDuration === "string" ? body.estimatedDuration.trim() : null;
  const statusInput = typeof body.status === "string" ? body.status : undefined;
  const FOCAL_POINT_PATTERN = /^\d{1,3}%\s+\d{1,3}%$/;
  const coverFocalPoint =
    typeof body.coverFocalPoint === "string" && FOCAL_POINT_PATTERN.test(body.coverFocalPoint)
      ? body.coverFocalPoint
      : undefined;

  if (title !== undefined && title.length < 5) {
    return NextResponse.json(
      { error: "Judul iklan minimal 5 karakter." },
      { status: 400 },
    );
  }
  if (description !== undefined && description.length < 15) {
    return NextResponse.json(
      { error: "Deskripsi iklan minimal 15 karakter." },
      { status: 400 },
    );
  }

  // Evaluate content moderation filter if text changed
  const checkTitle = title ?? existingAd.title;
  const checkDesc = description ?? existingAd.description;
  const checkPrice = priceLabel ?? existingAd.price_label;

  const { flagged, reasons } = evaluateAdSubmission({
    title: checkTitle,
    description: checkDesc,
    priceLabel: checkPrice,
  });

  const nextStatus = statusInput
    ? statusInput
    : flagged
      ? "Menunggu Validasi"
      : existingAd.status === "Menunggu Validasi"
        ? "Aktif"
        : existingAd.status;

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    status: nextStatus,
    flag_reason: flagged ? reasons.join("; ") : null,
  };

  if (title !== undefined) updatePayload.title = title;
  if (description !== undefined) updatePayload.description = description;
  if (category !== undefined) updatePayload.category = category;
  if (priceLabel !== undefined) updatePayload.price_label = priceLabel;
  if (location !== undefined) updatePayload.location = location;
  if (body.condition !== undefined) updatePayload.condition = condition;
  if (body.deliveryMethod !== undefined) updatePayload.delivery_method = deliveryMethod;
  if (body.scope !== undefined) updatePayload.scope = scope;
  if (body.estimatedDuration !== undefined) updatePayload.estimated_duration = estimatedDuration;
  if (coverFocalPoint !== undefined) updatePayload.cover_focal_point = coverFocalPoint;
  if (typeof body.socialMedia === "string")
    updatePayload.social_media = body.socialMedia.trim() || null;

  const { data: updatedAd, error: updateError } = await supabase
    .from("ads")
    .update(updatePayload)
    .eq("id", id)
    .eq("owner_id", user.id)
    .select("id, status, title, category, price_label, location, cover_focal_point, social_media")
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Update photos if provided
  if (Array.isArray(body.photos)) {
    const photos = body.photos.filter((url): url is string => typeof url === "string" && url.length > 0);
    await supabase.from("ad_photos").delete().eq("ad_id", id);
    if (photos.length > 0) {
      await supabase.from("ad_photos").insert(
        photos.map((url, index) => ({ ad_id: id, url, position: index })),
      );
    }
  }

  return NextResponse.json({
    id: updatedAd.id,
    status: updatedAd.status,
    title: updatedAd.title,
    category: updatedAd.category,
    priceLabel: updatedAd.price_label,
    location: updatedAd.location,
    coverFocalPoint: updatedAd.cover_focal_point,
    socialMedia: updatedAd.social_media,
  });
}

export async function DELETE(
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

  const { data, error } = await supabase
    .from("ads")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "Iklan tidak ditemukan atau bukan milikmu." },
      { status: 404 },
    );
  }

  return NextResponse.json({ status: "ok" });
}
