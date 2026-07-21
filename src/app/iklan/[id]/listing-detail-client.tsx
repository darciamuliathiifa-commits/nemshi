"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ListingDetail } from "@/lib/listings";
import { formatPriceLabel } from "@/lib/format";
import { VerificationBadge } from "@/components/verification-badge";
import { ReportListingButton } from "@/components/report-listing-button";

export function ListingDetailClient({ listing }: { listing: ListingDetail }) {
  const router = useRouter();
  const [activePhoto, setActivePhoto] = useState(0);
  const [contacted, setContacted] = useState(false);
  const [creatingTraktir, setCreatingTraktir] = useState(false);
  const photos = listing.photos.length > 0 ? listing.photos : [];

  useEffect(() => {
    fetch(`/api/listings/${listing.id}/impression`, { method: "POST" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing.id]);

  async function handleContactClick() {
    try {
      await fetch(`/api/listings/${listing.id}/click`, { method: "POST" });
    } finally {
      window.open(listing.whatsappLink, "_blank", "noopener,noreferrer");
      setContacted(true);
    }
  }

  async function handleTraktir() {
    setCreatingTraktir(true);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productType: "Traktir_Platform", listingId: listing.id }),
    });
    if (response.status === 401) {
      router.push(`/masuk?redirectTo=/iklan/${listing.id}`);
      return;
    }
    const order = await response.json();
    router.push(`/bayar/${order.id}`);
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
          <Link href={`/profil/${listing.provider.id}`} className="font-medium text-text hover:underline">
            {listing.provider.fullName}
          </Link>
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

      {contacted && (
        <div className="rounded-xl border border-black/5 bg-[#f0f4f6] p-4">
          <p className="mb-3 text-sm text-text-secondary">
            Berhasil terhubung dengan penyedia jasa? Dukung pengembangan Nemshi lewat apresiasi
            sukarela.
          </p>
          <button
            onClick={handleTraktir}
            disabled={creatingTraktir}
            className="rounded-xl border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 disabled:opacity-60"
          >
            {creatingTraktir ? "Memproses..." : "Traktir Platform (Rp5.000)"}
          </button>
        </div>
      )}

      <div className="border-t border-black/5 pt-4">
        <ReportListingButton listingId={listing.id} />
      </div>
    </article>
  );
}
