"use client";

import { useMemo, useState } from "react";
import type { AdStatus } from "@/lib/types";
import { EditIcon } from "@/components/icons";
import { EditAdDialog } from "@/components/ads/edit-ad-dialog";
import { formatExpiryLabel, isNearingExpiry } from "@/lib/expiry";

const statusFilters: AdStatus[] = [
  "Aktif",
  "Menunggu Validasi",
  "Terjual",
  "Selesai",
  "Kedaluwarsa",
  "Ditutup",
];

const statusAccent: Record<AdStatus, string> = {
  Aktif: "bg-success text-white",
  "Menunggu Validasi": "bg-brand-dark text-charcoal",
  Terjual: "bg-charcoal text-white",
  Selesai: "bg-charcoal text-white",
  Kedaluwarsa: "bg-muted text-white",
  Ditutup: "bg-error text-white",
};

const categoryAccent: Record<string, string> = {
  Pendidikan: "from-blue-100 to-blue-50",
  "Makanan & Minuman": "from-amber-100 to-amber-50",
  "Kreatif & Digital": "from-violet-100 to-violet-50",
  "Bantuan & Layanan Harian": "from-emerald-100 to-emerald-50",
  "Barang Baru & Bekas": "from-rose-100 to-rose-50",
  "Perjalanan & Travel": "from-sky-100 to-sky-50",
  "Titipan & Bagasi": "from-orange-100 to-orange-50",
  Lainnya: "from-zinc-100 to-zinc-50",
};

export interface MyAd {
  id: string;
  status: AdStatus;
  category: string;
  title: string;
  priceLabel: string;
  location: string;
  postedAt: string;
  expiresAt: string | null;
  coverPhoto?: string;
  coverFocalPoint?: string;
}

export function MyAdsList({ ads: initialAds }: { ads: MyAd[] }) {
  const [ads, setAds] = useState(initialAds);
  const [activeStatus, setActiveStatus] = useState<AdStatus | "Semua">("Semua");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
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

  function handleEditSuccess(updated: Partial<MyAd>) {
    if (!updated.id) return;
    setAds((prev) =>
      prev.map((ad) => (ad.id === updated.id ? { ...ad, ...updated } : ad)),
    );
    showToast("Detail iklan berhasil diperbarui!");
  }

  async function handleStatusChange(adId: string, status: AdStatus) {
    setPendingId(adId);
    try {
      const res = await fetch(`/api/my-ads/${adId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal mengubah status.");
      }
      setAds((prev) => prev.map((ad) => (ad.id === adId ? { ...ad, status } : ad)));
      showToast(`Status iklan berhasil diubah ke ${status}.`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal mengubah status.");
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete(ad: MyAd) {
    if (
      !window.confirm(
        `Yakin mau hapus "${ad.title}"? Tindakan ini tidak bisa dibatalkan.`,
      )
    ) {
      return;
    }

    setPendingId(ad.id);
    try {
      const res = await fetch(`/api/my-ads/${ad.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal menghapus iklan.");
      }
      setAds((prev) => prev.filter((entry) => entry.id !== ad.id));
      showToast(`"${ad.title}" berhasil dihapus.`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menghapus iklan.");
    } finally {
      setPendingId(null);
    }
  }

  async function handleExtend(adId: string) {
    setPendingId(adId);
    try {
      const res = await fetch(`/api/my-ads/${adId}/extend`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Gagal memperpanjang masa tayang.");
      }
      // Extending only revives a "Kedaluwarsa" ad — a sold or closed one keeps
      // its status, so trust what the server actually wrote.
      setAds((prev) =>
        prev.map((ad) =>
          ad.id === adId
            ? {
                ...ad,
                status: (data.status as MyAd["status"]) ?? ad.status,
                expiresAt: (data.expiresAt as string | null) ?? null,
                postedAt: "Baru saja diperpanjang",
              }
            : ad,
        ),
      );
      showToast("Masa tayang iklan berhasil diperpanjang.");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Gagal memperpanjang masa tayang.",
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-6">
        {statusFilters.map((status) => (
          <div
            key={status}
            className="rounded-card border-2 border-ink bg-white p-4 shadow-[2px_2px_0_0_rgba(20,20,20,1)]"
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
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredAds.map((ad) => {
            const isPending = pendingId === ad.id;
            return (
              <div
                key={ad.id}
                className="flex flex-col overflow-hidden rounded-card border-[2.5px] border-ink bg-white shadow-[3px_3px_0_0_rgba(20,20,20,1)] transition-transform duration-200 hover:-translate-y-0.5 sm:flex-row sm:items-stretch"
              >
                {/* Image on left side */}
                <div
                  className={`relative h-44 w-full shrink-0 overflow-hidden bg-gradient-to-br sm:h-auto sm:w-44 lg:w-48 ${categoryAccent[ad.category] ?? categoryAccent.Lainnya}`}
                >
                  {ad.coverPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ad.coverPhoto}
                      alt={ad.title}
                      className="h-full w-full object-cover"
                      style={{ objectPosition: ad.coverFocalPoint || "50% 0%" }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-4 text-center text-[13px] font-bold text-charcoal/60">
                      {ad.category}
                    </div>
                  )}
                </div>

                {/* Details on right side */}
                <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`rounded-badge px-3 py-1 text-[12px] leading-4 font-bold ${statusAccent[ad.status]}`}
                      >
                        {ad.status}
                      </span>
                      <span className="text-[12px] font-bold text-muted-foreground">
                        {ad.category}
                      </span>
                    </div>

                    <h3 className="line-clamp-2 text-base font-bold leading-5 text-charcoal">
                      {ad.title}
                    </h3>
                    <p className="text-lg font-bold text-cta">{ad.priceLabel}</p>
                    <p className="text-[13px] font-normal text-muted-foreground">
                      {ad.location} · Diposting {ad.postedAt}
                    </p>
                    {ad.status === "Aktif" && formatExpiryLabel(ad.expiresAt) && (
                      <p
                        className={`text-[13px] font-bold ${
                          isNearingExpiry(ad.expiresAt) ? "text-error" : "text-muted-foreground"
                        }`}
                      >
                        {formatExpiryLabel(ad.expiresAt)}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col gap-2.5 border-t border-border-subtle pt-3">
                    {isPending ? (
                      <span className="flex h-9 items-center gap-2 px-2 text-[14px] text-muted-foreground">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface border-t-cta" />
                        Memproses...
                      </span>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingAdId(ad.id)}
                            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-pill border-2 border-ink bg-white text-[13px] font-bold text-charcoal shadow-[2px_2px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5"
                          >
                            <EditIcon width={14} height={14} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(ad)}
                            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-pill border-2 border-error text-[13px] font-bold text-error transition-colors hover:bg-error/10"
                          >
                            Hapus
                          </button>
                        </div>

                        {/* Offered before expiry too, not just after — the
                            H-2 reminder sends owners here while the ad is
                            still live, and renewing is free either way. */}
                        {(ad.status === "Kedaluwarsa" ||
                          (ad.status === "Aktif" && isNearingExpiry(ad.expiresAt))) && (
                          <button
                            type="button"
                            onClick={() => handleExtend(ad.id)}
                            className="h-9 w-full rounded-pill bg-cta text-[14px] font-bold text-white transition-colors hover:bg-highlight"
                          >
                            {ad.status === "Kedaluwarsa"
                              ? "Perpanjang Masa Tayang"
                              : "Perpanjang, Masih Ada"}
                          </button>
                        )}

                        <label className="flex items-center justify-between gap-2">
                          <span className="text-[12px] font-bold text-muted-foreground">
                            Ubah status
                          </span>
                          <select
                            value={ad.status}
                            disabled={pendingId !== null}
                            onChange={(event) =>
                              handleStatusChange(ad.id, event.target.value as AdStatus)
                            }
                            className="h-9 flex-1 rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none focus:ring-3 focus:ring-cta/10 disabled:bg-surface"
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

      <EditAdDialog
        adId={editingAdId}
        isOpen={editingAdId !== null}
        onClose={() => setEditingAdId(null)}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
