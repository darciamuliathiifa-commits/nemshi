"use client";

import { useEffect, useState } from "react";

type ReportStatus = "Baru" | "Ditinjau" | "Selesai";

interface ReportItem {
  id: string;
  adTitle: string | null;
  reason: string;
  reporterName: string | null;
  createdAt: string;
  status: ReportStatus;
}

type LoadState = "loading" | "ready" | "error";

const statusAccent: Record<ReportStatus, string> = {
  Baru: "bg-error text-white",
  Ditinjau: "bg-highlight text-white",
  Selesai: "bg-success text-white",
};

export default function AdminLaporanPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat laporan.");
        return res.json();
      })
      .then((data: { reports: ReportItem[] }) => {
        setReports(data.reports);
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));
  }, []);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  }

  async function handleResolve(report: ReportItem) {
    setPendingId(report.id);

    try {
      const res = await fetch(`/api/admin/reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Selesai" }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui laporan.");

      setReports((prev) =>
        prev.map((entry) =>
          entry.id === report.id ? { ...entry, status: "Selesai" } : entry,
        ),
      );
      showToast(`Laporan untuk "${report.adTitle}" ditandai selesai.`);
    } catch {
      showToast("Gagal memproses. Coba lagi.");
    } finally {
      setPendingId(null);
    }
  }

  const newCount = reports.filter((report) => report.status === "Baru").length;

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border-subtle bg-white/90 px-6 py-4 backdrop-blur">
        <h1 className="text-2xl leading-[30px] font-bold text-charcoal">Laporan</h1>
      </header>

      <main className="flex-1 px-6 py-8">
        {loadState === "loading" && (
          <p className="text-[14px] font-normal text-muted-foreground">Memuat...</p>
        )}

        {loadState === "error" && (
          <div className="flex flex-col items-center justify-center rounded-input border border-dashed border-border-strong py-16 text-center">
            <p className="text-base font-normal text-charcoal">
              Gagal memuat laporan.
            </p>
            <p className="mt-1 text-[14px] font-normal text-muted-foreground">
              Pastikan kamu masuk dengan akun admin.
            </p>
          </div>
        )}

        {loadState === "ready" && (
          <>
            <p className="mb-4 text-[14px] font-normal text-muted-foreground">
              {newCount} laporan baru menunggu tindak lanjut.
            </p>

            <div className="overflow-hidden rounded-input border border-border-subtle bg-white">
              {reports.map((report) => {
                const isPending = pendingId === report.id;
                return (
                  <div
                    key={report.id}
                    className="flex flex-col gap-3 border-b border-border-subtle p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-badge px-2.5 py-1 text-[12px] font-bold ${statusAccent[report.status]}`}
                        >
                          {report.status}
                        </span>
                        <span className="text-[12px] font-bold text-muted-foreground">
                          {report.reason}
                        </span>
                      </div>
                      <p className="mt-2 text-[14px] font-bold text-charcoal">
                        {report.adTitle ?? "Iklan tidak ditemukan"}
                      </p>
                      <p className="mt-1 text-[12px] font-normal text-muted-foreground">
                        Dilaporkan oleh {report.reporterName ?? "Tidak diketahui"} ·{" "}
                        {new Date(report.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {report.status !== "Selesai" &&
                      (isPending ? (
                        <span className="flex h-9 items-center gap-2 px-2 text-[14px] text-muted-foreground">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface border-t-cta" />
                          Memproses...
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleResolve(report)}
                          className="h-9 shrink-0 rounded-pill bg-charcoal px-4 text-[14px] font-bold text-white transition-colors hover:bg-black"
                        >
                          Tandai Selesai
                        </button>
                      ))}
                  </div>
                );
              })}
            </div>
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
