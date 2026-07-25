"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const statusOptions = ["Aktif", "Selesai", "Ditutup"] as const;
type SayembaraStatus = (typeof statusOptions)[number];

const statusAccent: Record<string, string> = {
  Aktif: "bg-success text-white",
  Selesai: "bg-charcoal text-white",
  Ditutup: "bg-error text-white",
};

export interface MySayembara {
  id: string;
  status: string;
  category: string;
  title: string;
  location: string;
  priceLabel: string | null;
  applicantCount: number;
  postedAt: string;
}

export function SayembaraManageList({ items: initialItems }: { items: MySayembara[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }

  async function handleStatusChange(id: string, status: SayembaraStatus) {
    setPendingId(id);
    try {
      const res = await fetch(`/api/sayembara/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal mengubah status.");
      }
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
      showToast(`Status sayembara berhasil diubah ke ${status}.`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal mengubah status.");
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Yakin mau hapus sayembara ini? Tindakan ini tidak bisa dibatalkan.")) {
      return;
    }

    setPendingId(id);
    try {
      const res = await fetch(`/api/sayembara/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal menghapus sayembara.");
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
      showToast("Sayembara berhasil dihapus.");
      router.refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menghapus sayembara.");
    } finally {
      setPendingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border-strong py-16 text-center">
        <p className="text-base font-normal text-charcoal">
          Belum ada sayembara yang kamu pasang.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const isPending = pendingId === item.id;
          return (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-card border-[2.5px] border-ink bg-white p-5 shadow-[3px_3px_0_0_rgba(20,20,20,1)]"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-badge px-3 py-1 text-[12px] leading-4 font-bold ${statusAccent[item.status] ?? statusAccent.Aktif}`}
                >
                  {item.status}
                </span>
                <span className="text-[12px] font-bold text-muted-foreground">
                  {item.category}
                </span>
              </div>

              <h3 className="line-clamp-2 text-base font-bold leading-5 text-charcoal">
                {item.title}
              </h3>
              {item.priceLabel && (
                <p className="text-lg font-bold text-cta">{item.priceLabel}</p>
              )}
              <p className="text-[13px] font-normal text-muted-foreground">
                {item.location} · {item.applicantCount} pendaftar · Diposting {item.postedAt}
              </p>

              <div className="mt-1 flex flex-col gap-2 border-t border-border-subtle pt-3">
                {isPending ? (
                  <span className="flex h-9 items-center gap-2 px-2 text-[14px] text-muted-foreground">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface border-t-cta" />
                    Memproses...
                  </span>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <Link
                        href={`/sayembara/${item.id}/edit`}
                        className="h-9 flex-1 rounded-pill border-2 border-ink text-center text-[14px] font-bold leading-[32px] text-charcoal transition-colors hover:bg-surface"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="h-9 flex-1 rounded-pill border-2 border-error text-[14px] font-bold text-error transition-colors hover:bg-error/10"
                      >
                        Hapus
                      </button>
                    </div>
                    <label className="flex items-center justify-between gap-2">
                      <span className="text-[12px] font-bold text-muted-foreground">
                        Ubah status
                      </span>
                      <select
                        value={item.status}
                        disabled={pendingId !== null}
                        onChange={(event) =>
                          handleStatusChange(item.id, event.target.value as SayembaraStatus)
                        }
                        className="h-9 flex-1 rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none focus:ring-3 focus:ring-cta/10 disabled:bg-surface"
                      >
                        {statusOptions.map((status) => (
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

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-pill bg-charcoal px-5 py-3 text-[14px] font-bold text-white shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
