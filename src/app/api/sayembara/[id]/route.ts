import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface SayembaraDetailRow {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
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
      `id, title, description, category, location, status, created_at,
       profiles ( name )`,
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

  const { data: applicants, error: applicantsError } = await supabase
    .from("sayembara_applicants")
    .select("applicant_name, contact, created_at")
    .eq("sayembara_id", row.id)
    .order("created_at", { ascending: true });

  if (applicantsError) {
    return NextResponse.json({ error: applicantsError.message }, { status: 500 });
  }

  return NextResponse.json({
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    location: row.location,
    status: row.status,
    createdAt: row.created_at,
    ownerName: profile?.name ?? null,
    applicants: (applicants ?? []).map((applicant) => ({
      name: applicant.applicant_name,
      contact: applicant.contact,
      appliedAt: applicant.created_at,
    })),
  });
}
