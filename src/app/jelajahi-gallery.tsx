"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ListingCard } from "@/components/listing-card";
import type { ListingSummary } from "@/lib/listings";

type Category = { id: string; name: string; slug: string; icon: string };
type Area = { id: string; name: string; slug: string };

export function JelajahiGallery() {
  const searchParams = useSearchParams();

  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [categorySlug, setCategorySlug] = useState(searchParams.get("category") ?? "");
  const [areaSlug, setAreaSlug] = useState(searchParams.get("area") ?? "");

  useEffect(() => {
    Promise.all([
      fetch("/api/listings").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/areas").then((r) => r.json()),
    ]).then(([listingsData, categoriesData, areasData]) => {
      setListings(listingsData);
      setCategories(categoriesData);
      setAreas(areasData);
      setLoading(false);
    });
  }, []);

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

  const hasActiveFilters = keyword || categorySlug || areaSlug;

  return (
    <>
      <section className="border-b border-black/5 bg-gradient-to-b from-surface-tint to-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-text sm:text-4xl">
            Temukan jasa terpercaya dari sesama Masisir
          </h1>
          <p className="mt-3 max-w-xl text-text-secondary">
            Direktori iklan jasa untuk Mahasiswa Indonesia di Mesir — temukan penyedia jasa dan
            hubungi langsung via WhatsApp, tanpa perantara.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/kategori"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
            >
              Lihat Semua Kategori
            </Link>
            <Link
              href="/sayembara"
              className="rounded-xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:border-primary hover:text-primary"
            >
              Cari Jasa (Papan Permintaan)
            </Link>
          </div>

          <section className="mt-8 flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-md shadow-black/5 sm:flex-row sm:items-center">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Cari jasa berdasarkan kata kunci..."
              className="flex-1 rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
            />
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            <select
              value={areaSlug}
              onChange={(e) => setAreaSlug(e.target.value)}
              className="rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
            >
              <option value="">Semua Area</option>
              {areas.map((area) => (
                <option key={area.id} value={area.slug}>
                  {area.name}
                </option>
              ))}
            </select>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setKeyword("");
                  setCategorySlug("");
                  setAreaSlug("");
                }}
                className="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-black/5"
              >
                Reset Filter
              </button>
            )}
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-black/5">
                <div className="aspect-[4/3] bg-surface" />
                <div className="flex flex-col gap-2 p-4">
                  <div className="h-3 w-1/2 rounded bg-surface" />
                  <div className="h-4 w-full rounded bg-surface" />
                  <div className="h-4 w-2/3 rounded bg-surface" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 bg-surface/50 py-16 text-center text-text-secondary">
            Tidak ada iklan yang sesuai dengan pencarian Anda.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
