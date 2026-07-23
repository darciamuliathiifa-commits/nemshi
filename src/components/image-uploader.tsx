"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadImage } from "@/lib/storage";

export function ImageUploader({
  value,
  onChange,
  onRemove,
  folder,
  aspectClassName = "aspect-[4/3]",
}: {
  value: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder: "avatars" | "listings";
  aspectClassName?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah gambar.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {value ? (
        <div className={`relative ${aspectClassName} w-full overflow-hidden bg-black/5`}>
          <Image src={value} alt="" fill className="object-cover" unoptimized />
          <div className="absolute inset-x-0 bottom-0 flex divide-x divide-black/10 bg-white/90 text-[11px] font-medium">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex-1 py-1 text-text hover:bg-white disabled:opacity-60"
            >
              {uploading ? "..." : "Ganti"}
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                disabled={uploading}
                className="flex-1 py-1 text-red-600 hover:bg-white disabled:opacity-60"
              >
                Hapus
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`flex ${aspectClassName} w-full items-center justify-center border-2 border-dashed border-black/10 px-2 text-center text-xs text-text-secondary hover:border-primary hover:text-primary disabled:opacity-60`}
        >
          {uploading ? "Mengunggah..." : "+ Unggah Foto"}
        </button>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
