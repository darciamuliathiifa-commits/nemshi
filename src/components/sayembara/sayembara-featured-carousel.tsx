"use client";

import { memo, useRef } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon, StarIcon } from "@/components/icons";
import type { SayembaraListItem } from "@/components/sayembara/sayembara-browser";

export const SayembaraFeaturedCarousel = memo(function SayembaraFeaturedCarousel({
  items,
}: {
  items: SayembaraListItem[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <section className="mb-10 rounded-card border-[2.5px] border-ink bg-gradient-to-br from-brand-dark to-brand p-4 shadow-[5px_5px_0_0_rgba(20,20,20,1)] sm:p-8">
      <div className="mb-4 flex items-center justify-between sm:mb-5">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <StarIcon width={18} height={18} className="text-charcoal sm:hidden" />
          <StarIcon width={22} height={22} className="hidden text-charcoal sm:block" />
          <div>
            <h2 className="text-lg font-bold text-charcoal sm:text-2xl">Sayembara Unggulan</h2>
            <p className="text-[11px] font-normal text-charcoal/70 sm:text-[12px]">
              Slot eksklusif Paket Plus, tayang 3 hari
            </p>
          </div>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Sebelumnya"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-white text-charcoal transition-colors hover:bg-charcoal hover:text-white"
          >
            <ChevronLeftIcon width={18} height={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Berikutnya"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-white text-charcoal transition-colors hover:bg-charcoal hover:text-white"
          >
            <ChevronRightIcon width={18} height={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/sayembara/${item.id}`}
            className="group relative flex w-[78vw] max-w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-card border-[2.5px] border-ink bg-white shadow-[3px_3px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-1 sm:w-[360px] sm:max-w-none"
          >
            <span className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-badge bg-charcoal px-2.5 py-1 text-[10.5px] leading-3 font-bold text-brand sm:right-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[12px] sm:leading-4">
              <StarIcon width={11} height={11} />
              Unggulan
            </span>

            <div className="flex h-24 items-start bg-gradient-to-br from-brand/40 to-brand/10 px-3.5 py-3 sm:h-36 sm:px-5 sm:py-4">
              <span className="rounded-badge bg-charcoal px-2.5 py-1 text-[11px] leading-3 font-bold text-white sm:px-3.5 sm:py-1.5 sm:text-[13px] sm:leading-4">
                {item.category}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-1.5 p-3.5 sm:gap-2 sm:p-5">
              <h3 className="line-clamp-2 text-[14px] font-bold leading-5 text-charcoal sm:text-lg sm:leading-6">
                {item.title}
              </h3>
              {item.price_label && (
                <p className="text-base font-bold text-success sm:text-lg">{item.price_label}</p>
              )}
              {item.location && (
                <div className="mt-0.5 flex items-center gap-1.5 text-[12px] font-normal text-muted-foreground sm:mt-1 sm:text-[14px]">
                  <MapPinIcon width={13} height={13} className="shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
});
