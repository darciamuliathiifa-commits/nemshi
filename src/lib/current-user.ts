import { db } from "@/db";
import { users } from "@/db/schema";

/**
 * Belum ada Supabase Auth (fitur 07 - Autentikasi belum dibangun).
 * Sementara "pengguna saat ini" adalah pengguna pertama di database,
 * agar halaman Akun Saya bisa berfungsi selagi menunggu sesi login asli.
 * Ganti dengan user dari sesi Supabase Auth begitu fitur Autentikasi selesai.
 */
export async function getCurrentUserId(): Promise<string> {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .orderBy(users.createdAt)
    .limit(1);

  if (!user) {
    throw new Error("Belum ada pengguna di database.");
  }

  return user.id;
}
