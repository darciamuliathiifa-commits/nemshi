"use client";

import { useMemo, useState } from "react";
import type { Ad, AdStatus } from "@/lib/types";

const statusFilters: AdStatus[] = ["Aktif", "Terjual", "Selesai", "Kedaluwarsa", "Ditutup"];

const statusAccent: Record<AdStatus, string> = {
  Aktif: "bg-success text-white",
  Terjual: "bg-charcoal text-white",
  Selesai: "bg-charcoal text-white",
  Kedaluwarsa: "bg-muted text-white",
  Ditutup: "bg-error text-white",
};

const MOCK_DELAY_MS = 600;

export function MyAdsList({ ads: initialAds }: { ads: Ad[] }) {
  const [ads, setAds] = useState(initialAds);
  const [activeStatus, setActiveStatus] = useState<AdStatus | "Semua">("Semua");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filteredAds = useMemo(() => {
    if (activeStatus === "Semua") return ads;
    return ads.filter((ad) => ad.status === activeStatus);
  }, [ads, activeStatus]);

  const statusCounts = useMemo(() => {
    const counts = new Map<AdStatus, number>();
    for (const status of statusFilters) counts.set(status, 0);
    for (const ad of ads) counts.set(ad.status, (counts.get(ad.status) ?? 0) + 1);
    return counts;
  }, [ads]);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }

  async function handleStatusChange(adId: string, status: AdStatus) {
    setPendingId(adId);
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    setAds((prev) => prev.map((ad) => (ad.id === adId ? { ...ad, status } : ad)));
    setPendingId(null);
    showToast(`Status iklan berhasil diubah ke ${status}.`);
  }

  async function handleExtend(adId: string) {
    setPendingId(adId);
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === adId ? { ...ad, status: "Aktif", postedAt: "Baru saja diperpanjang" } : ad,
      ),
    );
    setPendingId(null);
    showToast("Masa tayang iklan berhasil diperpanjang.");
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {statusFilters.map((status) => (
          <div
            key={status}
            className="rounded-card border border-border-subtle bg-white p-4"
          >
            <p className="text-2xl font-bold text-charcoal">{statusCounts.get(status)}</p>
            <p className="mt-1 text-[12px] font-bold text-muted-foreground">{status}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(["Semua", ...statusFilters] as const).map((status) => {
          const isActive = activeStatus === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => setActiveStatus(status)}
              className={`h-9 rounded-pill px-4 text-[14px] font-bold transition-colors ${
                isActive
                  ? "bg-charcoal text-white"
                  : "bg-transparent text-charcoal border border-border hover:bg-surface"
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>

      <p className="mb-4 text-[14px] font-normal text-muted-foreground">
        {filteredAds.length} iklan
        {activeStatus !== "Semua" ? ` berstatus ${activeStatus}` : ""}.
      </p>

      {filteredAds.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredAds.map((ad) => {
            const isPending = pendingId === ad.id;
            return (
              <div
                key={ad.id}
                className="flex flex-col gap-3 rounded-card border border-border-subtle bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-badge px-3 py-1 text-[12px] leading-4 font-bold ${statusAccent[ad.status]}`}
                    >
                      {ad.status}
                    </span>
                    <span className="text-[12px] font-bold text-muted-foreground">
                      {ad.category}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-charcoal">{ad.title}</h3>
                  <p className="mt-1 text-[14px] font-normal text-muted-foreground">
                    {ad.priceLabel} · {ad.location} · Diposting {ad.postedAt}
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:shrink-0">
                  {isPending ? (
                    <span className="flex h-9 items-center gap-2 px-2 text-[14px] text-muted-foreground">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface border-t-cta" />
                      Memproses...
                    </span>
                  ) : (
                    <>
                      {ad.status === "Kedaluwarsa" && (
                        <button
                          type="button"
                          onClick={() => handleExtend(ad.id)}
                          className="h-9 rounded-pill bg-cta px-4 text-[14px] font-bold text-white transition-colors hover:bg-highlight"
                        >
                          Perpanjang Masa Tayang
                        </button>
                      )}

                      <label className="flex items-center gap-2">
                        <span className="text-[12px] font-bold text-muted-foreground">
                          Ubah status
                        </span>
                        <select
                          value={ad.status}
                          disabled={pendingId !== null}
                          onChange={(event) =>
                            handleStatusChange(ad.id, event.target.value as AdStatus)
                          }
                          className="h-9 rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none focus:ring-3 focus:ring-cta/10 disabled:bg-surface"
                        >
                          {statusFilters.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </label>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border-strong py-16 text-center">
          <p className="text-base font-normal text-charcoal">
            Belum ada iklan berstatus {activeStatus}.
          </p>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-pill bg-charcoal px-5 py-3 text-[14px] font-bold text-white shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
