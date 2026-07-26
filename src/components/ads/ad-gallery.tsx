"use client";

import { useState } from "react";

const categoryAccent: Record<string, string> = {
  Pendidikan: "from-blue-100 to-blue-50",
  "Makanan & Minuman": "from-amber-100 to-amber-50",
  "Kreatif & Digital": "from-violet-100 to-violet-50",
  "Bantuan & Layanan Harian": "from-emerald-100 to-emerald-50",
  "Barang Baru & Bekas": "from-rose-100 to-rose-50",
  Lainnya: "from-zinc-100 to-zinc-50",
};

const statusAccent: Record<string, string> = {
  Aktif: "bg-success text-white",
  "Menunggu Validasi": "bg-brand-dark text-charcoal",
  Terjual: "bg-charcoal text-white",
  Selesai: "bg-charcoal text-white",
  Kedaluwarsa: "bg-muted text-white",
  Ditutup: "bg-error text-white",
};

interface AdGalleryProps {
  photos: string[];
  title: string;
  category: string;
  kind: "produk" | "jasa";
  status: string;
}

export function AdGallery({
  photos,
  title,
  category,
  kind,
  status,
}: AdGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activePhoto = photos[activeIndex] ?? photos[0];

  return (
    <div
      className={`relative aspect-[4/5] w-full overflow-hidden rounded-card border-[2.5px] border-ink bg-gradient-to-br shadow-[3px_3px_0_0_rgba(20,20,20,1)] ${categoryAccent[category] ?? categoryAccent.Lainnya}`}
    >
      {activePhoto && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={activePhoto}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
        />
      )}

      {activePhoto && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      )}

      {/* Badges Overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5">
        <span className="rounded-badge bg-highlight px-3 py-1 text-[12px] leading-4 font-bold text-white">
          {category}
        </span>
        <div className="flex flex-col items-end gap-2">
          <span className="rounded-badge bg-charcoal/80 px-3 py-1 text-[12px] leading-4 font-bold text-white">
            {kind === "produk" ? "Produk" : "Jasa"}
          </span>
          <span
            className={`rounded-badge px-3 py-1 text-[12px] leading-4 font-bold ${statusAccent[status] ?? statusAccent.Aktif}`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* Thumbnails list */}
      {photos.length > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-20 flex gap-2.5 overflow-x-auto p-4 scrollbar-none">
          {photos.map((url, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={url}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Lihat foto ${index + 1}`}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-input border-2 transition-all hover:scale-105 ${
                  isActive
                    ? "border-cta ring-2 ring-cta shadow-md scale-105"
                    : "border-white opacity-80 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
