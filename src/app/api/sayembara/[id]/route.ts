import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
       status, created_at, profiles ( name )`,
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
