"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { CloseIcon, ZapIcon } from "@/components/icons";
import { paymentMethods } from "@/lib/payment-methods";
import type { PlanId, UserQuota } from "@/lib/server/quota-store";

interface PlanInfo {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  benefits: string[];
}

const PLANS: Record<PlanId, PlanInfo> = {
  plus: {
    id: "plus",
    name: "Paket Plus",
    price: "Rp 150.000",
    period: "/ paket",
    benefits: [
      "3x jatah pasang iklan, masing-masing aktif 2 minggu",
      "2x jatah pasang sayembara, masing-masing aktif 2 minggu",
      "Prioritas tayang di halaman Eksplor",
      "Jatah berlaku 3 bulan sejak pembelian",
    ],
  },
  extra_ad: {
    id: "extra_ad",
    name: "Slot Iklan Tambahan",
    price: "Rp 50.000",
    period: "/ posting",
    benefits: ["1x jatah pasang iklan tambahan, aktif 2 minggu"],
  },
  extra_sayembara: {
    id: "extra_sayembara",
    name: "Slot Sayembara Tambahan",
    price: "Rp 12.000",
    period: "/ posting",
    benefits: ["1x jatah pasang sayembara tambahan, aktif 2 minggu"],
  },
  hemat: {
    id: "hemat",
    name: "Paket Hemat",
    price: "Rp 99.000",
    period: "/ paket",
    benefits: [
      "2x jatah pasang iklan, masing-masing aktif 2 minggu",
      "1x jatah pasang sayembara, aktif 2 minggu",
    ],
  },
};

const inputClass =
  "h-11 w-full rounded-input border border-border bg-white px-4 text-[14px] text-charcoal placeholder:text-muted focus:border-cta focus:outline-none focus:ring-3 focus:ring-cta/10";

type CheckoutStep = "plans" | "checkout" | "redirecting" | "confirming" | "success" | "pending";

const POLL_ATTEMPTS = 6;
const POLL_INTERVAL_MS = 2000;

function isPlanFulfilled(
  planId: PlanId,
  quota: UserQuota,
  baseline: UserQuota | null,
): boolean {
  if (planId === "plus") return quota.plan === "plus";
  if (planId === "extra_ad") return quota.extraAdSlots > (baseline?.extraAdSlots ?? -1);
  if (planId === "extra_sayembara") {
    return quota.extraSayembaraSlots > (baseline?.extraSayembaraSlots ?? -1);
  }
  // hemat grants both an ad slot and a sayembara slot at once.
  return (
    quota.extraAdSlots > (baseline?.extraAdSlots ?? -1) &&
    quota.extraSayembaraSlots > (baseline?.extraSayembaraSlots ?? -1)
  );
}

export default function PaketPlusPage() {
  const [step, setStep] = useState<CheckoutStep>("plans");
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>("plus");
  const [quota, setQuota] = useState<UserQuota | null>(null);
  const [baselineQuota, setBaselineQuota] = useState<UserQuota | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mobile, setMobile] = useState("");
  const [manualLink, setManualLink] = useState<string | null>(null);
  const [paymentModalUrl, setPaymentModalUrl] = useState<string | null>(null);

  const selectedPlan = PLANS[selectedPlanId];

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { whatsappNumber?: string | null } | null) => {
        if (data?.whatsappNumber) setMobile(data.whatsappNumber);
      })
      .catch(() => {});
  }, []);

  async function pollQuota(planId: PlanId, baseline: UserQuota | null) {
    setStep("confirming");

    for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
      try {
        const res = await fetch("/api/mayar/quota");
        if (res.ok) {
          const data: UserQuota = await res.json();
          if (isPlanFulfilled(planId, data, baseline)) {
            setQuota(data);
            setStep("success");
            setPaymentModalUrl(null);
            if (window.opener) {
              setTimeout(() => window.close(), 2000);
            }
            return;
          }
        }
      } catch {
        // keep polling — a transient failure isn't final
      }
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }
    setStep("pending");
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") !== "return") return;

    const planId = (params.get("plan") as PlanId) || "plus";

    (async () => {
      await Promise.resolve();
      setSelectedPlanId(planId);
      pollQuota(planId, null);
    })();
  }, []);

  function choosePlan(planId: PlanId) {
    setSelectedPlanId(planId);
    setError(null);
    setManualLink(null);
    setPaymentModalUrl(null);
    setStep("checkout");
  }

  async function handlePay() {
    if (!mobile.trim()) {
      setError("Isi nomor WhatsApp kamu dulu.");
      return;
    }

    setStep("redirecting");
    setError(null);
    setManualLink(null);

    try {
      const quotaRes = await fetch("/api/mayar/quota");
      const baseline: UserQuota | null = quotaRes.ok ? await quotaRes.json() : null;
      setBaselineQuota(baseline);

      const response = await fetch("/api/mayar/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlanId, mobile: mobile.trim() }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error ?? "Gagal membuat tagihan pembayaran.");
      }

      const bridgeUrl = `/paket-plus/checkout-bridge?link=${encodeURIComponent(result.link)}&label=${encodeURIComponent(selectedPlan.name)}`;

      setManualLink(result.link);
      setPaymentModalUrl(bridgeUrl);
      setStep("confirming");
      pollQuota(selectedPlanId, baseline);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menyiapkan halaman pembayaran. Coba lagi.",
      );
      setStep("checkout");
    }
  }

  return (
    <>
      <Header title="Paket Plus" containerClassName="max-w-3xl" />

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
                        1x posting / bulan, aktif 2 minggu
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-input bg-surface/60 px-4 py-3">
                      <div>
                        <p className="text-[12px] font-bold text-muted-foreground">
                          Bayar per Posting
                        </p>
                        <p className="mt-0.5 text-[14px] font-normal text-charcoal">
                          Rp 50.000 sekali posting, aktif 2 minggu
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => choosePlan("extra_ad")}
                        className="h-9 shrink-0 rounded-pill bg-charcoal px-4 text-[13px] font-bold text-white transition-colors hover:bg-black"
                      >
                        Beli
                      </button>
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
                        1x posting, aktif 1 minggu
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 rounded-input bg-surface/60 px-4 py-3">
                      <div>
                        <p className="text-[12px] font-bold text-muted-foreground">
                          Bayar per Posting
                        </p>
                        <p className="mt-0.5 text-[14px] font-normal text-charcoal">
                          Rp 12.000 sekali posting, aktif 2 minggu
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => choosePlan("extra_sayembara")}
                        className="h-9 shrink-0 rounded-pill bg-charcoal px-4 text-[13px] font-bold text-white transition-colors hover:bg-black"
                      >
                        Beli
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="mt-8 text-xl font-bold text-charcoal">
                Upgrade Paket
              </h2>
              <p className="mt-1 text-[14px] font-normal text-muted-foreground">
                Sekali bayar, dapat jatah iklan dan sayembara lebih banyak.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="mx-auto flex w-full max-w-sm flex-col rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[3px_3px_0_0_rgba(20,20,20,1)]">
                  <h3 className="text-base font-bold text-charcoal">
                    {PLANS.hemat.name}
                  </h3>
                  <p className="mt-2">
                    <span className="text-2xl font-bold text-charcoal">
                      {PLANS.hemat.price}
                    </span>
                    <span className="text-[14px] font-normal text-muted-foreground">
                      {" "}
                      {PLANS.hemat.period}
                    </span>
                  </p>

                  <ul className="mt-4 flex flex-1 flex-col gap-2">
                    {PLANS.hemat.benefits.map((benefit) => (
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
                    onClick={() => choosePlan("hemat")}
                    className="mt-6 h-11 rounded-pill border-2 border-ink text-base font-bold text-charcoal transition-colors hover:bg-surface"
                  >
                    Pilih Paket
                  </button>
                </div>

                <div className="relative mx-auto flex w-full max-w-sm flex-col rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[4px_4px_0_0_rgba(255,199,44,1)]">
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-pill border-2 border-ink bg-brand px-4 py-1 text-[12px] font-bold text-charcoal shadow-[2px_2px_0_0_rgba(20,20,20,1)]">
                    Paling Direkomendasikan
                  </span>
                  <h3 className="text-base font-bold text-charcoal">
                    {PLANS.plus.name}
                  </h3>
                  <p className="mt-2">
                    <span className="text-2xl font-bold text-charcoal">
                      {PLANS.plus.price}
                    </span>
                    <span className="text-[14px] font-normal text-muted-foreground">
                      {" "}
                      {PLANS.plus.period}
                    </span>
                  </p>

                  <ul className="mt-4 flex flex-1 flex-col gap-2">
                    {PLANS.plus.benefits.map((benefit) => (
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
                    onClick={() => choosePlan("plus")}
                    className="mt-6 h-11 rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black"
                  >
                    Pilih Paket
                  </button>
                </div>
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
                Pembayaran diproses otomatis dan aman.
              </p>

              <div className="mt-6 rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[3px_3px_0_0_rgba(20,20,20,1)]">
                <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                  <span className="text-base font-bold text-charcoal">
                    {selectedPlan.name}
                  </span>
                  <span className="text-base font-bold text-charcoal">
                    {selectedPlan.price}
                    <span className="text-[14px] font-normal text-muted-foreground">
                      {selectedPlan.period}
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-base font-bold text-charcoal">
                    Total Tagihan
                  </span>
                  <span className="text-xl font-bold text-cta">
                    {selectedPlan.price}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-[12px] font-bold text-muted-foreground" htmlFor="mobile">
                  Nomor WhatsApp
                </label>
                <input
                  id="mobile"
                  className={`mt-1 ${inputClass}`}
                  placeholder="Contoh: 6281234567890"
                  value={mobile}
                  onChange={(event) => setMobile(event.target.value)}
                />
                <p className="mt-1 text-[12px] font-normal text-muted-foreground">
                  Digunakan untuk konfirmasi dan rincian transaksi.
                </p>
              </div>

              <div className="mt-4 rounded-card border-[2.5px] border-ink bg-white p-5 shadow-[3px_3px_0_0_rgba(20,20,20,1)]">
                <p className="text-[12px] font-bold text-muted-foreground">
                  Metode Pembayaran yang Didukung
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.label}
                      className="flex items-center gap-2 rounded-input border border-border-subtle px-3 py-2.5"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-charcoal">
                        <method.icon width={16} height={16} />
                      </span>
                      <div>
                        <p className="text-[13px] font-bold text-charcoal">
                          {method.label}
                        </p>
                        <p className="text-[11px] font-normal text-muted-foreground">
                          {method.detail}
                        </p>
                      </div>
                    </div>
                  ))}
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
                Lanjutkan Pembayaran
              </button>
            </>
          )}

          {step === "redirecting" && (
            <div className="flex flex-col items-center rounded-card border-[2.5px] border-ink bg-white p-10 text-center shadow-[3px_3px_0_0_rgba(20,20,20,1)]">
              <span className="h-10 w-10 animate-spin rounded-full border-4 border-surface border-t-cta" />
              <p className="mt-4 text-base font-normal text-charcoal">
                Menyiapkan Halaman Pembayaran...
              </p>
            </div>
          )}

          {step === "confirming" && (
            <div className="flex flex-col items-center rounded-card border-[2.5px] border-ink bg-white p-10 text-center shadow-[3px_3px_0_0_rgba(20,20,20,1)]">
              <span className="h-10 w-10 animate-spin rounded-full border-4 border-surface border-t-cta" />
              <p className="mt-4 text-base font-bold text-charcoal">
                Mengonfirmasi Pembayaran...
              </p>
              <p className="mt-2 max-w-sm text-[14px] font-normal text-muted-foreground">
                Kami sedang mengonfirmasi pembayaranmu secara otomatis. Ini biasanya cuma beberapa detik.
              </p>
              {paymentModalUrl && (
                <button
                  type="button"
                  onClick={() => setPaymentModalUrl(paymentModalUrl)}
                  className="mt-4 text-[13px] font-bold text-cta hover:underline"
                >
                  Buka kembali pop-up pembayaran
                </button>
              )}
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
                Pembayaranmu belum terdeteksi. Kalau kamu sudah bayar, jatah akan otomatis aktif begitu terkonfirmasi. Cek lagi sebentar ya!
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
                Pembayaran Berhasil! 🎉
              </h2>
              <p className="mt-2 max-w-sm text-[14px] font-normal text-muted-foreground">
                {selectedPlan.name} kamu sudah aktif. Jatah otomatis
                ditambahkan ke akunmu.
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

      {/* In-Page Payment Modal */}
      {paymentModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative flex h-[90vh] max-h-[720px] w-full max-w-xl flex-col overflow-hidden rounded-card border-[3px] border-ink bg-cream shadow-[6px_6px_0_0_rgba(20,20,20,1)]">
            <div className="flex items-center justify-between border-b-[2.5px] border-ink bg-white px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-ink bg-brand text-xs font-bold text-charcoal">
                  N
                </span>
                <p className="text-base font-bold text-charcoal">
                  Pembayaran {selectedPlan.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalUrl(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal/60 transition-colors hover:bg-surface hover:text-charcoal"
                title="Tutup Modal"
              >
                <CloseIcon width={18} height={18} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden bg-white">
              <iframe
                src={paymentModalUrl}
                title="Form Pembayaran Nemsy!"
                className="h-full w-full border-0"
              />
            </div>

            <div className="flex items-center justify-between border-t border-border-subtle bg-surface/80 px-4 py-3 text-[12px] font-medium text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-surface border-t-cta" />
                Memeriksa status pembayaran...
              </span>
              {manualLink && (
                <a
                  href={manualLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-cta hover:underline"
                >
                  Buka di tab baru ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
