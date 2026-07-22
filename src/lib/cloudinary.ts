/**
 * Upload gambar langsung dari browser ke Cloudinary lewat unsigned upload
 * preset — tidak lewat server kita (menghindari batas payload serverless
 * function), dan tidak butuh API key/secret di client. Preset harus
 * dikonfigurasi "Unsigned" di dashboard Cloudinary (Settings -> Upload).
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Upload foto belum dikonfigurasi (Cloudinary belum diatur).");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("Ukuran gambar maksimal 5MB.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const text = await response.text();
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`Upload gagal (HTTP ${response.status}): ${text.slice(0, 200)}`);
  }

  if (!response.ok) {
    const message =
      typeof body.error === "object" && body.error && "message" in body.error
        ? String((body.error as { message: unknown }).message)
        : `Upload gagal (HTTP ${response.status}).`;
    throw new Error(message);
  }

  if (typeof body.secure_url !== "string") {
    throw new Error("Respons Cloudinary tidak berisi URL gambar.");
  }

  return body.secure_url;
}
