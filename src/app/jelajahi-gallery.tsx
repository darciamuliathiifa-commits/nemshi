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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-dark">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="absolute -right-10 top-32 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute right-24 -bottom-16 h-56 w-56 rounded-full bg-white/10" />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20 lg:px-8">
          <div>
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-white">
              Direktori Jasa Masisir
            </span>
            <h1 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Temukan jasa terpercaya dari sesama Masisir
            </h1>
            <p className="mt-3 max-w-md text-white/85">
              Direktori iklan jasa untuk Mahasiswa Indonesia di Mesir — temukan penyedia jasa dan
              hubungi langsung via WhatsApp, tanpa perantara.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/kategori"
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-sm transition-transform hover:scale-[1.02]"
              >
                Lihat Semua Kategori
              </Link>
              <Link
                href="/sayembara"
                className="rounded-xl border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Cari Jasa (Papan Permintaan)
              </Link>
            </div>
          </div>

          <div className="relative hidden h-64 lg:block">
            <div className="absolute left-6 top-2 flex h-32 w-32 rotate-[-8deg] items-center justify-center rounded-3xl bg-white/15 text-6xl shadow-lg backdrop-blur-sm">
              📦
            </div>
            <div className="absolute right-4 top-16 flex h-28 w-28 rotate-[6deg] items-center justify-center rounded-3xl bg-white/15 text-5xl shadow-lg backdrop-blur-sm">
              🚚
            </div>
            <div className="absolute bottom-2 left-24 flex h-28 w-28 rotate-[4deg] items-center justify-center rounded-3xl bg-white/15 text-5xl shadow-lg backdrop-blur-sm">
              📚
            </div>
            <div className="absolute bottom-6 right-0 rounded-2xl bg-white px-4 py-3 text-center shadow-xl">
              <p className="text-xs font-medium text-text-secondary">Hubungi langsung</p>
              <p className="text-lg font-extrabold text-primary">via WhatsApp</p>
            </div>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="relative border-t border-white/15 bg-white/10 backdrop-blur-sm">
            <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setCategorySlug("")}
                className={`flex shrink-0 flex-col items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium transition-colors ${
                  categorySlug === "" ? "bg-white text-primary" : "text-white hover:bg-white/10"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
                  ✨
                </span>
                Semua
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setCategorySlug(category.slug)}
                  className={`flex shrink-0 flex-col items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium transition-colors ${
                    categorySlug === category.slug
                      ? "bg-white text-primary"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
                    {category.icon}
                  </span>
                  <span className="w-20 text-center leading-tight">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/pasang-iklan"
            className="group rounded-2xl bg-primary p-5 text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="text-2xl">📢</span>
            <p className="mt-3 font-semibold">Pasang Iklan Gratis</p>
            <p className="mt-1 text-sm text-white/80">
              Tawarkan jasamu dan tampil di direktori Nemshi.
            </p>
          </Link>
          <Link
            href="/sayembara"
            className="group rounded-2xl bg-text p-5 text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="text-2xl">🔍</span>
            <p className="mt-3 font-semibold">Papan Permintaan</p>
            <p className="mt-1 text-sm text-white/80">
              Belum nemu penyedianya? Pasang permintaanmu di sini.
            </p>
          </Link>
          <Link
            href="/kategori"
            className="group rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="text-2xl">📍</span>
            <p className="mt-3 font-semibold text-text">Jelajahi per Kategori</p>
            <p className="mt-1 text-sm text-text-secondary">
              Cari berdasarkan kategori dan area di Mesir.
            </p>
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-md shadow-black/5 sm:flex-row sm:items-center">
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
