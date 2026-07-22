import { createClient } from "@/lib/supabase/client";

/**
 * Upload gambar langsung dari browser ke Supabase Storage (bucket
 * "uploads", public). Pakai sesi login pengguna yang aktif — bucket
 * harus punya RLS policy yang mengizinkan authenticated users insert
 * ke folder mereka sendiri dan siapa saja select (baca) secara publik.
 * Lihat catatan setup bucket di README/percakapan setup.
 */

const BUCKET = "uploads";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export async function uploadImage(file: File, folder: "avatars" | "listings"): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("Ukuran gambar maksimal 5MB.");
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Belum masuk.");
  }

  const extension = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message || "Gagal mengunggah gambar.");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return publicUrl;
}
