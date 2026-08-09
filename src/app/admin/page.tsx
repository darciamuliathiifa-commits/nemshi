"use client";

import { useEffect, useState } from "react";
import {
  UserIcon,
  CheckCircleIcon,
  FlagIcon,
  ZapIcon,
  CreditCardIcon,
} from "@/components/icons";

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
        {
          label: "Total Pengguna",
          value: stats.totalUsers,
          icon: UserIcon,
          badgeColor: "bg-blue-100 text-blue-800",
        },
        {
          label: "Menunggu Moderasi",
          value: stats.pendingModeration,
          icon: CheckCircleIcon,
          badgeColor: "bg-amber-100 text-amber-800",
        },
        {
          label: "Laporan Baru",
          value: stats.newReports,
          icon: FlagIcon,
          badgeColor: "bg-red-100 text-red-800",
        },
        {
          label: "Pelanggan Plus Aktif",
          value: stats.activePlusCustomers,
          icon: ZapIcon,
          badgeColor: "bg-brand text-charcoal",
        },
      ]
    : [];

  return (
    <>
      <header className="sticky top-0 z-10 border-b-[2.5px] border-ink bg-cream/90 px-6 py-4 backdrop-blur-md">
        <h1 className="text-2xl leading-[30px] font-bold text-charcoal">
          Dasbor Admin
        </h1>
        <p className="mt-0.5 text-[13px] font-normal text-muted-foreground">
          Ringkasan aktivitas platform Nemsy! secara real-time.
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
              Gagal memuat statistik.
            </p>
            <p className="mt-1 text-[14px] font-normal text-muted-foreground">
              Pastikan kamu masuk dengan akun yang memiliki hak akses admin.
            </p>
          </div>
        )}

        {loadState === "ready" && stats && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statTiles.map((tile) => {
                const Icon = tile.icon;
                return (
                  <div
                    key={tile.label}
                    className="flex flex-col justify-between rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[4px_4px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-charcoal">
                        {tile.value}
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-surface text-charcoal">
                        <Icon width={20} height={20} />
                      </span>
                    </div>
                    <p className="mt-4 text-[13px] font-bold text-muted-foreground">
                      {tile.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Big Revenue Banner */}
            <div className="flex items-center justify-between rounded-card border-[2.5px] border-ink bg-brand p-6 shadow-[5px_5px_0_0_rgba(20,20,20,1)]">
              <div>
                <p className="text-[13px] font-bold uppercase tracking-wider text-charcoal/80">
                  Pendapatan Paket Plus Bulan Ini
                </p>
                <p className="mt-1 text-3xl font-bold text-charcoal">
                  {stats.revenueThisMonth}
                </p>
              </div>
              <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-white text-charcoal shadow-[2px_2px_0_0_rgba(20,20,20,1)]">
                <CreditCardIcon width={28} height={28} />
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
