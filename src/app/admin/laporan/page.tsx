"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Report = {
  id: string;
  reason: string;
  description: string | null;
  status: string;
  createdAt: string;
  reviewedAt: string | null;
  listingId: string;
  listingTitle: string;
  listingStatus: string;
  listingOwnerId: string;
  listingOwnerName: string;
  listingOwnerSuspended: boolean;
};

const REASON_LABELS: Record<string, string> = {
  Penipuan: "Penipuan",
  Informasi_Palsu: "Informasi palsu",
  Spam: "Spam",
  Konten_Tidak_Pantas: "Konten tidak pantas",
  Lainnya: "Lainnya",
};

export default function LaporanKomunitasPage() {
  const [reports, setReports] = useState<Report[] | null>(null);
  const [suspendingId, setSuspendingId] = useState<string | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [message, setMessage] = useState("");

  async function loadReports() {
    const data = await fetch("/api/admin/community-reports").then((r) => r.json());
    setReports(data);
  }

  useEffect(() => {
    loadReports();
  }, []);

  async function handleResolve(id: string) {
    await fetch(`/api/admin/community-reports/${id}/resolve`, { method: "POST" });
    setMessage("Laporan ditandai selesai ditinjau.");
    loadReports();
  }

  async function handleSuspend() {
    if (!suspendingId || !suspendReason.trim()) return;
    const report = reports?.find((r) => r.id === suspendingId);
    if (!report) return;

    await fetch(`/api/admin/users/${report.listingOwnerId}/suspend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: suspendReason }),
    });
    await fetch(`/api/admin/community-reports/${suspendingId}/resolve`, { method: "POST" });

    setSuspendingId(null);
    setSuspendReason("");
    setMessage(`Akun ${report.listingOwnerName} ditangguhkan permanen.`);
    loadReports();
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-text">Laporan Komunitas</h1>
      <p className="mb-6 text-sm text-text-secondary">
        Tinjau laporan iklan mencurigakan dan tindak lanjuti dengan menandai selesai atau
        menangguhkan akun pelanggar secara permanen.
      </p>

      {message && <p className="mb-4 text-sm text-primary">{message}</p>}

      {!reports ? (
        <p className="text-text-secondary">Memuat laporan...</p>
      ) : reports.length === 0 ? (
        <p className="text-text-secondary">Belum ada laporan masuk.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {reports.map((report) => (
            <div key={report.id} className="rounded-xl border border-black/5 bg-white p-4">
              <div className="mb-2 flex items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/iklan/${report.listingId}`}
                    target="_blank"
                    className="font-medium text-text hover:underline"
                  >
                    {report.listingTitle}
                  </Link>
                  <p className="text-xs text-text-secondary">
                    Pemilik: {report.listingOwnerName}
                    {report.listingOwnerSuspended && (
                      <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                        Ditangguhkan
                      </span>
                    )}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    report.status === "Belum_Ditinjau"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-black/10 text-text-secondary"
                  }`}
                >
                  {report.status === "Belum_Ditinjau" ? "Belum Ditinjau" : "Ditinjau"}
                </span>
              </div>

              <p className="mb-1 text-sm text-text">
                Alasan: <span className="font-medium">{REASON_LABELS[report.reason] ?? report.reason}</span>
              </p>
              {report.description && (
                <p className="mb-2 text-sm text-text-secondary">{report.description}</p>
              )}
              <p className="mb-3 text-xs text-text-secondary">
                Dilaporkan {new Date(report.createdAt).toLocaleString("id-ID")}
              </p>

              {report.status === "Belum_Ditinjau" && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleResolve(report.id)}
                    className="rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-text-secondary hover:bg-black/5"
                  >
                    Tandai Selesai
                  </button>
                  {!report.listingOwnerSuspended && (
                    <button
                      onClick={() => setSuspendingId(report.id)}
                      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Tangguhkan Akun Permanen
                    </button>
                  )}
                </div>
              )}

              {suspendingId === report.id && (
                <div className="mt-3 rounded-xl bg-[#f0f4f6] p-3">
                  <textarea
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    rows={2}
                    placeholder="Alasan penangguhan permanen..."
                    className="mb-2 w-full resize-none rounded-xl border border-black/10 px-3 py-2 text-sm text-text outline-none focus:border-primary"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSuspend}
                      disabled={!suspendReason.trim()}
                      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      Konfirmasi Penangguhan
                    </button>
                    <button
                      onClick={() => {
                        setSuspendingId(null);
                        setSuspendReason("");
                      }}
                      className="rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-text-secondary hover:bg-black/5"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
