"use client";

import { useRef } from "react";
import Link from "next/link";
import type { Ad } from "@/lib/types";
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon, StarIcon } from "@/components/icons";

export function FeaturedCarousel({ ads }: { ads: Ad[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  }

  if (ads.length === 0) return null;

  return (
    <section className="mb-10 rounded-card border-2 border-ink bg-charcoal p-6 shadow-[5px_5px_0_0_rgba(255,199,44,1)] sm:p-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <StarIcon width={22} height={22} className="text-brand" />
          <h2 className="text-2xl font-bold text-white">Iklan Unggulan</h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Sebelumnya"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-brand bg-transparent text-brand transition-colors hover:bg-brand hover:text-charcoal"
          >
            <ChevronLeftIcon width={18} height={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Berikutnya"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-brand bg-transparent text-brand transition-colors hover:bg-brand hover:text-charcoal"
          >
            <ChevronRightIcon width={18} height={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ads.map((ad) => (
          <Link
            key={ad.id}
            href={`/jelajahi/${ad.id}`}
            className="group relative flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-card border-2 border-brand/70 bg-[#1f1f1f] transition-colors hover:border-brand sm:w-[360px]"
          >
            <span className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-badge bg-brand px-3 py-1.5 text-[12px] leading-4 font-bold text-charcoal">
              <StarIcon width={12} height={12} />
              Unggulan
            </span>

            <div className="flex h-36 items-start bg-gradient-to-br from-brand/25 to-transparent px-5 py-4">
              <span className="rounded-badge bg-brand px-3.5 py-1.5 text-[13px] leading-4 font-bold text-charcoal">
                {ad.category}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-2 p-5">
              <h3 className="line-clamp-2 text-lg font-bold leading-6 text-white">
                {ad.title}
              </h3>
              <p className="text-lg font-bold text-brand">{ad.priceLabel}</p>
              <div className="mt-1 flex items-center gap-1.5 text-[14px] font-normal text-white/50">
                <MapPinIcon width={15} height={15} />
                <span>{ad.location}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
