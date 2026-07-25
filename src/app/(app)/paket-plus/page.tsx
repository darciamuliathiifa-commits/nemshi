"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { ZapIcon } from "@/components/icons";
import type { UserQuota } from "@/lib/server/quota-store";

const plusPlan = {
  id: "plus" as const,
  name: "Paket Plus",
  price: "Rp 150.000",
  period: "/ paket",
  benefits: [
    "3x jatah pasang iklan, masing-masing aktif 2 minggu",
    "2x jatah pasang sayembara, masing-masing aktif 2 minggu",
    "Prioritas tayang di halaman Eksplor",
    "Jatah berlaku 3 bulan sejak pembelian",
  ],
};

type CheckoutStep = "plans" | "checkout" | "redirecting" | "confirming" | "success" | "pending";

const POLL_ATTEMPTS = 6;
const POLL_INTERVAL_MS = 2000;

export default function PaketPlusPage() {
  const [step, setStep] = useState<CheckoutStep>("plans");
  const [quota, setQuota] = useState<UserQuota | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") !== "return") return;

    let cancelled = false;

    async function pollQuota() {
      setStep("confirming");

      for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
        try {
          const res = await fetch("/api/mayar/quota");
          if (res.ok) {
            const data: UserQuota = await res.json();
            if (data.plan === "plus") {
              if (!cancelled) {
                setQuota(data);
                setStep("success");
              }
              return;
            }
          }
        } catch {
          // keep polling — a transient failure isn't final
        }
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }
      if (!cancelled) setStep("pending");
    }

    pollQuota();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handlePay() {
    setStep("redirecting");
    setError(null);

    try {
      const response = await fetch("/api/mayar/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plusPlan.id }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error ?? "Gagal membuat invoice pembayaran.");
      }

      window.location.href = result.link;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menghubungkan ke Mayar. Coba lagi.",
      );
      setStep("checkout");
    }
  }

  return (
    <>
      <Header title="Paket Plus" />

      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-3xl">
          {step === "plans" && (
            <>
              <div className="mb-6 flex items-center gap-3 rounded-card border-[2.5px] border-ink bg-brand px-5 py-4 shadow-[3px_3px_0_0_rgba(20,20,20,1)]">
                <ZapIcon width={22} height={22} className="shrink-0 text-charcoal" />
                <p className="text-[14px] font-bold text-charcoal">
                  Event minggu ini: bebas pasang iklan 3x gratis, tanpa
                  bayar! Berlaku selama 1 minggu.
                </p>
              </div>

              <h2 className="text-xl font-bold text-charcoal">
                Cara Kerja Pasang Iklan &amp; Sayembara
              </h2>
              <p className="mt-1 text-[14px] font-normal text-muted-foreground">
                Pakai jatah gratis, bayar sekali pasang, atau upgrade ke Paket
                Plus biar lebih hemat.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[3px_3px_0_0_rgba(20,20,20,1)]">
                  <h3 className="text-base font-bold text-charcoal">Iklan</h3>
                  <div className="mt-4 flex flex-col gap-3">
                    <div className="rounded-input bg-surface/60 px-4 py-3">
                      <p className="text-[12px] font-bold text-muted-foreground">
                        Gratis
                      </p>
                      <p className="mt-0.5 text-[14px] font-normal text-charcoal">
                        1x posting / bulan, aktif 3 hari
                      </p>
                    </div>
                    <div className="rounded-input bg-surface/60 px-4 py-3">
                      <p className="text-[12px] font-bold text-muted-foreground">
                        Bayar per Posting
                      </p>
                      <p className="mt-0.5 text-[14px] font-normal text-charcoal">
                        Rp 50.000 sekali posting, aktif 2 minggu
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[3px_3px_0_0_rgba(20,20,20,1)]">
                  <h3 className="text-base font-bold text-charcoal">Sayembara</h3>
                  <div className="mt-4 flex flex-col gap-3">
                    <div className="rounded-input bg-surface/60 px-4 py-3">
                      <p className="text-[12px] font-bold text-muted-foreground">
                        Gratis
                      </p>
                      <p className="mt-0.5 text-[14px] font-normal text-charcoal">
                        1x posting, aktif 1 hari
                      </p>
                    </div>
                    <div className="rounded-input bg-surface/60 px-4 py-3">
                      <p className="text-[12px] font-bold text-muted-foreground">
                        Bayar per Posting
                      </p>
                      <p className="mt-0.5 text-[14px] font-normal text-charcoal">
                        Rp 12.000 sekali posting, aktif 1 minggu
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="mt-8 text-xl font-bold text-charcoal">
                Upgrade ke Paket Plus
              </h2>
              <p className="mt-1 text-[14px] font-normal text-muted-foreground">
                Sekali bayar, dapat jatah iklan dan sayembara lebih banyak.
              </p>

              <div className="mx-auto mt-4 flex max-w-sm flex-col rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[4px_4px_0_0_rgba(255,199,44,1)]">
                <h3 className="text-base font-bold text-charcoal">
                  {plusPlan.name}
                </h3>
                <p className="mt-2">
                  <span className="text-2xl font-bold text-charcoal">
                    {plusPlan.price}
                  </span>
                  <span className="text-[14px] font-normal text-muted-foreground">
                    {" "}
                    {plusPlan.period}
                  </span>
                </p>

                <ul className="mt-4 flex flex-1 flex-col gap-2">
                  {plusPlan.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2 text-[14px] font-normal text-charcoal"
                    >
                      <span className="mt-0.5 text-success">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => setStep("checkout")}
                  className="mt-6 h-11 rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black"
                >
                  Pilih Paket
                </button>
              </div>
            </>
          )}

          {step === "checkout" && (
            <>
              <button
                type="button"
                onClick={() => setStep("plans")}
                className="mb-6 text-[14px] font-bold text-cta hover:text-highlight"
              >
                ← Kembali
              </button>

              <h2 className="text-xl font-bold text-charcoal">
                Ringkasan Pembayaran
              </h2>
              <p className="mt-1 text-[14px] font-normal text-muted-foreground">
                Pembayaran diproses melalui gateway Mayar.
              </p>

              <div className="mt-6 rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[3px_3px_0_0_rgba(20,20,20,1)]">
                <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                  <span className="text-base font-bold text-charcoal">
                    {plusPlan.name}
                  </span>
                  <span className="text-base font-bold text-charcoal">
                    {plusPlan.price}
                    <span className="text-[14px] font-normal text-muted-foreground">
                      {plusPlan.period}
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-base font-bold text-charcoal">
                    Total Tagihan
                  </span>
                  <span className="text-xl font-bold text-cta">
                    {plusPlan.price}
                  </span>
                </div>
              </div>

              {error && (
                <p className="mt-3 text-[14px] font-normal text-error">{error}</p>
              )}

              <button
                type="button"
                onClick={handlePay}
                className="mt-6 flex h-11 w-full items-center justify-center rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black"
              >
                Bayar dengan Mayar
              </button>
            </>
          )}

          {step === "redirecting" && (
            <div className="flex flex-col items-center rounded-card border-[2.5px] border-ink bg-white p-10 text-center shadow-[3px_3px_0_0_rgba(20,20,20,1)]">
              <span className="h-10 w-10 animate-spin rounded-full border-4 border-surface border-t-cta" />
              <p className="mt-4 text-base font-normal text-charcoal">
                Menghubungkan ke Mayar...
              </p>
            </div>
          )}

          {step === "confirming" && (
            <div className="flex flex-col items-center rounded-card border-[2.5px] border-ink bg-white p-10 text-center shadow-[3px_3px_0_0_rgba(20,20,20,1)]">
              <span className="h-10 w-10 animate-spin rounded-full border-4 border-surface border-t-cta" />
              <p className="mt-4 text-base font-normal text-charcoal">
                Mengonfirmasi pembayaran...
              </p>
              <p className="mt-1 max-w-sm text-[14px] font-normal text-muted-foreground">
                Kami sedang menunggu konfirmasi dari Mayar. Ini biasanya cuma
                beberapa detik.
              </p>
            </div>
          )}

          {step === "pending" && (
            <div className="flex flex-col items-center rounded-card border-[2.5px] border-ink bg-white p-10 text-center shadow-[3px_3px_0_0_rgba(20,20,20,1)]">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-highlight/10 text-2xl text-highlight">
                ⏳
              </span>
              <h2 className="mt-4 text-xl font-bold text-charcoal">
                Menunggu Konfirmasi Pembayaran
              </h2>
              <p className="mt-2 max-w-sm text-[14px] font-normal text-muted-foreground">
                Belum ada konfirmasi dari Mayar. Kalau kamu sudah bayar, jatah
                Paket Plus akan otomatis aktif begitu pembayaran terkonfirmasi
                — cek lagi profilmu sebentar lagi.
              </p>
              <div className="mt-6 flex w-full max-w-xs gap-3">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="flex h-11 flex-1 items-center justify-center rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black"
                >
                  Cek Lagi
                </button>
                <Link
                  href="/profil"
                  className="flex h-11 flex-1 items-center justify-center rounded-pill border-2 border-ink text-base font-bold text-charcoal transition-colors hover:bg-surface"
                >
                  Lihat Profil
                </Link>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center rounded-card border-[2.5px] border-ink bg-white p-10 text-center shadow-[3px_3px_0_0_rgba(20,20,20,1)]">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-2xl text-success">
                ✓
              </span>
              <h2 className="mt-4 text-xl font-bold text-charcoal">
                Pembayaran Berhasil
              </h2>
              <p className="mt-2 max-w-sm text-[14px] font-normal text-muted-foreground">
                {plusPlan.name} kamu sudah aktif. Jatah iklan dan sayembara
                otomatis ditambahkan ke akunmu.
              </p>

              {quota && (
                <div className="mt-4 w-full max-w-xs rounded-card border-[2.5px] border-ink bg-surface/50 px-4 py-3 text-left">
                  <p className="text-[12px] font-bold text-muted-foreground">
                    Kuota Terbaru
                  </p>
                  <p className="mt-1 text-[14px] font-normal text-charcoal">
                    Jatah iklan tambahan: {quota.extraAdSlots}
                  </p>
                  <p className="mt-1 text-[14px] font-normal text-charcoal">
                    Jatah sayembara tambahan: {quota.extraSayembaraSlots}
                  </p>
                  {quota.planExpiresAt && (
                    <p className="mt-1 text-[14px] font-normal text-charcoal">
                      Jatah berlaku hingga:{" "}
                      {new Date(quota.planExpiresAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-6 flex w-full max-w-xs gap-3">
                <Link
                  href="/pasang-iklan"
                  className="flex h-11 flex-1 items-center justify-center rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black"
                >
                  Pasang Iklan
                </Link>
                <Link
                  href="/profil"
                  className="flex h-11 flex-1 items-center justify-center rounded-pill border-2 border-ink text-base font-bold text-charcoal transition-colors hover:bg-surface"
                >
                  Lihat Profil
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
