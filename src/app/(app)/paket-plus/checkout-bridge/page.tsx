"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheckIcon, ZapIcon } from "@/components/icons";
import { paymentMethods } from "@/lib/payment-methods";

function CheckoutBridgeContent() {
  const searchParams = useSearchParams();
  const [selecting, setSelecting] = useState<string | null>(null);
  const link = searchParams.get("link");
  const planLabel = searchParams.get("label") || "pesanan kamu";

  function choose(method: string) {
    if (!link) return;
    setSelecting(method);
    // Brief moment so the selection registers visually before handing off
    // to Mayar to actually finish the payment for the chosen method.
    setTimeout(() => {
      window.location.href = link;
    }, 500);
  }

  if (!link) {
    return (
      <p className="text-[14px] font-normal text-error">
        Link pembayaran tidak ditemukan. Tutup halaman ini dan coba lagi.
      </p>
    );
  }

  if (selecting) {
    return (
      <>
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-charcoal">
          <ZapIcon width={24} height={24} />
        </span>
        <h1 className="mt-4 text-xl font-bold text-charcoal">
          Menghubungkan ke {selecting}
        </h1>
        <p className="mt-2 max-w-xs text-[14px] font-normal leading-5 text-muted-foreground">
          Kamu akan diarahkan untuk menyelesaikan pembayaran via {selecting}.
        </p>
        <span className="mt-6 h-9 w-9 animate-spin rounded-full border-4 border-surface border-t-cta" />
      </>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-charcoal">
          <ZapIcon width={24} height={24} />
        </span>
        <h1 className="mt-4 text-xl font-bold text-charcoal">Pilih Cara Bayar</h1>
        <p className="mt-2 text-[14px] font-normal leading-5 text-muted-foreground">
          Untuk {planLabel}. Pilih metode pembayaran yang kamu mau pakai.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        {paymentMethods.map((method) => (
          <button
            key={method.label}
            type="button"
            onClick={() => choose(method.label)}
            className="flex items-center gap-3 rounded-card border-2 border-ink bg-white px-4 py-3 text-left shadow-[2px_2px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-charcoal">
              <method.icon width={18} height={18} />
            </span>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-charcoal">{method.label}</p>
              <p className="text-[12px] font-normal text-muted-foreground">
                {method.detail}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-[12px] font-bold text-charcoal/60">
        <ShieldCheckIcon width={14} height={14} className="shrink-0 text-success" />
        Diproses secara aman melalui gerbang pembayaran resmi Nemsy!
      </div>
    </div>
  );
}

export default function CheckoutBridgePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 py-8 text-center">
      <Suspense fallback={<span className="h-9 w-9 animate-spin rounded-full border-4 border-surface border-t-cta" />}>
        <CheckoutBridgeContent />
      </Suspense>
    </main>
  );
}
