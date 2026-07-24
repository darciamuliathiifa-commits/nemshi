"use client";

import { useSavedAds } from "@/lib/saved-ads-store";

export function SaveButton({ adId }: { adId: string }) {
  const { isSaved, toggleSaved } = useSavedAds();
  const saved = isSaved(adId);

  return (
    <button
      type="button"
      onClick={() => toggleSaved(adId)}
      aria-pressed={saved}
      className={`h-11 flex-1 rounded-pill border-2 text-base font-bold transition-colors ${
        saved
          ? "border-cta bg-cta/5 text-cta"
          : "border-ink text-charcoal hover:bg-surface"
      }`}
    >
      {saved ? "Tersimpan" : "Simpan"}
    </button>
  );
}
