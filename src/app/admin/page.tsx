"use client";

import { useEffect, useState } from "react";

interface AdminStats {
  totalUsers: number;
  pendingModeration: number;
  newReports: number;
  activePlusCustomers: number;
  revenueThisMonth: string;
}

type LoadState = "loading" | "ready" | "error";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat statistik.");
        return res.json();
      })
      .then((data: AdminStats) => {
        setStats(data);
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));
  }, []);

  const statTiles = stats
    ? [
        { label: "Total Pengguna", value: stats.totalUsers },
        { label: "Menunggu Moderasi", value: stats.pendingModeration },
        { label: "Laporan Baru", value: stats.newReports },
        { label: "Pelanggan Plus Aktif", value: stats.activePlusCustomers },
      ]
    : [];

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border-subtle bg-white/90 px-6 py-4 backdrop-blur">
        <h1 className="text-2xl leading-[30px] font-bold text-charcoal">Dasbor</h1>
      </header>

      <main className="flex-1 px-6 py-8">
        {loadState === "loading" && (
          <p className="text-[14px] font-normal text-muted-foreground">Memuat...</p>
        )}

        {loadState === "error" && (
          <div className="flex flex-col items-center justify-center rounded-input border border-dashed border-border-strong py-16 text-center">
            <p className="text-base font-normal text-charcoal">
              Gagal memuat statistik.
            </p>
            <p className="mt-1 text-[14px] font-normal text-muted-foreground">
              Pastikan kamu masuk dengan akun admin.
            </p>
          </div>
        )}

        {loadState === "ready" && stats && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {statTiles.map((tile) => (
              <div
                key={tile.label}
                className="rounded-input border border-border-subtle bg-white p-5"
              >
                <p className="text-2xl font-bold text-charcoal">{tile.value}</p>
                <p className="mt-1 text-[12px] font-bold text-muted-foreground">
                  {tile.label}
                </p>
              </div>
            ))}

            <div className="col-span-2 rounded-input border border-border-subtle bg-white p-5 lg:col-span-4">
              <p className="text-2xl font-bold text-charcoal">
                {stats.revenueThisMonth}
              </p>
              <p className="mt-1 text-[12px] font-bold text-muted-foreground">
                Pendapatan Paket Plus Bulan Ini
              </p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
