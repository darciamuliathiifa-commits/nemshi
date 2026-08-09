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
      <header className="sticky top-0 z-10 border-b-[2.5px] border-ink bg-cream/90 px-6 py-4 backdrop-blur-md">
        <h1 className="text-2xl leading-[30px] font-bold text-charcoal">
          Laporan Pengguna
        </h1>
        <p className="mt-0.5 text-[13px] font-normal text-muted-foreground">
          Kelola laporan aduan konten atau iklan bermasalah dari pengguna.
        </p>
      </header>

      <main className="flex-1 px-6 py-8">
        {loadState === "loading" && (
          <div className="flex h-40 items-center justify-center">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-surface border-t-cta" />
          </div>
        )}

        {loadState === "error" && (
          <div className="flex flex-col items-center justify-center rounded-card border-[2.5px] border-ink bg-white p-12 text-center shadow-[4px_4px_0_0_rgba(20,20,20,1)]">
            <p className="text-base font-bold text-charcoal">
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

            <div className="flex flex-col gap-4">
              {reports.map((report) => {
                const isPending = pendingId === report.id;
                return (
                  <div
                    key={report.id}
                    className="flex flex-col gap-3 rounded-card border-[2.5px] border-ink bg-white p-5 shadow-[4px_4px_0_0_rgba(20,20,20,1)] sm:flex-row sm:items-center sm:justify-between transition-transform hover:-translate-y-0.5"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-badge border border-ink px-2.5 py-1 text-[12px] font-bold ${statusAccent[report.status]}`}
                        >
                          {report.status}
                        </span>
                        <span className="rounded-input border border-border-subtle bg-surface px-2.5 py-1 text-[12px] font-bold text-charcoal">
                          Alasan: {report.reason}
                        </span>
                      </div>
                      <p className="mt-2 text-base font-bold text-charcoal">
                        {report.adTitle ?? "Iklan tidak ditemukan"}
                      </p>
                      <p className="mt-1 text-[12px] font-normal text-muted-foreground">
                        Dilaporkan oleh <strong className="text-charcoal">{report.reporterName ?? "Tidak diketahui"}</strong> ·{" "}
                        {new Date(report.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {report.status !== "Selesai" &&
                      (isPending ? (
                        <span className="flex h-9 items-center gap-2 px-2 text-[14px] font-bold text-muted-foreground">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface border-t-cta" />
                          Memproses...
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleResolve(report)}
                          className="h-10 shrink-0 rounded-pill border-2 border-ink bg-charcoal px-5 text-[13px] font-bold text-white shadow-[2px_2px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5 hover:bg-black"
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
