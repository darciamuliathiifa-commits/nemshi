"use client";

import { memo } from "react";
import Link from "next/link";
import type { Ad } from "@/lib/types";
import { BookmarkIcon, MapPinIcon } from "@/components/icons";
import { useSavedAds } from "@/lib/saved-ads-store";
import { ShareButton } from "@/components/ads/share-button";

const categoryAccent: Record<Ad["category"], string> = {
  Pendidikan: "from-blue-100 to-blue-50",
  "Makanan & Minuman": "from-amber-100 to-amber-50",
  "Kreatif & Digital": "from-violet-100 to-violet-50",
  "Bantuan & Layanan Harian": "from-emerald-100 to-emerald-50",
  "Barang Baru & Bekas": "from-rose-100 to-rose-50",
  "Perjalanan & Travel": "from-sky-100 to-sky-50",
  "Titipan & Bagasi": "from-orange-100 to-orange-50",
  "Event & Komunitas": "from-indigo-100 to-indigo-50",
  Lainnya: "from-zinc-100 to-zinc-50",
};

export const AdCard = memo(function AdCard({ ad }: { ad: Ad }) {
  const { isSaved, toggleSaved } = useSavedAds();
  const saved = isSaved(ad.id);

  const secondaryMeta =
    ad.kind === "produk"
      ? [ad.condition, ad.deliveryMethod].filter(Boolean).join(" · ")
      : [ad.scope, ad.estimatedDuration].filter(Boolean).join(" · ");

  // Without a number this would be "https://wa.me/?text=…" — WhatsApp opens
  // with no recipient, so send people to the detail page instead of a dead end.
  const hasWhatsapp = Boolean(ad.whatsappNumber?.trim());
  const whatsappHref = `https://wa.me/${ad.whatsappNumber}?text=${encodeURIComponent(
    `Halo, saya tertarik dengan iklan "${ad.title}" di Nemsy!`,
  )}`;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-card border-2 border-ink bg-white shadow-[2px_2px_0_0_#006451] transition-transform duration-200 hover:-translate-y-1 sm:border-[2.5px] sm:shadow-[3px_3px_0_0_#006451]">
      <Link href={`/jelajahi/${ad.id}`} className="flex flex-1 flex-col">
        <div
          className={`relative flex h-24 items-start justify-end overflow-hidden bg-gradient-to-br px-2.5 py-2 sm:h-40 sm:px-4 sm:py-3 ${categoryAccent[ad.category]}`}
        >
          {ad.coverPhoto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ad.coverPhoto}
              alt={ad.title}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: ad.coverFocalPoint || "50% 0%" }}
            />
          )}
          <div className="relative z-10 flex flex-col items-end gap-1 sm:gap-2">
            <div className="flex items-center gap-1.5">
              <ShareButton title={ad.title} path={`/jelajahi/${ad.id}`} compact />
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  toggleSaved(ad.id);
                }}
                aria-pressed={saved}
                aria-label={saved ? "Hapus dari tersimpan" : "Simpan iklan"}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-sm transition-colors hover:bg-white sm:h-8 sm:w-8"
              >
                <BookmarkIcon
                  width={13}
                  height={13}
                  fill={saved ? "currentColor" : "none"}
                  className={saved ? "text-cta" : "text-charcoal"}
                />
              </button>
            </div>
            <span className="hidden rounded-badge bg-charcoal/80 px-3 py-1 text-[12px] leading-4 font-bold text-white sm:inline-block">
              {ad.kind === "produk" ? "Produk" : "Jasa"}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-2.5 pt-2.5 text-left sm:px-5 sm:pt-5">
          <h3 className="line-clamp-2 min-h-[2.2em] text-[12.5px] font-bold leading-4 text-charcoal sm:min-h-[2.5em] sm:text-base sm:leading-5">
            {ad.title}
          </h3>

          {ad.priceLabel && (
            <p className="mt-1 text-[13px] font-bold leading-4 text-success sm:mt-2 sm:text-lg sm:leading-6">
              {ad.priceLabel}
            </p>
          )}

          <div className="mt-1.5 flex items-center gap-1 text-[10.5px] leading-3 font-normal text-muted-foreground sm:mt-3 sm:gap-1.5 sm:text-[13px] sm:leading-4">
            <MapPinIcon width={11} height={11} className="shrink-0" />
            <span className="truncate">{ad.location}</span>
          </div>

          {secondaryMeta && (
            <p className="mt-1 line-clamp-1 text-[10.5px] leading-3 font-normal text-muted-foreground sm:text-[13px] sm:leading-4">
              {secondaryMeta}
            </p>
          )}

          <div className="mt-2 flex items-center justify-between gap-2 border-t border-border-subtle pt-2 sm:mt-4 sm:pt-3">
            <span className="truncate text-[10px] leading-3 font-bold text-muted-foreground sm:text-[12px] sm:leading-4">
              {ad.sellerName}
            </span>
            <span className="shrink-0 text-[10px] leading-3 font-bold text-muted-foreground sm:text-[12px] sm:leading-4">
              {ad.postedAt}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-1.5 p-2.5 pt-2 sm:gap-2 sm:p-5 sm:pt-4">
        <Link
          href={`/jelajahi/${ad.id}`}
          className="flex h-7 flex-1 items-center justify-center rounded-pill border-2 border-ink bg-white text-[10.5px] font-bold text-charcoal transition-colors hover:bg-surface sm:h-10 sm:text-[13px]"
        >
          Detail
        </Link>
        {hasWhatsapp ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="flex h-7 flex-1 items-center justify-center rounded-pill bg-success text-[10.5px] font-bold text-white transition-colors hover:brightness-90 sm:h-10 sm:text-[13px]"
          >
            Chat WA
          </a>
        ) : (
          <span
            aria-disabled="true"
            title="Penjual belum melengkapi nomor WhatsApp"
            className="flex h-7 flex-1 cursor-not-allowed items-center justify-center rounded-pill bg-surface text-[10.5px] font-bold text-muted-foreground sm:h-10 sm:text-[13px]"
          >
            Chat WA
          </span>
        )}
      </div>
    </div>
  );
});
