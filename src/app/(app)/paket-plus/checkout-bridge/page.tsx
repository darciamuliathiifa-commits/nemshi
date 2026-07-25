"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheckIcon, ZapIcon } from "@/components/icons";

const REDIRECT_DELAY_MS = 1400;

function CheckoutBridgeContent() {
  const searchParams = useSearchParams();
  const [tooSlow, setTooSlow] = useState(false);
  const link = searchParams.get("link");
  const planLabel = searchParams.get("label") || "pesanan kamu";

  useEffect(() => {
    if (!link) return;

    const redirectTimer = setTimeout(() => {
      window.location.href = link;
    }, REDIRECT_DELAY_MS);
    const slowTimer = setTimeout(() => setTooSlow(true), REDIRECT_DELAY_MS + 2000);

    return () => {
      clearTimeout(redirectTimer);
      clearTimeout(slowTimer);
    };
  }, [link]);

  if (!link) {
    return (
      <p className="text-[14px] font-normal text-error">
        Link pembayaran tidak ditemukan. Tutup halaman ini dan coba lagi.
      </p>
    );
  }

  return (
    <>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-charcoal">
        <ZapIcon width={24} height={24} />
      </span>
      <h1 className="mt-4 text-xl font-bold text-charcoal">
        Menyiapkan Pembayaran
      </h1>
      <p className="mt-2 max-w-xs text-[14px] font-normal leading-5 text-muted-foreground">
        Kamu akan diarahkan ke halaman pembayaran aman Mayar untuk{" "}
        {planLabel}.
      </p>

      <span className="mt-6 h-9 w-9 animate-spin rounded-full border-4 border-surface border-t-cta" />

      <div className="mt-6 flex items-center gap-2 rounded-pill border-2 border-ink bg-white px-4 py-2 text-[12px] font-bold text-charcoal shadow-[2px_2px_0_0_rgba(20,20,20,1)]">
        <ShieldCheckIcon width={14} height={14} className="shrink-0 text-success" />
        Diproses lewat Mayar, mitra pembayaran resmi Nemsy!
      </div>

      {tooSlow && (
        <a
          href={link}
          className="mt-6 text-[13px] font-bold text-cta hover:text-highlight"
        >
          Belum teralihkan otomatis? Klik di sini
        </a>
      )}
    </>
  );
}

export default function CheckoutBridgePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <Suspense fallback={<span className="h-9 w-9 animate-spin rounded-full border-4 border-surface border-t-cta" />}>
        <CheckoutBridgeContent />
      </Suspense>
    </main>
  );
}
