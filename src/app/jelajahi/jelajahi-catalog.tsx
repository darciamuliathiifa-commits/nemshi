"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ListingCard } from "@/components/listing-card";
import type { ListingSummary } from "@/lib/listings";

type Category = { id: string; name: string; slug: string; icon: string };
type Area = { id: string; name: string; slug: string };

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

type SortBy = "terbaru" | "termurah" | "termahal";

function sortListings(listings: ListingSummary[], sortBy: SortBy): ListingSummary[] {
  if (sortBy === "terbaru") return listings;

  const withPrice = listings.filter((l) => l.priceType === "Range" && l.priceMin != null);
  const withoutPrice = listings.filter((l) => !(l.priceType === "Range" && l.priceMin != null));
  withPrice.sort((a, b) =>
    sortBy === "termurah" ? a.priceMin! - b.priceMin! : b.priceMin! - a.priceMin!
  );
  return [...withPrice, ...withoutPrice];
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 bg-surface px-3 py-1 text-sm font-medium text-text transition-colors hover:bg-primary/10 hover:text-primary"
    >
      {label}
      <span className="text-text-secondary">×</span>
    </button>
  );
}

export function JelajahiCatalog({
  initialListings,
  initialCategories,
  initialAreas,
  savedListingIds,
}: {
  initialListings: ListingSummary[];
  initialCategories: Category[];
  initialAreas: Area[];
  savedListingIds: string[];
}) {
  const searchParams = useSearchParams();

  const listings = initialListings;
  const categories = initialCategories;
  const areas = initialAreas;
  const savedSet = useMemo(() => new Set(savedListingIds), [savedListingIds]);

  const [keyword, setKeyword] = useState("");
  const [categorySlug, setCategorySlug] = useState(searchParams.get("category") ?? "");
  const [areaSlug, setAreaSlug] = useState(searchParams.get("area") ?? "");
  const [sortBy, setSortBy] = useState<SortBy>("terbaru");

  const filteredListings = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return listings.filter((listing) => {
      const matchesKeyword =
        !normalizedKeyword || listing.title.toLowerCase().includes(normalizedKeyword);
      const matchesCategory = !categorySlug || listing.category.slug === categorySlug;
      const matchesArea = !areaSlug || listing.area.slug === areaSlug;
      return matchesKeyword && matchesCategory && matchesArea;
    });
  }, [listings, keyword, categorySlug, areaSlug]);

  const sortedListings = useMemo(
    () => sortListings(filteredListings, sortBy),
    [filteredListings, sortBy]
  );

  const hasActiveFilters = keyword || categorySlug || areaSlug;
  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const activeArea = areas.find((a) => a.slug === areaSlug);

  return (
    <div className="bg-surface-tint">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Promo banner */}
        <section className="overflow-hidden bg-primary text-white">
          <div className="grid gap-6 p-8 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-8 lg:p-12">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            >
              <motion.span
                variants={fadeUp}
                className="inline-block rounded bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide"
              >
                Direktori Jasa Masisir
              </motion.span>
              <motion.h1
                variants={fadeUp}
                className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl"
              >
                Dapatkan <span className="italic text-accent">jasa terpercaya</span> di
                sekitarmu
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-3 max-w-md text-white/80">
                Hubungi penyedia jasa langsung via WhatsApp — tanpa perantara, tanpa ribet.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/pasang-iklan"
                  className="bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-transform hover:scale-[1.02]"
                >
                  Pasang Iklan Gratis
                </Link>
                <Link
                  href="/sayembara"
                  className="border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Papan Permintaan
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative mx-auto hidden w-full max-w-xs sm:block"
            >
              <Image
                src="/hero-illustration.png"
                alt="Ilustrasi direktori jasa Nemshi"
                width={600}
                height={450}
                priority
                className="w-full"
              />
            </motion.div>
          </div>
        </section>

        {/* Catalog panel */}
        <section className="mt-6 bg-white p-6 border border-black/10 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-2xl font-semibold text-text">Semua Iklan</h2>
            <div className="flex flex-1 flex-col gap-2 sm:max-w-lg sm:flex-row">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari jasa berdasarkan kata kunci..."
                className="flex-1 border border-black/10 px-4 py-2 text-sm outline-none transition-colors focus:border-accent"
              />
              <select
                value={areaSlug}
                onChange={(e) => setAreaSlug(e.target.value)}
                className="border border-black/10 px-4 py-2 text-sm outline-none transition-colors focus:border-accent"
              >
                <option value="">Semua Area</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.slug}>
                    {area.name}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="border border-black/10 px-4 py-2 text-sm outline-none transition-colors focus:border-accent"
              >
                <option value="terbaru">Terbaru</option>
                <option value="termurah">Termurah</option>
                <option value="termahal">Termahal</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {keyword && <FilterChip label={`"${keyword}"`} onRemove={() => setKeyword("")} />}
              {activeCategory && (
                <FilterChip
                  label={`${activeCategory.icon} ${activeCategory.name}`}
                  onRemove={() => setCategorySlug("")}
                />
              )}
              {activeArea && (
                <FilterChip label={activeArea.name} onRemove={() => setAreaSlug("")} />
              )}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2 border-b border-black/5 pb-5">
            <button
              onClick={() => setCategorySlug("")}
              className={`relative px-4 py-1.5 text-sm font-medium transition-colors ${
                categorySlug === "" ? "text-white" : "text-text-secondary hover:bg-surface"
              }`}
            >
              {categorySlug === "" && (
                <motion.span
                  layoutId="jelajahi-category-pill"
                  className="absolute inset-0 bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">Semua Kategori</span>
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setCategorySlug(category.slug)}
                className={`relative px-4 py-1.5 text-sm font-medium transition-colors ${
                  categorySlug === category.slug
                    ? "text-white"
                    : "text-text-secondary hover:bg-surface"
                }`}
              >
                {categorySlug === category.slug && (
                  <motion.span
                    layoutId="jelajahi-category-pill"
                    className="absolute inset-0 bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">
                  {category.icon} {category.name}
                </span>
              </button>
            ))}
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setKeyword("");
                  setCategorySlug("");
                  setAreaSlug("");
                }}
                className="ml-auto text-sm font-medium text-text-secondary hover:text-primary"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="pt-6">
            {sortedListings.length === 0 ? (
              <div className="border border-dashed border-black/10 bg-surface/50 py-16 text-center text-text-secondary">
                Tidak ada iklan yang sesuai dengan pencarian Anda.
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.04 } } }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
              >
                {sortedListings.map((listing) => (
                  <motion.div key={listing.id} variants={fadeUp}>
                    <ListingCard listing={listing} isSaved={savedSet.has(listing.id)} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
