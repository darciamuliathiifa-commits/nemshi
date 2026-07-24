import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
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

  const [{ data: profile, error: profileError }, { count: activeAdsCount }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, name, email, location, whatsapp_number, avatar_url, created_at")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("ads")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", user.id)
        .eq("status", "Aktif"),
    ]);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  if (!profile) {
    return NextResponse.json({ error: "Profil tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({
    id: profile.id,
    name: profile.name,
    email: profile.email,
    location: profile.location,
    whatsappNumber: profile.whatsapp_number,
    avatarUrl: profile.avatar_url,
    joinedYear: new Date(profile.created_at).getFullYear(),
    activeAdsCount: activeAdsCount ?? 0,
  });
}

interface UpdateProfileBody {
  name?: string;
  location?: string;
  whatsappNumber?: string;
}

export async function PUT(request: Request) {
  let body: UpdateProfileBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const updates: Record<string, string> = {};
  if (typeof body.name === "string") {
    if (!body.name.trim()) {
      return NextResponse.json({ error: "Nama tidak boleh kosong." }, { status: 400 });
    }
    updates.name = body.name.trim();
  }
  if (typeof body.location === "string") {
    updates.location = body.location.trim();
  }
  if (typeof body.whatsappNumber === "string") {
    updates.whatsapp_number = body.whatsappNumber.trim();
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
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select("id, name, email, location, whatsapp_number, avatar_url, created_at")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Profil tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({
    id: data.id,
    name: data.name,
    email: data.email,
    location: data.location,
    whatsappNumber: data.whatsapp_number,
    avatarUrl: data.avatar_url,
    joinedYear: new Date(data.created_at).getFullYear(),
  });
}
