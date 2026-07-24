import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AD_CATEGORIES } from "@/lib/types";

interface CreateSayembaraBody {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
}

interface SayembaraRow {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  status: string;
  created_at: string;
  profiles: { name: string } | { name: string }[] | null;
}

export async function GET() {
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
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as unknown as SayembaraRow[];
  const ids = rows.map((row) => row.id);

  const applicantCountById = new Map<string, number>();
  if (ids.length > 0) {
    const { data: applicantRows } = await supabase
      .from("sayembara_applicants")
      .select("sayembara_id")
      .in("sayembara_id", ids);

    for (const row of (applicantRows ?? []) as { sayembara_id: string }[]) {
      applicantCountById.set(
        row.sayembara_id,
        (applicantCountById.get(row.sayembara_id) ?? 0) + 1,
      );
    }
  }

  const items = rows.map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      location: row.location,
      status: row.status,
      createdAt: row.created_at,
      ownerName: profile?.name ?? null,
      applicantCount: applicantCountById.get(row.id) ?? 0,
    };
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  let body: CreateSayembaraBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const title = body.title?.trim();
  const description = body.description?.trim();
  const location = body.location?.trim();

  if (!title) {
    return NextResponse.json({ error: "Judul wajib diisi." }, { status: 400 });
  }
  if (!description) {
    return NextResponse.json({ error: "Deskripsi wajib diisi." }, { status: 400 });
  }
  if (!location) {
    return NextResponse.json({ error: "Lokasi wajib diisi." }, { status: 400 });
  }
  if (!body.category || !AD_CATEGORIES.includes(body.category as (typeof AD_CATEGORIES)[number])) {
    return NextResponse.json(
      { error: `Kategori harus salah satu dari: ${AD_CATEGORIES.join(", ")}.` },
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
    .insert({
      owner_id: user.id,
      title,
      description,
      category: body.category,
      location,
    })
    .select("id, title, description, category, location, status, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      location: data.location,
      status: data.status,
      createdAt: data.created_at,
    },
    { status: 201 },
  );
}
