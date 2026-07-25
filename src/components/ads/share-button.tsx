"use client";

import { useState } from "react";
import { ShareIcon } from "@/components/icons";

type ShareStatus = "idle" | "copied" | "error";

interface ShareButtonProps {
  title: string;
  /** Relative path to share, e.g. "/jelajahi/abc123". Defaults to the current page's URL — pass this explicitly when the button sits on a card whose own URL differs from the page it's rendered on. */
  path?: string;
  /** Compact icon-only variant for use on cards, instead of the full-width labeled button used on detail pages. */
  compact?: boolean;
}

export function ShareButton({ title, path, compact = false }: ShareButtonProps) {
  const [status, setStatus] = useState<ShareStatus>("idle");

  async function handleShare(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    const url = path ? `${window.location.origin}${path}` : window.location.href;

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

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleShare}
        aria-label={label}
        title={label}
        className="flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-sm transition-colors hover:bg-white sm:h-8 sm:w-8"
      >
        <ShareIcon width={13} height={13} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-pill border-2 border-ink text-base font-bold text-charcoal transition-colors hover:bg-surface"
    >
      <ShareIcon width={16} height={16} />
      {label}
    </button>
  );
}
