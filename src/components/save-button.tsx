"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 4a1 1 0 0 0-1 1v15l7-4.2 7 4.2V5a1 1 0 0 0-1-1H6Z"
      />
    </svg>
  );
}

export function SaveButton({
  listingId,
  initialSaved,
  variant = "overlay",
  onChange,
}: {
  listingId: string;
  initialSaved: boolean;
  variant?: "overlay" | "inline";
  onChange?: (saved: boolean) => void;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    setLoading(true);
    const response = await fetch(`/api/listings/${listingId}/save`, { method: "POST" });

    if (response.status === 401) {
      router.push(`/masuk?redirectTo=/iklan/${listingId}`);
      return;
    }

    const data = await response.json();
    setLoading(false);
    setSaved(data.saved);
    onChange?.(data.saved);
  }

  if (variant === "inline") {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={`flex items-center justify-center gap-2 border px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-60 ${
          saved
            ? "border-primary bg-surface-tint text-primary"
            : "border-black/10 text-text hover:bg-surface"
        }`}
      >
        <BookmarkIcon filled={saved} />
        {saved ? "Tersimpan" : "Simpan Jasa"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-label={saved ? "Hapus dari tersimpan" : "Simpan jasa"}
      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-text shadow-sm backdrop-blur-sm transition-transform hover:scale-105"
    >
      <BookmarkIcon filled={saved} />
    </button>
  );
}
