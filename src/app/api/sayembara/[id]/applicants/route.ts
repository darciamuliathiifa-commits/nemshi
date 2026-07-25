import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

interface RegisterApplicantBody {
  name?: string;
  contact?: string;
}

interface ApplicantRow {
  id: string;
  applicant_name: string;
  contact: string;
  created_at: string;
}

// Owner-only — RLS on sayembara_applicants ("Sayembara owners can view
// applicants") already restricts this to auth.uid() = sayembara.owner_id,
// this just gives a clean 401/403/404 instead of a silent empty list.
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Belum masuk akun." }, { status: 401 });
  }

  const { data: sayembara, error: sayembaraError } = await supabase
    .from("sayembara")
    .select("id, title, owner_id")
    .eq("id", id)
    .maybeSingle();

  if (sayembaraError) {
    return NextResponse.json({ error: sayembaraError.message }, { status: 500 });
  }
  if (!sayembara) {
    return NextResponse.json({ error: "Sayembara tidak ditemukan." }, { status: 404 });
  }
  if (sayembara.owner_id !== user.id) {
    return NextResponse.json(
      { error: "Kamu bukan pemilik sayembara ini." },
      { status: 403 },
    );
  }

  const { data, error } = await supabase
    .from("sayembara_applicants")
    .select("id, applicant_name, contact, created_at")
    .eq("sayembara_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as ApplicantRow[];

  return NextResponse.json({
    sayembaraTitle: sayembara.title,
    applicants: rows.map((row) => ({
      id: row.id,
      name: row.applicant_name,
      contact: row.contact,
      appliedAt: row.created_at,
    })),
  });
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
    .select("id, status, title, owner_id")
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

  // The applicant registering usually isn't logged in as the sayembara
  // owner (often not logged in at all), so this write needs the
  // service-role client — same reasoning as mayar_transactions.
  const adminClient = createSupabaseAdminClient();
  if (adminClient) {
    await adminClient.from("notifications").insert({
      user_id: sayembara.owner_id,
      type: "sayembara_applicant",
      title: "Ada pendaftar baru",
      body: `${name} mendaftar sebagai penyedia jasa untuk sayembara "${sayembara.title}".`,
      link: `/sayembara/${id}/pendaftar`,
    });
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
