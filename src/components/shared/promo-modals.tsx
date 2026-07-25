"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CloseIcon } from "@/components/icons";

const FREE_EVENT_KEY = "nemshi:seen-free-event-promo";
const TOPUP_KEY = "nemshi:seen-topup-promo";

interface ProfileResponse {
  onboardingCompleted?: boolean;
}

export function PromoModals() {
  const [modal, setModal] = useState<"free-event" | "topup" | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) return;
        const data: ProfileResponse = await res.json();
        // Don't stack a promo on top of the onboarding modal.
        if (!data.onboardingCompleted) return;

        if (!localStorage.getItem(FREE_EVENT_KEY)) {
          setModal("free-event");
        } else if (!localStorage.getItem(TOPUP_KEY)) {
          setModal("topup");
        }
      } catch {
        // no promo shown on a transient failure
      }
    })();
  }, []);

  function close(key: string) {
    localStorage.setItem(key, "1");
    setModal(null);
  }

  if (!modal) return null;

  if (modal === "free-event") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6">
        <div className="relative w-full max-w-sm rounded-card border-[2.5px] border-ink bg-white p-6 text-center shadow-[5px_5px_0_0_rgba(20,20,20,1)]">
          <button
            type="button"
            onClick={() => close(FREE_EVENT_KEY)}
            aria-label="Tutup"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-charcoal hover:bg-surface"
          >
            <CloseIcon width={16} height={16} />
          </button>

          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl">
            🎉
          </span>
          <h2 className="mt-4 text-xl font-bold text-charcoal">
            Event Minggu Ini: Ngiklan Gratis!
          </h2>
          <p className="mt-2 text-[14px] font-normal leading-5 text-muted-foreground">
            Pasang iklan 3x <span className="font-bold text-charcoal">GRATIS</span>,
            tayang aktif selama 1 minggu penuh. Yuk manfaatin sebelum eventnya
            berakhir!
          </p>

          <Link
            href="/pasang-iklan"
            onClick={() => close(FREE_EVENT_KEY)}
            className="mt-6 flex h-11 items-center justify-center rounded-pill bg-charcoal text-[14px] font-bold text-white transition-colors hover:bg-black"
          >
            Pasang Iklan Gratis Sekarang
          </Link>
          <button
            type="button"
            onClick={() => close(FREE_EVENT_KEY)}
            className="mt-3 text-[13px] font-bold text-muted-foreground hover:text-charcoal"
          >
            Nanti dulu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6">
      <div className="relative w-full max-w-sm rounded-card border-[2.5px] border-ink bg-white p-6 text-center shadow-[5px_5px_0_0_rgba(20,20,20,1)]">
        <button
          type="button"
          onClick={() => close(TOPUP_KEY)}
          aria-label="Tutup"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-charcoal hover:bg-surface"
        >
          <CloseIcon width={16} height={16} />
        </button>

        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl">
          ⚡
        </span>
        <h2 className="mt-4 text-xl font-bold text-charcoal">
          Upgrade, Ngiklan Makin Leluasa
        </h2>
        <p className="mt-2 text-[14px] font-normal leading-5 text-muted-foreground">
          Dapat lebih banyak slot pasang iklan dan sayembara dengan Paket
          Hemat atau Paket Plus, mulai dari Rp 99.000.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/paket-plus"
            onClick={() => close(TOPUP_KEY)}
            className="flex h-11 items-center justify-center rounded-pill bg-charcoal text-[14px] font-bold text-white transition-colors hover:bg-black"
          >
            Lihat Paket
          </Link>
        </div>
        <button
          type="button"
          onClick={() => close(TOPUP_KEY)}
          className="mt-3 text-[13px] font-bold text-muted-foreground hover:text-charcoal"
        >
          Nanti dulu
        </button>
      </div>
    </div>
  );
}
