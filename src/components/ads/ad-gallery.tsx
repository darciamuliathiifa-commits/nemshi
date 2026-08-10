"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/components/icons";

const categoryAccent: Record<string, string> = {
  Pendidikan: "from-blue-100 to-blue-50",
  "Makanan & Minuman": "from-amber-100 to-amber-50",
  "Kreatif & Digital": "from-violet-100 to-violet-50",
  "Bantuan & Layanan Harian": "from-emerald-100 to-emerald-50",
  "Barang Baru & Bekas": "from-rose-100 to-rose-50",
  "Perjalanan & Travel": "from-sky-100 to-sky-50",
  "Titipan & Bagasi": "from-orange-100 to-orange-50",
  "Komunitas & Organisasi": "from-indigo-100 to-indigo-50",
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
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activePhoto = photos[activeIndex] ?? photos[0];

  function showPrev() {
    setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }

  function showNext() {
    setActiveIndex((prev) => (prev + 1) % photos.length);
  }

  return (
    <div
      className={`relative aspect-[4/5] w-full overflow-hidden rounded-card border-[2.5px] border-ink bg-gradient-to-br shadow-[3px_3px_0_0_rgba(20,20,20,1)] ${categoryAccent[category] ?? categoryAccent.Lainnya}`}
    >
      {activePhoto && (
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Lihat foto ukuran penuh"
          className="absolute inset-0 h-full w-full cursor-zoom-in"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activePhoto}
            alt={title}
            className="h-full w-full object-cover transition-opacity duration-300"
          />
        </button>
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

      {lightboxOpen && activePhoto && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
          <button
            type="button"
            aria-label="Tutup foto ukuran penuh"
            onClick={() => setLightboxOpen(false)}
            className="absolute inset-0 h-full w-full cursor-zoom-out"
          />

          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Tutup"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/80 bg-black/40 text-white transition-colors hover:bg-white hover:text-charcoal"
          >
            <CloseIcon width={18} height={18} />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrev();
                }}
                aria-label="Foto sebelumnya"
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/80 bg-black/40 text-white transition-colors hover:bg-white hover:text-charcoal sm:left-6"
              >
                <ChevronLeftIcon width={20} height={20} />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                aria-label="Foto berikutnya"
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/80 bg-black/40 text-white transition-colors hover:bg-white hover:text-charcoal sm:right-6"
              >
                <ChevronRightIcon width={20} height={20} />
              </button>
            </>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activePhoto}
            alt={title}
            className="relative z-0 max-h-full max-w-full object-contain"
          />

          {photos.length > 1 && (
            <span className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-pill bg-black/50 px-3 py-1 text-[12px] font-bold text-white">
              {activeIndex + 1} / {photos.length}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
