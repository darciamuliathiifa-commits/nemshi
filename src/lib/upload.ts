import { AD_PHOTOS_BUCKET, supabase } from "@/lib/supabase/client";

export const MAX_PHOTOS = 5;
export const MAX_PHOTO_SIZE_MB = 5;

export interface UploadedPhoto {
  file: File;
  previewUrl: string;
}

export function validatePhotoFiles(files: File[]): string | null {
  if (files.length > MAX_PHOTOS) {
    return `Maksimal ${MAX_PHOTOS} foto.`;
  }

  const tooLarge = files.find((file) => file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024);
  if (tooLarge) {
    return `Ukuran "${tooLarge.name}" melebihi ${MAX_PHOTO_SIZE_MB}MB.`;
  }

  return null;
}

export function toUploadedPhotos(files: File[]): UploadedPhoto[] {
  return files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
}

export function revokePhotoPreviews(photos: UploadedPhoto[]) {
  photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
}

export async function uploadPhotos(photos: UploadedPhoto[]): Promise<string[]> {
  const client = supabase;
  if (!client) {
    // No Supabase project configured yet — fall back to local preview URLs
    // so the flow stays testable end-to-end during development.
    return photos.map((photo) => photo.previewUrl);
  }

  const uploads = await Promise.all(
    photos.map(async (photo) => {
      const path = `${Date.now()}-${photo.file.name}`;
      const { error } = await client.storage
        .from(AD_PHOTOS_BUCKET)
        .upload(path, photo.file);

      if (error) throw error;

      return client.storage.from(AD_PHOTOS_BUCKET).getPublicUrl(path).data.publicUrl;
    }),
  );

  return uploads;
}
