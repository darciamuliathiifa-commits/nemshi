"use client";

import { useRef, useState } from "react";
import {
  MAX_PHOTOS,
  MAX_PHOTO_SIZE_MB,
  revokePhotoPreviews,
  toUploadedPhotos,
  validatePhotoFiles,
  type UploadedPhoto,
} from "@/lib/upload";
import { CloseIcon } from "@/components/icons";

interface PhotoUploaderProps {
  id: string;
  label: string;
  photos: UploadedPhoto[];
  onChange: (photos: UploadedPhoto[]) => void;
}

export function PhotoUploader({ id, label, photos, onChange }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList) return;

    const files = Array.from(fileList);
    const combined = [...photos.map((p) => p.file), ...files];
    const validationError = validatePhotoFiles(combined);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onChange([...photos, ...toUploadedPhotos(files)]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleRemove(index: number) {
    const removed = photos[index];
    revokePhotoPreviews([removed]);
    onChange(photos.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="text-[12px] font-bold text-muted-foreground" htmlFor={id}>
        {label}
      </label>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => handleFilesSelected(event.target.files)}
        className="mt-1 block w-full text-[14px] text-charcoal file:mr-3 file:h-9 file:rounded-pill file:border file:border-border file:bg-white file:px-4 file:text-[14px] file:font-bold file:text-charcoal hover:file:bg-surface"
      />

      <p className="mt-1 text-[12px] text-muted-foreground">
        Maks. {MAX_PHOTOS} foto, masing-masing {MAX_PHOTO_SIZE_MB}MB.
      </p>

      {error && <p className="mt-1 text-[12px] text-error">{error}</p>}

      {photos.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {photos.map((photo, index) => (
            <div
              key={photo.previewUrl}
              className="relative h-20 w-20 overflow-hidden rounded-input border border-border-subtle"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.previewUrl}
                alt={photo.file.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                aria-label={`Hapus ${photo.file.name}`}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/60 text-white"
              >
                <CloseIcon width={12} height={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
