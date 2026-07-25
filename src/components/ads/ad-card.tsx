"use client";

import { memo } from "react";
import Link from "next/link";
import type { Ad } from "@/lib/types";
import { BookmarkIcon, MapPinIcon } from "@/components/icons";
import { useSavedAds } from "@/lib/saved-ads-store";

const categoryAccent: Record<Ad["category"], string> = {
  Pendidikan: "from-blue-100 to-blue-50",
  "Makanan & Minuman": "from-amber-100 to-amber-50",
  "Kreatif & Digital": "from-violet-100 to-violet-50",
  "Bantuan & Layanan Harian": "from-emerald-100 to-emerald-50",
  "Barang Baru & Bekas": "from-rose-100 to-rose-50",
  Lainnya: "from-zinc-100 to-zinc-50",
};

export const AdCard = memo(function AdCard({ ad }: { ad: Ad }) {
  const { isSaved, toggleSaved } = useSavedAds();
  const saved = isSaved(ad.id);

  const secondaryMeta =
    ad.kind === "produk"
      ? [ad.condition, ad.deliveryMethod].filter(Boolean).join(" · ")
      : [ad.scope, ad.estimatedDuration].filter(Boolean).join(" · ");

  const whatsappHref = `https://wa.me/${ad.whatsappNumber}?text=${encodeURIComponent(
    `Halo, saya tertarik dengan iklan "${ad.title}" di Nemshi.`,
  )}`;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-card border-[2.5px] border-ink bg-white shadow-[3px_3px_0_0_rgba(20,20,20,1)] transition-transform duration-200 hover:-translate-y-1">
      <Link href={`/jelajahi/${ad.id}`} className="flex flex-1 flex-col">
        <div
          className={`flex h-36 items-start justify-between bg-gradient-to-br px-4 py-3 ${categoryAccent[ad.category]}`}
        >
          <span className="rounded-badge bg-highlight px-3 py-1 text-[12px] leading-4 font-bold text-white">
            {ad.category}
          </span>

          <div className="flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                toggleSaved(ad.id);
              }}
              aria-pressed={saved}
              aria-label={saved ? "Hapus dari tersimpan" : "Simpan iklan"}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-sm transition-colors hover:bg-white"
            >
              <BookmarkIcon
                width={16}
                height={16}
                fill={saved ? "currentColor" : "none"}
                className={saved ? "text-cta" : "text-charcoal"}
              />
            </button>
            <span className="rounded-badge bg-charcoal/80 px-3 py-1 text-[12px] leading-4 font-bold text-white">
              {ad.kind === "produk" ? "Produk" : "Jasa"}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-5 pt-5 text-left">
          <h3 className="line-clamp-2 min-h-[2.5em] text-base font-bold leading-5 text-charcoal">
            {ad.title}
          </h3>

          <p className="mt-2 text-lg font-bold leading-6 text-cta">{ad.priceLabel}</p>

          <div className="mt-3 flex items-center gap-1.5 text-[13px] leading-4 font-normal text-muted-foreground">
            <MapPinIcon width={14} height={14} className="shrink-0" />
            <span className="truncate">{ad.location}</span>
          </div>

          {secondaryMeta && (
            <p className="mt-1 text-[13px] leading-4 font-normal text-muted-foreground">
              {secondaryMeta}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between gap-2 border-t border-border-subtle pt-3">
            <span className="truncate text-[12px] leading-4 font-bold text-muted-foreground">
              {ad.sellerName}
            </span>
            <span className="shrink-0 text-[12px] leading-4 font-bold text-muted-foreground">
              {ad.postedAt}
            </span>
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-2 p-5 pt-4">
        <Link
          href={`/jelajahi/${ad.id}`}
          className="flex h-10 flex-1 items-center justify-center rounded-pill border-2 border-ink text-[13px] font-bold text-charcoal transition-colors hover:bg-surface"
        >
          Lihat Detail
        </Link>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="flex h-10 flex-1 items-center justify-center rounded-pill bg-charcoal text-[13px] font-bold text-white transition-colors hover:bg-black"
        >
          Hubungi WA
        </a>
      </div>
    </div>
  );
});
