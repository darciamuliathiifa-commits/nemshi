"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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
  listingCount,
  categoryCount,
  areaCount,
  testimonials,
}: {
  listingCount: number;
  categoryCount: number;
  areaCount: number;
  testimonials: Testimonial[];
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
                <Link href="/jelajahi" className="group">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm"
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
          {QUICK_ACTIONS.map((card) => (
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

        {/* Final CTA */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 overflow-hidden rounded-3xl bg-text px-8 py-10 text-center text-white sm:px-12"
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
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-text shadow-sm"
            >
              Mulai Jelajahi
            </motion.span>
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
