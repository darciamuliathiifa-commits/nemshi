"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { SayembaraForm, type SayembaraFormSubmitValues } from "@/components/sayembara/sayembara-form";
import { QuotaExceededModal } from "@/components/shared/quota-exceeded-modal";

export default function PasangSayembaraPage() {
  const [submitted, setSubmitted] = useState(false);
  const [showQuotaModal, setShowQuotaModal] = useState(false);

  async function handleSubmit(values: SayembaraFormSubmitValues) {
    const quotaRes = await fetch("/api/mayar/quota");
    if (quotaRes.ok) {
      const quota = await quotaRes.json();
      const hasSlot =
        quota.isUnlimited ||
        !quota.freeSayembaraSlotUsed ||
        quota.extraSayembaraSlots > 0;
      if (!hasSlot) {
        setShowQuotaModal(true);
        return;
      }
    }

    const res = await fetch("/api/sayembara", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: values.title,
        description: values.description,
        category: values.category,
        location: values.location,
        priceLabel: values.priceLabel ?? undefined,
        waNego: values.waNego,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error ?? "Gagal memasang sayembara.");
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <>
        <Header title="Pasang Sayembara" containerClassName="max-w-xl" />
        <main className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-xl">
            <div className="flex flex-col items-center rounded-card border-[2.5px] border-ink bg-white shadow-[3px_3px_0_0_rgba(20,20,20,1)] p-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-2xl text-success">
                ✓
              </span>
              <h2 className="mt-4 text-xl font-bold text-charcoal">
                Sayembara Berhasil Dipasang
              </h2>
              <p className="mt-2 max-w-sm text-[14px] font-normal text-muted-foreground">
                Pengumumanmu sudah tayang. Calon penyedia jasa bisa mulai
                mendaftarkan diri.
              </p>

              <div className="mt-6 flex w-full max-w-xs gap-3">
                <Link
                  href="/sayembara"
                  className="flex h-11 flex-1 items-center justify-center rounded-pill border-2 border-ink text-base font-bold text-charcoal transition-colors hover:bg-surface"
                >
                  Lihat Sayembara
                </Link>
                <Link
                  href="/iklan-saya"
                  className="flex h-11 flex-1 items-center justify-center rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black"
                >
                  Iklan Saya
                </Link>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Pasang Sayembara" containerClassName="max-w-xl" />

      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-xl">
          <h2 className="text-xl font-bold text-charcoal">
            Pasang Sayembara Jasa
          </h2>
          <p className="mt-1 text-[14px] font-normal text-muted-foreground">
            Beritahu komunitas Masisir kebutuhan jasamu.
          </p>

          <SayembaraForm
            submitLabel="Pasang Sayembara"
            submittingLabel="Memasang..."
            onSubmit={handleSubmit}
          />
        </div>
      </main>

      {showQuotaModal && (
        <QuotaExceededModal
          message="Slot pasang sayembara gratis kamu sudah kepakai. Upgrade paket buat dapat slot tambahan dan lanjut pasang sayembara."
          onClose={() => setShowQuotaModal(false)}
        />
      )}
    </>
  );
}
