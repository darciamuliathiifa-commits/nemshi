"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ListingCard } from "@/components/listing-card";
import type { ListingSummary } from "@/lib/listings";

type Category = { id: string; name: string; slug: string; icon: string };
type Area = { id: string; name: string; slug: string };
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

export function JelajahiGallery() {
  const searchParams = useSearchParams();

  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [categorySlug, setCategorySlug] = useState(searchParams.get("category") ?? "");
  const [areaSlug, setAreaSlug] = useState(searchParams.get("area") ?? "");

  useEffect(() => {
    Promise.all([
      fetch("/api/listings").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/areas").then((r) => r.json()),
      fetch("/api/testimonials/featured").then((r) => (r.ok ? r.json() : [])),
    ]).then(([listingsData, categoriesData, areasData, testimonialsData]) => {
      setListings(listingsData);
      setCategories(categoriesData);
      setAreas(areasData);
      setTestimonials(testimonialsData);
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

  const stats = [
    { label: "Iklan aktif", value: listings.length },
    { label: "Kategori jasa", value: categories.length },
    { label: "Area di Mesir", value: areas.length },
  ];

  return (
    <div className="bg-surface-tint">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero panel */}
        <section className="overflow-hidden rounded-3xl bg-white shadow-sm shadow-black/5">
          <div className="grid gap-6 p-8 sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-10 lg:p-14">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            >
              <motion.span
                variants={fadeUp}
                className="inline-block rounded-full bg-surface-tint px-3 py-1 text-xs font-semibold tracking-wide text-primary"
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
                <Link href="/kategori" className="group">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                    Jelajahi Semua Kategori
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
                  className="w-full rounded-2xl"
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
          {[
            {
              href: "/pasang-iklan",
              icon: "📢",
              title: "Pasang Iklan Gratis",
              desc: "Tawarkan jasamu dan tampil di direktori Nemshi.",
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
              href: "/kategori",
              icon: "📍",
              title: "Jelajahi per Kategori",
              desc: "Cari berdasarkan kategori dan area di Mesir.",
              className: "border border-black/5 bg-white text-text",
            },
          ].map((card) => (
            <motion.div key={card.href} variants={fadeUp}>
              <Link href={card.href}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className={`rounded-2xl p-5 shadow-sm transition-shadow hover:shadow-lg ${card.className}`}
                >
                  <span className="text-2xl">{card.icon}</span>
                  <p className="mt-3 font-semibold">{card.title}</p>
                  <p className="mt-1 text-sm opacity-85">{card.desc}</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.section>

        {/* Featured listings panel */}
        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm shadow-black/5 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-2xl font-semibold text-text">Iklan Pilihan</h2>
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
              className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                categorySlug === "" ? "text-white" : "text-text-secondary hover:bg-surface"
              }`}
            >
              {categorySlug === "" && (
                <motion.span
                  layoutId="category-pill"
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
                    layoutId="category-pill"
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
              <motion.div
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.04 } } }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
              >
                {filteredListings.map((listing) => (
                  <motion.div key={listing.id} variants={fadeUp}>
                    <ListingCard listing={listing} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <motion.section
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            className="mt-6 rounded-3xl bg-white p-6 shadow-sm shadow-black/5 sm:p-8"
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
                  className="flex flex-col gap-3 rounded-2xl bg-surface p-5"
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
      </div>
    </div>
  );
}
