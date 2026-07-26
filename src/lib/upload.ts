import { AD_PHOTOS_BUCKET, supabase } from "@/lib/supabase/client";

export const MAX_PHOTOS = 5;
export const MAX_PHOTO_SIZE_MB = 10;

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

export async function compressImageFile(
  file: File,
  maxDim = 1200,
  quality = 0.8,
): Promise<File> {
  if (typeof window === "undefined" || !file.type.startsWith("image/")) {
    return file;
  }

  // Already small enough (under 250KB)
  if (file.size < 250 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const fileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
          const compressedFile = new File([blob], fileName, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        "image/jpeg",
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
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
    return photos.map((photo) => photo.previewUrl);
  }

  const uploads = await Promise.all(
    photos.map(async (photo) => {
      const compressed = await compressImageFile(photo.file);
      const safeName = compressed.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const path = `${Date.now()}-${safeName}`;

      const { error } = await client.storage
        .from(AD_PHOTOS_BUCKET)
        .upload(path, compressed, { contentType: "image/jpeg", upsert: true });

      if (error) throw error;

      return client.storage.from(AD_PHOTOS_BUCKET).getPublicUrl(path).data.publicUrl;
    }),
  );

  return uploads;
}
