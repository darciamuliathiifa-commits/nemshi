"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { ListingDetail } from "@/lib/listings";
import { formatPriceLabel } from "@/lib/format";
import { VerificationBadge } from "@/components/verification-badge";
import { ReportListingButton } from "@/components/report-listing-button";
import { SaveButton } from "@/components/save-button";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function ListingDetailClient({
  listing,
  isSaved,
}: {
  listing: ListingDetail;
  isSaved: boolean;
}) {
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
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:grid-rows-[auto_auto]"
    >
      {/* Foto */}
      <motion.div
        variants={fadeUp}
        className="order-1 overflow-hidden rounded-3xl bg-white border border-black/10 lg:order-none lg:col-start-1 lg:row-start-1"
      >
        <div className="relative aspect-[4/3] w-full bg-surface">
          {photos.length > 0 ? (
            <Image
              src={photos[activePhoto]}
              alt={`${listing.title} - foto ${activePhoto + 1}`}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 768px, 100vw"
              priority
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
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-sm transition-transform hover:scale-105 hover:bg-white"
              >
                ‹
              </button>
              <button
                aria-label="Foto berikutnya"
                onClick={() => setActivePhoto((i) => (i === photos.length - 1 ? 0 : i + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-sm transition-transform hover:scale-105 hover:bg-white"
              >
                ›
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {photos.map((photo, index) => (
                  <button
                    key={photo}
                    aria-label={`Lihat foto ${index + 1}`}
                    onClick={() => setActivePhoto(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === activePhoto ? "w-5 bg-white" : "w-2 bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {listing.isPriority && (
            <span className="absolute left-3 top-3 rounded bg-accent px-2.5 py-1 text-xs font-semibold text-white">
              Prioritas
            </span>
          )}
        </div>
      </motion.div>

      {/* Info & CTA */}
      <motion.div
        variants={fadeUp}
        className="rounded-3xl order-2 flex flex-col gap-4 bg-white p-6 border border-black/10 lg:order-none lg:sticky lg:top-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start"
      >
        <span className="w-fit rounded bg-surface-tint px-3 py-1 text-xs font-semibold text-primary">
          {listing.category.name} · {listing.area.name}
        </span>
        <h1 className="font-display text-2xl font-semibold leading-tight text-text">
          {listing.title}
        </h1>

        <Link
          href={`/profil/${listing.provider.id}`}
          className="flex items-center gap-2.5 rounded-2xl bg-surface p-2.5 transition-colors hover:bg-surface-tint"
        >
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-white">
            {listing.provider.avatarUrl && (
              <Image
                src={listing.provider.avatarUrl}
                alt={listing.provider.fullName}
                fill
                className="object-cover"
                sizes="36px"
              />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text">
              {listing.provider.fullName}
            </p>
            <VerificationBadge status={listing.provider.verificationStatus} />
          </div>
        </Link>

        <p className="font-display text-xl font-semibold text-primary">
          {formatPriceLabel(listing.priceType, listing.priceMin, listing.priceMax)}
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleContactClick}
          className="rounded-full bg-primary px-6 py-3 text-center font-semibold text-white"
        >
          Hubungi via WhatsApp
        </motion.button>
        <SaveButton listingId={listing.id} initialSaved={isSaved} variant="inline" />
        <p className="text-xs text-text-secondary">
          Nemshi menjamin exposure (tampilan dan klik), bukan kepastian kesepakatan kerja. Seluruh
          negosiasi dan transaksi dilakukan mandiri di WhatsApp.
        </p>

        {contacted && (
          <div className="rounded-2xl border border-primary/20 bg-surface-tint p-4">
            <p className="mb-3 text-sm text-text-secondary">
              Berhasil terhubung dengan penyedia jasa? Dukung pengembangan Nemshi lewat apresiasi
              sukarela.
            </p>
            <button
              onClick={handleTraktir}
              disabled={creatingTraktir}
              className="rounded-full w-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-white disabled:opacity-60"
            >
              {creatingTraktir ? "Memproses..." : "Traktir Platform (Rp5.000)"}
            </button>
          </div>
        )}

        <div className="border-t border-black/5 pt-3">
          <ReportListingButton listingId={listing.id} />
        </div>
      </motion.div>

      {/* Deskripsi */}
      <motion.div
        variants={fadeUp}
        className="rounded-3xl order-3 bg-white p-6 border border-black/10 sm:p-8 lg:order-none lg:col-start-1 lg:row-start-2"
      >
        <h2 className="font-display text-lg font-semibold text-text">Deskripsi</h2>
        <p className="mt-2 whitespace-pre-line text-text-secondary">{listing.description}</p>
      </motion.div>
    </motion.div>
  );
}
