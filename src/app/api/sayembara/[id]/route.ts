import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AD_CATEGORIES } from "@/lib/types";

// Sayembara reuses the ads status enum, but only these values make sense
// for a service request (not "Terjual"/"Kedaluwarsa", which are ad-specific).
const VALID_STATUSES = ["Aktif", "Selesai", "Ditutup"];

interface SayembaraDetailRow {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  price_label: string | null;
  wa_nego: boolean;
  status: string;
  created_at: string;
  profiles: { name: string } | { name: string }[] | null;
}

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

  const { data, error } = await supabase
    .from("sayembara")
    .select(
      `id, owner_id, title, description, category, location, price_label, wa_nego,
       status, created_at, profiles!owner_id ( name )`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Sayembara tidak ditemukan." }, { status: 404 });
  }

  const row = data as unknown as SayembaraDetailRow;
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user?.id === row.owner_id;

  const { count: applicantCount } = await supabase
    .from("sayembara_applicants")
    .select("id", { count: "exact", head: true })
    .eq("sayembara_id", row.id);

  // Only the owner can see who applied (name + contact) — RLS also enforces
  // this, but we skip the query entirely for non-owners so the response is
  // explicit about *why* the list is empty instead of looking like nobody
  // applied.
  let applicants: { name: string; contact: string; appliedAt: string }[] = [];
  if (isOwner) {
    const { data: applicantRows, error: applicantsError } = await supabase
      .from("sayembara_applicants")
      .select("applicant_name, contact, created_at")
      .eq("sayembara_id", row.id)
      .order("created_at", { ascending: true });

    if (applicantsError) {
      return NextResponse.json({ error: applicantsError.message }, { status: 500 });
    }

    applicants = (applicantRows ?? []).map((applicant) => ({
      name: applicant.applicant_name,
      contact: applicant.contact,
      appliedAt: applicant.created_at,
    }));
  }

  const { data: relatedRows } = await supabase
    .from("sayembara")
    .select(
      `id, title, description, category, location, price_label, wa_nego, status, created_at`,
    )
    .eq("category", row.category)
    .eq("status", "Aktif")
    .neq("id", row.id)
    .order("created_at", { ascending: false })
    .limit(4);

  return NextResponse.json({
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    location: row.location,
    priceLabel: row.price_label,
    waNego: row.wa_nego,
    status: row.status,
    createdAt: row.created_at,
    ownerName: profile?.name ?? null,
    isOwner,
    applicantCount: applicantCount ?? 0,
    applicants,
    related: (relatedRows ?? []).map((related) => ({
      id: related.id,
      title: related.title,
      description: related.description,
      category: related.category,
      location: related.location,
      priceLabel: related.price_label,
      waNego: related.wa_nego,
      status: related.status,
      createdAt: related.created_at,
    })),
  });
}

interface UpdateSayembaraBody {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  priceLabel?: string | null;
  waNego?: boolean;
  status?: string;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: UpdateSayembaraBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  if (typeof body.title === "string") {
    if (!body.title.trim()) {
      return NextResponse.json({ error: "Judul tidak boleh kosong." }, { status: 400 });
    }
    updates.title = body.title.trim();
  }
  if (typeof body.description === "string") {
    if (!body.description.trim()) {
      return NextResponse.json({ error: "Deskripsi tidak boleh kosong." }, { status: 400 });
    }
    updates.description = body.description.trim();
  }
  if (typeof body.location === "string") {
    if (!body.location.trim()) {
      return NextResponse.json({ error: "Lokasi tidak boleh kosong." }, { status: 400 });
    }
    updates.location = body.location.trim();
  }
  if (typeof body.category === "string") {
    if (!AD_CATEGORIES.includes(body.category as (typeof AD_CATEGORIES)[number])) {
      return NextResponse.json(
        { error: `Kategori harus salah satu dari: ${AD_CATEGORIES.join(", ")}.` },
        { status: 400 },
      );
    }
    updates.category = body.category;
  }
  if ("priceLabel" in body) {
    updates.price_label = body.priceLabel?.trim() || null;
  }
  if (typeof body.waNego === "boolean") {
    updates.wa_nego = body.waNego;
  }
  if (typeof body.status === "string") {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json(
        { error: `Status harus salah satu dari: ${VALID_STATUSES.join(", ")}.` },
        { status: 400 },
      );
    }
    updates.status = body.status;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Tidak ada data untuk diperbarui." },
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

  const { data, error } = await supabase
    .from("sayembara")
    .update(updates)
    .eq("id", id)
    .eq("owner_id", user.id)
    .select(
      "id, title, description, category, location, price_label, wa_nego, status, created_at",
    )
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "Sayembara tidak ditemukan atau bukan milikmu." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    location: data.location,
    priceLabel: data.price_label,
    waNego: data.wa_nego,
    status: data.status,
    createdAt: data.created_at,
  });
}

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

  const { data, error } = await supabase
    .from("sayembara")
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
      { error: "Sayembara tidak ditemukan atau bukan milikmu." },
      { status: 404 },
    );
  }

  return NextResponse.json({ status: "ok" });
}
