import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { bootstrapUserProfile, getPublicProfile } from "@/lib/users";

/**
 * Dipanggil sekali oleh halaman /daftar tepat setelah supabase.auth.signUp()
 * berhasil, untuk membuat baris profil di public.users (nama, email, peran)
 * dengan id yang sama dengan akun Supabase Auth yang baru dibuat.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Belum masuk" }, { status: 401 });
  }

  const body = await request.json();
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const role = body.role === "Penyedia_Jasa" ? "Penyedia_Jasa" : "Pelanggan";

  if (!fullName) {
    return NextResponse.json({ error: "Nama lengkap wajib diisi" }, { status: 400 });
  }

  await bootstrapUserProfile({
    id: user.id,
    email: user.email!,
    fullName,
    role,
  });

  const profile = await getPublicProfile(user.id);
  return NextResponse.json(profile);
}
