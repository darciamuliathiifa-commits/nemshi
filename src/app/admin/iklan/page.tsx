"use client";

import { useEffect, useState } from "react";
import type { AdCategory, AdKind, AdStatus } from "@/lib/types";
import { SearchIcon, StarIcon, CloseIcon } from "@/components/icons";
import { FocalPointPicker } from "@/components/ads/focal-point-picker";
import { AdminEditAdDialog } from "@/components/admin/admin-edit-ad-dialog";

interface AdminAdItem {
  id: string;
  title: string;
  kind: AdKind;
  category: AdCategory;
  status: AdStatus;
  priceLabel: string;
  location: string;
  submittedBy: string | null;
  flagReason: string | null;
  createdAt: string;
  featured: boolean;
  featuredUntil: string | null;
  coverPhoto: string | null;
  coverFocalPoint: string;
}

type LoadState = "loading" | "ready" | "error";

const statusFilters: (AdStatus | "Semua")[] = [
  "Semua",
  "Aktif",
  "Menunggu Validasi",
  "Terjual",
  "Selesai",
  "Kedaluwarsa",
  "Ditutup",
];

const statusAccent: Record<string, string> = {
  Aktif: "bg-success text-white",
  "Menunggu Validasi": "bg-brand-dark text-charcoal",
  Terjual: "bg-charcoal text-white",
  Selesai: "bg-charcoal text-white",
  Kedaluwarsa: "bg-muted text-white",
  Ditutup: "bg-error text-white",
};

export default function AdminIklanPage() {
  const [ads, setAds] = useState<AdminAdItem[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [statusFilter, setStatusFilter] = useState<AdStatus | "Semua">("Semua");
  const [search, setSearch] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [focalEditItem, setFocalEditItem] = useState<AdminAdItem | null>(null);
  const [focalDraft, setFocalDraft] = useState("50% 0%");
  const [savingFocal, setSavingFocal] = useState(false);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);

  useEffect(() => {
    setLoadState("loading");
    const params = new URLSearchParams();
    if (statusFilter !== "Semua") params.set("status", statusFilter);
    if (search.trim()) params.set("q", search.trim());

    const timeout = setTimeout(() => {
      fetch(`/api/admin/ads?${params.toString()}`)
        .then((res) => {
          if (!res.ok) throw new Error("Gagal memuat daftar iklan.");
          return res.json();
        })
        .then((data: { ads: AdminAdItem[] }) => {
          setAds(data.ads);
          setLoadState("ready");
        })
        .catch(() => setLoadState("error"));
    }, 250);

    return () => clearTimeout(timeout);
  }, [statusFilter, search]);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }

  async function handleToggleFeatured(item: AdminAdItem) {
    const nextFeatured = !item.featured;
    setPendingId(item.id);
    try {
      const res = await fetch(`/api/admin/ads/${item.id}/feature`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: nextFeatured }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Gagal mengubah status rekomendasi.");
      }
      setAds((prev) =>
        prev.map((entry) =>
          entry.id === item.id
            ? { ...entry, featured: nextFeatured, featuredUntil: data.featuredUntil ?? null }
            : entry,
        ),
      );
      showToast(
        nextFeatured
          ? `"${item.title}" dijadikan iklan rekomendasi selama 7 hari.`
          : `"${item.title}" dikeluarkan dari rekomendasi.`,
      );
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Gagal mengubah status rekomendasi.",
      );
    } finally {
      setPendingId(null);
    }
  }

  function openFocalEditor(item: AdminAdItem) {
    setFocalEditItem(item);
    setFocalDraft(item.coverFocalPoint || "50% 0%");
  }

  async function handleSaveFocal() {
    if (!focalEditItem) return;
    setSavingFocal(true);
    try {
      const res = await fetch(`/api/admin/ads/${focalEditItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverFocalPoint: focalDraft }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Gagal menyimpan titik fokus.");
      }
      setAds((prev) =>
        prev.map((entry) =>
          entry.id === focalEditItem.id
            ? { ...entry, coverFocalPoint: data.coverFocalPoint ?? focalDraft }
            : entry,
        ),
      );
      showToast(`Titik fokus foto "${focalEditItem.title}" berhasil disimpan.`);
      setFocalEditItem(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menyimpan titik fokus.");
    } finally {
      setSavingFocal(false);
    }
  }

  async function handleDelete(item: AdminAdItem) {
    if (
      !window.confirm(
        `Yakin mau hapus "${item.title}"? Tindakan ini tidak bisa dibatalkan.`,
      )
    ) {
      return;
    }

    setPendingId(item.id);
    try {
      const res = await fetch(`/api/admin/ads/${item.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal menghapus iklan.");
      }
      setAds((prev) => prev.filter((entry) => entry.id !== item.id));
      showToast(`"${item.title}" berhasil dihapus.`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menghapus iklan.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-10 border-b-[2.5px] border-ink bg-cream/90 px-6 py-4 backdrop-blur-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl leading-[30px] font-bold text-charcoal">
              Semua Iklan
            </h1>
            <p className="mt-0.5 text-[13px] font-normal text-muted-foreground">
              Lihat dan kelola seluruh iklan yang pernah diupload pengguna.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <SearchIcon
              width={16}
              height={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari judul iklan..."
              className="h-10 w-full rounded-pill border-2 border-ink bg-white pl-9 pr-4 text-[14px] text-charcoal placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {statusFilters.map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`h-9 rounded-pill px-4 text-[14px] font-bold transition-colors ${
                  isActive
                    ? "border-2 border-ink bg-brand text-charcoal shadow-[2px_2px_0_0_rgba(20,20,20,1)]"
                    : "border border-border bg-transparent text-charcoal hover:bg-surface"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        {loadState === "loading" && (
          <div className="flex h-40 items-center justify-center">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-surface border-t-cta" />
          </div>
        )}

        {loadState === "error" && (
          <div className="flex flex-col items-center justify-center rounded-card border-[2.5px] border-ink bg-white p-12 text-center shadow-[4px_4px_0_0_rgba(20,20,20,1)]">
            <p className="text-base font-bold text-charcoal">
              Gagal memuat daftar iklan.
            </p>
            <p className="mt-1 text-[14px] font-normal text-muted-foreground">
              Pastikan kamu masuk dengan akun admin.
            </p>
          </div>
        )}

        {loadState === "ready" && (
          <>
            <p className="mb-4 text-[14px] font-normal text-muted-foreground">
              {ads.length} iklan ditemukan.
            </p>

            {ads.length > 0 ? (
              <div className="flex flex-col gap-4">
                {ads.map((item) => {
                  const isPending = pendingId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-card border-[2.5px] border-ink bg-white p-5 shadow-[4px_4px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-badge px-2.5 py-1 text-[12px] font-bold ${
                              statusAccent[item.status] ?? "bg-surface text-charcoal"
                            }`}
                          >
                            {item.status}
                          </span>
                          <span className="rounded-badge border border-ink bg-brand px-2.5 py-1 text-[12px] font-bold text-charcoal">
                            {item.category}
                          </span>
                          <span className="rounded-badge border border-ink bg-charcoal px-2.5 py-1 text-[12px] font-bold text-white">
                            {item.kind === "produk" ? "Produk" : "Jasa"}
                          </span>
                          {item.featured && (
                            <span className="flex items-center gap-1 rounded-badge border border-ink bg-highlight px-2.5 py-1 text-[12px] font-bold text-charcoal">
                              <StarIcon width={12} height={12} />
                              Rekomendasi
                            </span>
                          )}
                        </div>
                        <p className="mt-2 truncate text-base font-bold text-charcoal">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[13px] font-bold text-cta">
                          {item.priceLabel} · {item.location}
                        </p>
                        <p className="mt-1 text-[12px] font-normal text-muted-foreground">
                          Oleh: <strong className="text-charcoal">{item.submittedBy ?? "Tidak diketahui"}</strong> ·{" "}
                          {new Date(item.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        {item.flagReason && (
                          <p className="mt-1 text-[12px] font-bold text-error">
                            Terdeteksi: {item.flagReason}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 gap-2">
                        {isPending ? (
                          <span className="flex h-10 items-center gap-2 px-2 text-[14px] font-bold text-muted-foreground">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface border-t-cta" />
                            Memproses...
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => setEditingAdId(item.id)}
                              className="h-10 rounded-pill border-2 border-ink bg-white px-5 text-[13px] font-bold text-charcoal shadow-[2px_2px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5"
                            >
                              Edit Iklan
                            </button>
                            {item.coverPhoto && (
                              <button
                                type="button"
                                onClick={() => openFocalEditor(item)}
                                className="h-10 rounded-pill border-2 border-ink bg-white px-5 text-[13px] font-bold text-charcoal shadow-[2px_2px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5"
                              >
                                Atur Fokus Foto
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleToggleFeatured(item)}
                              className={`h-10 rounded-pill border-2 border-ink px-5 text-[13px] font-bold shadow-[2px_2px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5 ${
                                item.featured ? "bg-white text-charcoal" : "bg-highlight text-charcoal"
                              }`}
                            >
                              {item.featured ? "Batalkan Rekomendasi" : "Jadikan Rekomendasi"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              className="h-10 rounded-pill border-2 border-error bg-white px-5 text-[13px] font-bold text-error shadow-[2px_2px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5"
                            >
                              Hapus Iklan
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-card border-[2.5px] border-ink bg-white p-12 text-center shadow-[4px_4px_0_0_rgba(20,20,20,1)]">
                <p className="text-base font-bold text-charcoal">
                  Tidak ada iklan yang cocok.
                </p>
                <p className="mt-1 text-[14px] font-normal text-muted-foreground">
                  Coba ubah filter status atau kata kunci pencarian.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-pill bg-charcoal px-5 py-3 text-[14px] font-bold text-white shadow-lg">
          {toast}
        </div>
      )}

      {focalEditItem && focalEditItem.coverPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Tutup dialog"
            onClick={() => setFocalEditItem(null)}
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-md rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[5px_5px_0_0_rgba(20,20,20,1)]">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <h2 className="text-base font-bold text-charcoal">
                Atur Fokus Foto — {focalEditItem.title}
              </h2>
              <button
                type="button"
                onClick={() => setFocalEditItem(null)}
                aria-label="Tutup dialog"
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-white text-charcoal hover:bg-surface"
              >
                <CloseIcon width={16} height={16} />
              </button>
            </div>

            <div className="mt-5">
              <FocalPointPicker
                imageUrl={focalEditItem.coverPhoto}
                value={focalDraft}
                onChange={setFocalDraft}
              />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFocalEditItem(null)}
                disabled={savingFocal}
                className="h-10 rounded-pill border-2 border-ink bg-white px-5 text-[13px] font-bold text-charcoal transition-colors hover:bg-surface disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveFocal}
                disabled={savingFocal}
                className="h-10 rounded-pill bg-charcoal px-5 text-[13px] font-bold text-white transition-colors hover:bg-black disabled:opacity-50"
              >
                {savingFocal ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminEditAdDialog
        adId={editingAdId}
        isOpen={editingAdId !== null}
        onClose={() => setEditingAdId(null)}
        onSuccess={(updated) => {
          setAds((prev) =>
            prev.map((entry) =>
              entry.id === updated.id
                ? {
                    ...entry,
                    title: updated.title,
                    category: updated.category,
                    priceLabel: updated.priceLabel,
                    location: updated.location,
                  }
                : entry,
            ),
          );
          showToast(`"${updated.title}" berhasil diperbarui.`);
        }}
      />
    </>
  );
}
