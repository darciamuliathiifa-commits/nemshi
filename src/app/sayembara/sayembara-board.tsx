"use client";

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
      className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-sm font-medium text-text transition-colors hover:bg-primary/10 hover:text-primary"
    >
      {label}
      <span className="text-text-secondary">×</span>
    </button>
  );
}

export function SayembaraBoard({
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

  const filtered = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return listings.filter((listing) => {
      const matchesKeyword =
        !normalizedKeyword || listing.title.toLowerCase().includes(normalizedKeyword);
      const matchesCategory = !categorySlug || listing.category.slug === categorySlug;
      const matchesArea = !areaSlug || listing.area.slug === areaSlug;
      return matchesKeyword && matchesCategory && matchesArea;
    });
  }, [listings, keyword, categorySlug, areaSlug]);

  const sortedListings = useMemo(() => sortListings(filtered, sortBy), [filtered, sortBy]);

  const hasActiveFilters = keyword || categorySlug || areaSlug;
  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const activeArea = areas.find((a) => a.slug === areaSlug);

  return (
    <div className="bg-surface-tint">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-white p-6 shadow-sm shadow-black/5 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-semibold text-text">Cari Jasa</h1>
              <p className="mt-2 max-w-xl text-text-secondary">
                Papan permintaan jasa dari sesama Masisir — penyedia yang relevan akan
                menghubungimu langsung lewat WhatsApp.
              </p>
              <div className="mt-3 flex gap-4 text-sm font-medium">
                <Link href="/" className="text-text-secondary hover:text-primary">
                  ← Jelajahi Iklan Jasa
                </Link>
                <Link href="/sayembara/saya" className="text-text-secondary hover:text-primary">
                  Sayembara Saya
                </Link>
              </div>
            </div>
            <Link
              href="/sayembara/buat"
              className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
            >
              Buat Sayembara
            </Link>
          </div>

          <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-surface p-4 sm:flex-row sm:items-center">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Cari kebutuhan jasa..."
              className="flex-1 rounded-full border border-black/10 px-4 py-2 text-sm outline-none transition-colors focus:border-primary"
            />
            <select
              value={areaSlug}
              onChange={(e) => setAreaSlug(e.target.value)}
              className="rounded-full border border-black/10 px-4 py-2 text-sm outline-none transition-colors focus:border-primary"
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
              className="rounded-full border border-black/10 px-4 py-2 text-sm outline-none transition-colors focus:border-primary"
            >
              <option value="terbaru">Terbaru</option>
              <option value="termurah">Termurah</option>
              <option value="termahal">Termahal</option>
            </select>
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

          <div className="mt-4 flex flex-wrap items-center gap-2 border-b border-black/5 pb-5">
            <button
              onClick={() => setCategorySlug("")}
              className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                categorySlug === "" ? "text-white" : "text-text-secondary hover:bg-surface"
              }`}
            >
              {categorySlug === "" && (
                <motion.span
                  layoutId="sayembara-category-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">Semua</span>
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setCategorySlug(category.slug)}
                className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  categorySlug === category.slug
                    ? "text-white"
                    : "text-text-secondary hover:bg-surface"
                }`}
              >
                {categorySlug === category.slug && (
                  <motion.span
                    layoutId="sayembara-category-pill"
                    className="absolute inset-0 rounded-full bg-primary"
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
              <div className="rounded-2xl border border-dashed border-black/10 bg-surface/50 py-16 text-center text-text-secondary">
                Belum ada sayembara yang sesuai.
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
