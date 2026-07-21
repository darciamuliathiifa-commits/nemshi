"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ListingCard } from "@/components/listing-card";
import type { ListingSummary } from "@/lib/listings";

type Category = { id: string; name: string; slug: string; icon: string };
type Area = { id: string; name: string; slug: string };

export function SayembaraBoard() {
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
      fetch("/api/sayembara").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/areas").then((r) => r.json()),
    ]).then(([listingsData, categoriesData, areasData]) => {
      setListings(listingsData);
      setCategories(categoriesData);
      setAreas(areasData);
      setLoading(false);
    });
  }, []);

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

  const hasActiveFilters = keyword || categorySlug || areaSlug;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-text">Cari Jasa</h1>
          <Link
            href="/sayembara/buat"
            className="shrink-0 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Buat Sayembara
          </Link>
        </div>
        <p className="text-text-secondary">
          Papan permintaan jasa dari sesama Masisir — penyedia yang relevan akan menghubungimu
          langsung lewat WhatsApp.
        </p>
        <div className="flex gap-4 text-sm font-medium text-primary">
          <Link href="/" className="hover:underline">
            ← Jelajahi Iklan Jasa
          </Link>
          <Link href="/sayembara/saya" className="hover:underline">
            Sayembara Saya
          </Link>
        </div>
      </header>

      <section className="mb-8 flex flex-col gap-3 rounded-xl border border-black/5 bg-white p-4 sm:flex-row sm:items-center">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Cari kebutuhan jasa..."
          className="flex-1 rounded-xl border border-black/10 px-4 py-2 text-sm outline-none focus:border-primary"
        />
        <select
          value={categorySlug}
          onChange={(e) => setCategorySlug(e.target.value)}
          className="rounded-xl border border-black/10 px-4 py-2 text-sm outline-none focus:border-primary"
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
          className="rounded-xl border border-black/10 px-4 py-2 text-sm outline-none focus:border-primary"
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
            className="rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-text-secondary hover:bg-black/5"
          >
            Reset Filter
          </button>
        )}
      </section>

      {loading ? (
        <p className="text-text-secondary">Memuat sayembara...</p>
      ) : filtered.length === 0 ? (
        <p className="text-text-secondary">Belum ada sayembara yang sesuai.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}
