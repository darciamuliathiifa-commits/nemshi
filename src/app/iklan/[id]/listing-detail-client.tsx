"use client";

import Image from "next/image";
import { useState } from "react";
import type { ListingDetail } from "@/lib/listings";
import { formatPriceLabel } from "@/lib/format";
import { VerificationBadge } from "@/components/verification-badge";

export function ListingDetailClient({ listing }: { listing: ListingDetail }) {
  const [activePhoto, setActivePhoto] = useState(0);
  const photos = listing.photos.length > 0 ? listing.photos : [];

  async function handleContactClick() {
    try {
      await fetch(`/api/listings/${listing.id}/click`, { method: "POST" });
    } finally {
      window.open(listing.whatsappLink, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <article className="flex flex-col gap-6">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f0f4f6]">
        {photos.length > 0 ? (
          <Image
            src={photos[activePhoto]}
            alt={`${listing.title} - foto ${activePhoto + 1}`}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 768px, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-secondary">
            Tidak ada foto
          </div>
        )}

        {photos.length > 1 && (
          <>
            <button
              aria-label="Foto sebelumnya"
              onClick={() => setActivePhoto((i) => (i === 0 ? photos.length - 1 : i - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
            >
              ‹
            </button>
            <button
              aria-label="Foto berikutnya"
              onClick={() => setActivePhoto((i) => (i === photos.length - 1 ? 0 : i + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              {photos.map((photo, index) => (
                <button
                  key={photo}
                  aria-label={`Lihat foto ${index + 1}`}
                  onClick={() => setActivePhoto(index)}
                  className={`h-2 w-2 rounded-full ${
                    index === activePhoto ? "bg-primary" : "bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {listing.isPriority && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white">
            Prioritas
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium text-text-secondary">
          {listing.category.name} · {listing.area.name}
        </span>
        <h1 className="text-2xl font-bold text-text">{listing.title}</h1>
        <div className="flex items-center gap-2">
          <span className="font-medium text-text">{listing.provider.fullName}</span>
          <VerificationBadge status={listing.provider.verificationStatus} />
        </div>
        <p className="text-lg font-semibold text-primary">
          {formatPriceLabel(listing.priceType, listing.priceMin, listing.priceMax)}
        </p>
      </div>

      <div>
        <h2 className="mb-2 font-semibold text-text">Deskripsi</h2>
        <p className="whitespace-pre-line text-text-secondary">{listing.description}</p>
      </div>

      <button
        onClick={handleContactClick}
        className="rounded-xl bg-primary px-6 py-3 text-center font-semibold text-white shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
      >
        Hubungi via WhatsApp
      </button>
      <p className="text-xs text-text-secondary">
        Nemshi menjamin exposure (tampilan dan klik), bukan kepastian kesepakatan kerja. Seluruh
        negosiasi dan transaksi dilakukan mandiri di WhatsApp.
      </p>
    </article>
  );
}
