"use client";

import Image from "next/image";
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
    <div className="bg-surface-tint">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero panel */}
        <section className="overflow-hidden rounded-3xl bg-white shadow-sm shadow-black/5">
          <div className="grid gap-6 p-8 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-10 lg:p-14">
            <div>
              <span className="inline-block rounded-full bg-surface-tint px-3 py-1 text-xs font-semibold tracking-wide text-primary">
                Direktori Jasa Masisir
              </span>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-text sm:text-5xl">
                Kami hubungkan
                <br />
                kamu dengan{" "}
                <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                  jasa terpercaya
                </span>
              </h1>
              <p className="mt-4 max-w-md text-text-secondary">
                Direktori iklan jasa untuk Mahasiswa Indonesia di Mesir — temukan penyedia jasa dan
                hubungi langsung via WhatsApp, tanpa perantara.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/kategori"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                    →
                  </span>
                  Jelajahi Semua Kategori
                </Link>
                <Link
                  href="/sayembara"
                  className="text-sm font-semibold text-text underline decoration-black/20 underline-offset-4 hover:text-primary"
                >
                  Cari Jasa (Papan Permintaan)
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <Image
                src="/hero-illustration.png"
                alt="Ilustrasi direktori jasa Nemshi"
                width={900}
                height={680}
                priority
                className="w-full rounded-2xl"
              />
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
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
            className="group rounded-2xl border border-black/5 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="text-2xl">📍</span>
            <p className="mt-3 font-semibold text-text">Jelajahi per Kategori</p>
            <p className="mt-1 text-sm text-text-secondary">
              Cari berdasarkan kategori dan area di Mesir.
            </p>
          </Link>
        </section>

        {/* Featured listings panel */}
        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm shadow-black/5 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-text">Iklan Pilihan</h2>
            <div className="flex flex-1 flex-col gap-2 sm:max-w-md sm:flex-row">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari jasa berdasarkan kata kunci..."
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
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 border-b border-black/5 pb-5">
            <button
              onClick={() => setCategorySlug("")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                categorySlug === ""
                  ? "border border-primary/30 bg-surface-tint text-primary"
                  : "border border-transparent text-text-secondary hover:bg-surface"
              }`}
            >
              Semua
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setCategorySlug(category.slug)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  categorySlug === category.slug
                    ? "border border-primary/30 bg-surface-tint text-primary"
                    : "border border-transparent text-text-secondary hover:bg-surface"
                }`}
              >
                {category.icon} {category.name}
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
            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse overflow-hidden rounded-2xl border border-black/5"
                  >
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
          </div>
        </section>
      </div>
    </div>
  );
}
