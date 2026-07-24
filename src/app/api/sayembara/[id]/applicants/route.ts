import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface RegisterApplicantBody {
  name?: string;
  contact?: string;
}

// No auth required — matches the "Anyone can register as an applicant" RLS
// policy on sayembara_applicants (identity is just name + contact, per PRD).
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: RegisterApplicantBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const name = body.name?.trim();
  const contact = body.contact?.trim();

  if (!name) {
    return NextResponse.json({ error: "Nama lengkap wajib diisi." }, { status: 400 });
  }
  if (!contact) {
    return NextResponse.json({ error: "Kontak wajib diisi." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi." },
      { status: 500 },
    );
  }

  const { data: sayembara, error: sayembaraError } = await supabase
    .from("sayembara")
    .select("id, status")
    .eq("id", id)
    .maybeSingle();

  if (sayembaraError) {
    return NextResponse.json({ error: sayembaraError.message }, { status: 500 });
  }

  if (!sayembara) {
    return NextResponse.json({ error: "Sayembara tidak ditemukan." }, { status: 404 });
  }

  if (sayembara.status !== "Aktif") {
    return NextResponse.json(
      { error: "Sayembara ini sudah tidak menerima pendaftaran." },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("sayembara_applicants")
    .insert({ sayembara_id: id, applicant_name: name, contact })
    .select("id, applicant_name, contact, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      id: data.id,
      name: data.applicant_name,
      contact: data.contact,
      appliedAt: data.created_at,
    },
    { status: 201 },
  );
}
