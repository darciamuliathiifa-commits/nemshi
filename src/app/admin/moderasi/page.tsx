"use client";

import { useEffect, useState } from "react";
import type { AdCategory, AdKind } from "@/lib/types";

interface ModerationItem {
  id: string;
  title: string;
  kind: AdKind;
  category: AdCategory;
  submittedBy: string | null;
  flagReason: string | null;
  createdAt: string;
}

type LoadState = "loading" | "ready" | "error";

export default function AdminModerasiPage() {
  const [queue, setQueue] = useState<ModerationItem[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/ads?status=Menunggu Validasi")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat antrean moderasi.");
        return res.json();
      })
      .then((data: { ads: ModerationItem[] }) => {
        setQueue(data.ads);
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));
  }, []);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }

  async function handleAction(item: ModerationItem, action: "Setujui" | "Tolak") {
    setPendingId(item.id);

    try {
      const res = await fetch(`/api/admin/ads/${item.id}/validate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approve: action === "Setujui" }),
      });

      if (!res.ok) throw new Error("Gagal memproses iklan.");

      setQueue((prev) => prev.filter((entry) => entry.id !== item.id));
      showToast(
        action === "Setujui"
          ? `"${item.title}" disetujui dan akan tayang.`
          : `"${item.title}" ditolak.`,
      );
    } catch {
      showToast("Gagal memproses. Coba lagi.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border-subtle bg-white/90 px-6 py-4 backdrop-blur">
        <h1 className="text-2xl leading-[30px] font-bold text-charcoal">
          Moderasi Iklan
        </h1>
      </header>

      <main className="flex-1 px-6 py-8">
        {loadState === "loading" && (
          <p className="text-[14px] font-normal text-muted-foreground">Memuat...</p>
        )}

        {loadState === "error" && (
          <div className="flex flex-col items-center justify-center rounded-input border border-dashed border-border-strong py-16 text-center">
            <p className="text-base font-normal text-charcoal">
              Gagal memuat antrean moderasi.
            </p>
            <p className="mt-1 text-[14px] font-normal text-muted-foreground">
              Pastikan kamu masuk dengan akun admin.
            </p>
          </div>
        )}

        {loadState === "ready" && (
          <>
            <p className="mb-4 text-[14px] font-normal text-muted-foreground">
              {queue.length} iklan menunggu validasi.
            </p>

            {queue.length > 0 ? (
              <div className="overflow-hidden rounded-input border border-border-subtle bg-white">
                {queue.map((item) => {
                  const isPending = pendingId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 border-b border-border-subtle p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-badge bg-highlight px-2.5 py-1 text-[12px] font-bold text-white">
                            {item.category}
                          </span>
                          <span className="rounded-badge bg-charcoal/80 px-2.5 py-1 text-[12px] font-bold text-white">
                            {item.kind === "produk" ? "Produk" : "Jasa"}
                          </span>
                        </div>
                        <p className="mt-2 text-[14px] font-bold text-charcoal">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[12px] font-normal text-muted-foreground">
                          {item.submittedBy ?? "Tidak diketahui"} ·{" "}
                          {new Date(item.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        {item.flagReason && (
                          <p className="mt-1 text-[12px] font-normal text-error">
                            Terdeteksi: {item.flagReason}
                          </p>
                        )}
                      </div>

                      {isPending ? (
                        <span className="flex h-9 items-center gap-2 px-2 text-[14px] text-muted-foreground">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface border-t-cta" />
                          Memproses...
                        </span>
                      ) : (
                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() => handleAction(item, "Tolak")}
                            className="h-9 rounded-pill border border-error px-4 text-[14px] font-bold text-error transition-colors hover:bg-error/10"
                          >
                            Tolak
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAction(item, "Setujui")}
                            className="h-9 rounded-pill bg-success px-4 text-[14px] font-bold text-white transition-colors hover:bg-success/90"
                          >
                            Setujui
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-input border border-dashed border-border-strong py-16 text-center">
                <p className="text-base font-normal text-charcoal">
                  Semua iklan sudah divalidasi.
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
    </>
  );
}
