"use client";

import { useState } from "react";

type ShareStatus = "idle" | "copied" | "error";

export function ShareButton({ title }: { title: string }) {
  const [status, setStatus] = useState<ShareStatus>("idle");

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled or share failed — fall back to copy link
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 2000);
  }

  const label =
    status === "copied" ? "Link disalin!" : status === "error" ? "Gagal menyalin" : "Bagikan";

  return (
    <button
      type="button"
      onClick={handleShare}
      className="h-11 flex-1 rounded-pill border-2 border-ink text-base font-bold text-charcoal transition-colors hover:bg-surface"
    >
      {label}
    </button>
  );
}
