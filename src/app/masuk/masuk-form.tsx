"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PRODUCT_PRICES } from "@/lib/pricing";
import { formatRupiah } from "@/lib/format";

const FREE_BENEFITS = [
  "Jelajahi & cari ratusan iklan jasa sesama Masisir",
  "Hubungi penyedia jasa langsung via WhatsApp — tanpa perantara",
  "Pasang 1 permintaan Cari Jasa tiap 30 hari, gratis",
];

const PAID_BENEFITS = [
  {
    title: "Tawarkan Jasa",
    price: `${formatRupiah(PRODUCT_PRICES.Iklan_Tawarkan_Jasa)} / iklan`,
    desc: "Iklan jasamu tayang 30 hari di direktori.",
  },
  {
    title: "Cari Jasa Prioritas",
    price: formatRupiah(PRODUCT_PRICES.Cari_Jasa_Prioritas),
    desc: "Permintaanmu tampil paling atas selama 3 hari.",
  },
  {
    title: "Paket Plus",
    price: formatRupiah(PRODUCT_PRICES.Paket_Plus),
    desc: "3 Tawarkan Jasa + 2 Cari Jasa Prioritas — paling hemat.",
  },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="mt-0.5 h-4 w-4 shrink-0 text-white">
      <path
        d="M4 10.5L8 14.5L16 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MasukForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/jelajahi";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setSubmitting(false);

    if (signInError) {
      setError("Email atau kata sandi salah.");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <main className="grid min-h-[calc(100vh-64px)] lg:grid-cols-2">
      {/* Form */}
      <div className="order-1 flex items-center justify-center px-6 py-12 lg:order-2">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
              N
            </span>
            <h1 className="mt-3 text-xl font-bold text-text">Masuk ke Nemshi</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Masuk untuk menawarkan jasa atau mencari jasa yang kamu butuhkan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm text-text-secondary">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-black/10 px-3 py-2 text-text outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-text-secondary">
              Kata Sandi
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-black/10 px-3 py-2 text-text outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-full mt-2 bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
            >
              {submitting ? "Masuk..." : "Masuk"}
            </button>
          </form>

          <div className="mt-5 flex flex-col gap-2 text-center text-sm text-text-secondary">
            <Link href="/lupa-password" className="font-medium text-accent hover:underline">
              Lupa kata sandi?
            </Link>
            <p>
              Belum punya akun?{" "}
              <Link href="/daftar" className="font-medium text-accent hover:underline">
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Benefit panel */}
      <aside className="order-2 flex flex-col justify-center gap-8 bg-text px-6 py-12 text-white sm:px-10 lg:order-1 lg:px-14">
        <div>
          <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl">
            Tawarkan jasa. Cari jasa. <span className="text-accent-dark">Semua di Nemshi.</span>
          </h2>
          <p className="mt-3 max-w-md text-sm text-white/60">
            Setelah masuk, kamu bisa memasang iklan jasamu atau membuat permintaan jasa —
            lalu terhubung langsung via WhatsApp tanpa perantara.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
            Gratis, selamanya
          </p>
          <ul className="mt-3 flex flex-col gap-2.5">
            {FREE_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2.5 text-sm text-white/90">
                <CheckIcon />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
            Upgrade berbayar
          </p>
          <div className="mt-3 flex flex-col gap-3">
            {PAID_BENEFITS.map((item) => (
              <div
                key={item.title}
                className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-white/60">{item.desc}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-accent-dark">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
}
