"use client";

import { useEffect, useState } from "react";
import { formatRupiah } from "@/lib/format";

type Report = {
  totalRevenue: number;
  avgClicksPerCategory: { categoryName: string; averageClicks: number }[];
  renewalRatio: number;
  monthlyRevenue: { month: string; total: number }[];
  traktirTotal: number;
};

export default function AdminDashboardPage() {
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((r) => r.json())
      .then(setReport);
  }, []);

  if (!report) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm shadow-black/5">
        <p className="text-text-secondary">Memuat laporan...</p>
      </div>
    );
  }

  const maxMonthlyRevenue = Math.max(1, ...report.monthlyRevenue.map((m) => m.total));
  const maxClicks = Math.max(1, ...report.avgClicksPerCategory.map((c) => c.averageClicks));

  const stats = [
    { label: "Total Pendapatan", value: formatRupiah(report.totalRevenue) },
    { label: "Rasio Perpanjangan Iklan", value: `${report.renewalRatio.toFixed(1)}%` },
    { label: "Kategori Terpantau", value: report.avgClicksPerCategory.length },
    { label: "Donasi Traktir Platform", value: formatRupiah(report.traktirTotal) },
  ];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm shadow-black/5 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-text">Dashboard Laporan Bisnis</h1>
        <a
          href="/api/admin/reports/export"
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface"
        >
          Unduh CSV
        </a>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-surface p-5">
            <p className="text-sm text-text-secondary">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-primary">{stat.value}</p>
          </div>
        ))}
      </div>
      <p className="mb-6 -mt-2 text-xs text-text-secondary">
        Rasio Perpanjangan Iklan: proksi persentase pengguna dengan &gt;1 pembelian Iklan
        Tawarkan Jasa.
      </p>

      <section className="mb-6 rounded-2xl bg-surface p-5">
        <h2 className="mb-4 font-semibold text-text">Pendapatan Bulanan (3 Bulan Terakhir)</h2>
        {report.monthlyRevenue.length === 0 ? (
          <p className="text-sm text-text-secondary">Belum ada data.</p>
        ) : (
          <div className="flex items-end gap-4">
            {report.monthlyRevenue.map((m) => (
              <div key={m.month} className="flex flex-col items-center gap-1">
                <div
                  className="w-12 rounded-t-lg bg-primary"
                  style={{ height: `${(m.total / maxMonthlyRevenue) * 120 + 4}px` }}
                />
                <span className="text-xs text-text-secondary">{m.month}</span>
                <span className="text-xs font-medium text-text">{formatRupiah(m.total)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-surface p-5">
        <h2 className="mb-4 font-semibold text-text">Rata-rata Klik WhatsApp per Kategori</h2>
        {report.avgClicksPerCategory.length === 0 ? (
          <p className="text-sm text-text-secondary">Belum ada data.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {report.avgClicksPerCategory.map((c) => (
              <div key={c.categoryName} className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-sm text-text-secondary">{c.categoryName}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(c.averageClicks / maxClicks) * 100}%` }}
                  />
                </div>
                <span className="w-12 text-right text-sm font-medium text-text">
                  {c.averageClicks.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
