"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion } from "framer-motion";
import { SaveButton } from "@/components/save-button";
import { formatPriceLabel } from "@/lib/format";
import type { ListingSummary } from "@/lib/listings";

type Testimonial = {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  revieweeName: string;
  revieweeId: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const CARD_TINTS = ["bg-primary", "bg-accent", "bg-text"];

function FeaturedListingsCarousel({
  listings,
  savedListingIds,
}: {
  listings: ListingSummary[];
  savedListingIds: string[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const savedSet = new Set(savedListingIds);

  function scrollByCards(direction: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  }

  if (listings.length === 0) return null;

  return (
    <section className="mt-6 bg-white p-6 border border-black/10 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Penawaran Jasa
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-text">Iklan Terbaru</h2>
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button
            onClick={() => scrollByCards(-1)}
            aria-label="Sebelumnya"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-text transition-colors hover:bg-surface"
          >
            ‹
          </button>
          <button
            onClick={() => scrollByCards(1)}
            aria-label="Berikutnya"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-text transition-colors hover:bg-surface"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {listings.map((listing, index) => {
          const tint = CARD_TINTS[index % CARD_TINTS.length];
          return (
            <Link
              key={listing.id}
              href={`/iklan/${listing.id}`}
              className="group relative flex w-64 shrink-0 snap-start flex-col overflow-hidden shadow-sm transition-shadow hover:shadow-lg sm:w-72"
            >
              <SaveButton listingId={listing.id} initialSaved={savedSet.has(listing.id)} />
              <div className={`flex flex-1 flex-col p-5 text-white ${tint}`}>
                <span className="inline-block w-fit rounded bg-white/15 px-2.5 py-1 text-xs font-medium">
                  {listing.category.name} · {listing.area.name}
                </span>
                <div className="mt-6">
                  <h3 className="font-display text-xl font-semibold leading-tight line-clamp-2">
                    {listing.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/80">
                    {formatPriceLabel(listing.priceType, listing.priceMin, listing.priceMax)}
                  </p>
                </div>
              </div>
              <div className="relative h-40 w-full shrink-0 overflow-hidden bg-surface">
                {listing.coverPhotoUrl ? (
                  <Image
                    src={listing.coverPhotoUrl}
                    alt={listing.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="288px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-text-secondary">
                    Tidak ada foto
                  </div>
                )}
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-white px-3 py-1.5 text-xs font-semibold text-text shadow-sm">
                  Lihat Detail
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center">
        <Link href="/jelajahi">
          <motion.span
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-semibold text-white"
          >
            Lihat Semua Penawaran
            <span aria-hidden>→</span>
          </motion.span>
        </Link>
      </div>
    </section>
  );
}

const QUICK_ACTIONS = [
  {
    href: "/jelajahi",
    icon: "🧭",
    title: "Mulai Jelajahi",
    desc: "Lihat semua iklan jasa yang tersedia di Nemshi.",
    className: "bg-primary text-white",
  },
  {
    href: "/sayembara",
    icon: "🔍",
    title: "Papan Permintaan",
    desc: "Belum nemu penyedianya? Pasang permintaanmu di sini.",
    className: "bg-accent text-white",
  },
  {
    href: "/pasang-iklan",
    icon: "📢",
    title: "Pasang Iklan Gratis",
    desc: "Tawarkan jasamu dan tampil di direktori Nemshi.",
    className: "border border-black/5 bg-white text-text",
  },
];

export function LandingPage({
  featuredListings,
  listingCount,
  categoryCount,
  areaCount,
  testimonials,
  savedListingIds,
}: {
  featuredListings: ListingSummary[];
  listingCount: number;
  categoryCount: number;
  areaCount: number;
  testimonials: Testimonial[];
  savedListingIds: string[];
}) {
  const stats = [
    { label: "Iklan aktif", value: listingCount },
    { label: "Kategori jasa", value: categoryCount },
    { label: "Area di Mesir", value: areaCount },
  ];

  return (
    <div className="bg-surface-tint">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero panel */}
        <section className="overflow-hidden bg-white border border-black/10">
          <div className="grid gap-6 p-8 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-10 lg:p-14">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            >
              <motion.span
                variants={fadeUp}
                className="inline-block rounded bg-surface-tint px-3 py-1 text-xs font-semibold tracking-wide text-primary"
              >
                Direktori Jasa Masisir
              </motion.span>
              <motion.h1
                variants={fadeUp}
                className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-text sm:text-5xl"
              >
                Kami hubungkan kamu dengan{" "}
                <span className="italic text-accent">jasa terpercaya</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-4 max-w-md text-text-secondary">
                Direktori iklan jasa untuk Mahasiswa Indonesia di Mesir — temukan penyedia jasa dan
                hubungi langsung via WhatsApp, tanpa perantara.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center gap-4">
                <Link href="/jelajahi" className="group">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-semibold text-white"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                    Mulai Jelajahi
                  </motion.span>
                </Link>
                <Link
                  href="/sayembara"
                  className="text-sm font-semibold text-text underline decoration-accent/50 decoration-2 underline-offset-4 hover:text-accent"
                >
                  Cari Jasa (Papan Permintaan)
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-8 flex gap-6 border-t border-black/5 pt-6">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-2xl font-semibold text-text">{stat.value}</p>
                    <p className="text-xs text-text-secondary">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative mx-auto w-full max-w-md"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/hero-illustration.png"
                  alt="Ilustrasi direktori jasa Nemshi"
                  width={900}
                  height={680}
                  priority
                  className="w-full"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Quick actions */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } } }}
          className="mt-6 grid gap-4 sm:grid-cols-3"
        >
          {QUICK_ACTIONS.map((card) => (
            <motion.div key={card.href} variants={fadeUp}>
              <Link href={card.href}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className={`p-5 transition-shadow hover:shadow-lg ${card.className}`}
                >
                  <span className="text-2xl">{card.icon}</span>
                  <p className="mt-3 font-semibold">{card.title}</p>
                  <p className="mt-1 text-sm opacity-85">{card.desc}</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.section>

        {/* Featured listings */}
        <FeaturedListingsCarousel listings={featuredListings} savedListingIds={savedListingIds} />

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <motion.section
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            className="mt-6 bg-white p-6 border border-black/10 sm:p-8"
          >
            <h2 className="font-display text-2xl font-semibold text-text">Kata Mereka</h2>
            <p className="mt-1 text-sm text-text-secondary">
              Pengalaman nyata dari sesama Masisir yang sudah pakai Nemshi.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <motion.div
                  key={t.id}
                  variants={fadeUp}
                  className="flex flex-col gap-3 bg-surface p-5"
                >
                  <div className="flex gap-0.5 text-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < t.rating ? "" : "opacity-25"}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-text">&ldquo;{t.comment}&rdquo;</p>
                  <p className="mt-auto text-xs text-text-secondary">
                    <span className="font-semibold text-text">{t.reviewerName}</span> untuk{" "}
                    {t.revieweeName}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Final CTA */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 overflow-hidden bg-text px-8 py-10 text-center text-white sm:px-12"
        >
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Siap cari jasa terpercaya di Mesir?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-white/70">
            Jelajahi ratusan iklan jasa dari sesama Masisir, hubungi langsung via WhatsApp.
          </p>
          <Link href="/jelajahi" className="mt-6 inline-block">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-semibold text-text shadow-sm"
            >
              Mulai Jelajahi
            </motion.span>
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
