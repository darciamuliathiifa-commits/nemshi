"use client";

import { useEffect, useState } from "react";

interface TransactionItem {
  id: string;
  planId: string;
  amount: number;
  status: string;
  createdAt: string;
  hasInvoice: boolean;
  userName: string | null;
  userEmail: string | null;
}

type LoadState = "loading" | "ready" | "error";

const planLabels: Record<string, string> = {
  plus: "Paket Plus",
  hemat: "Paket Hemat",
  extra_ad: "Slot Iklan Tambahan",
  extra_sayembara: "Slot Sayembara Tambahan",
};

const statusAccent: Record<string, string> = {
  success: "bg-success text-white",
  pending: "bg-highlight text-white",
  failed: "bg-error text-white",
};

const STUCK_THRESHOLD_MS = 30 * 60 * 1000;

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export default function AdminTransaksiPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/transactions")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat transaksi.");
        return res.json();
      })
      .then((data: { transactions: TransactionItem[] }) => {
        setTransactions(data.transactions);
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));

    // eslint-disable-next-line react-hooks/set-state-in-effect -- Date.now() is impure and can't be read during render (see react-hooks/purity), so it's captured once on mount instead.
    setNow(Date.now());
  }, []);

  const totalRevenue = transactions
    .filter((t) => t.status === "success")
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingCount = transactions.filter((t) => t.status === "pending").length;
  const stuckCount = transactions.filter(
    (t) =>
      t.status === "pending" &&
      now !== null &&
      now - new Date(t.createdAt).getTime() > STUCK_THRESHOLD_MS,
  ).length;

  return (
    <>
      <header className="sticky top-0 z-10 border-b-[2.5px] border-ink bg-cream/90 px-6 py-4 backdrop-blur-md">
        <h1 className="text-2xl leading-[30px] font-bold text-charcoal">
          Riwayat Transaksi
        </h1>
        <p className="mt-0.5 text-[13px] font-normal text-muted-foreground">
          Kelola seluruh transaksi paket plus & slot iklan tambahan.
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
              Gagal memuat transaksi.
            </p>
            <p className="mt-1 text-[14px] font-normal text-muted-foreground">
              Pastikan kamu masuk dengan akun admin.
            </p>
          </div>
        )}

        {loadState === "ready" && (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-card border-[2.5px] border-ink bg-white p-5 shadow-[4px_4px_0_0_rgba(20,20,20,1)]">
                <p className="text-2xl font-bold text-cta">{formatRupiah(totalRevenue)}</p>
                <p className="mt-1 text-[12px] font-bold text-muted-foreground">
                  Total Pendapatan (Sukses)
                </p>
              </div>
              <div className="rounded-card border-[2.5px] border-ink bg-white p-5 shadow-[4px_4px_0_0_rgba(20,20,20,1)]">
                <p className="text-2xl font-bold text-charcoal">{pendingCount}</p>
                <p className="mt-1 text-[12px] font-bold text-muted-foreground">
                  Menunggu Konfirmasi
                </p>
              </div>
              <div className="rounded-card border-[2.5px] border-ink bg-white p-5 shadow-[4px_4px_0_0_rgba(20,20,20,1)]">
                <p className={`text-2xl font-bold ${stuckCount > 0 ? "text-error" : "text-charcoal"}`}>
                  {stuckCount}
                </p>
                <p className="mt-1 text-[12px] font-bold text-muted-foreground">
                  Kemungkinan Macet (&gt;30 menit)
                </p>
              </div>
            </div>

            {stuckCount > 0 && (
              <div className="mb-4 rounded-card border-[2.5px] border-error bg-error/10 px-5 py-4 text-error shadow-[3px_3px_0_0_rgba(20,20,20,1)]">
                <p className="text-[14px] font-bold">
                  ⚠️ Ada {stuckCount} transaksi pending lebih dari 30 menit. Kemungkinan
                  webhook pembayaran gagal atau user belum menyelesaikan pembayaran — cek
                  manual di dashboard gateway pembayaran jika perlu.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-card border-[2.5px] border-ink bg-white p-12 text-center shadow-[4px_4px_0_0_rgba(20,20,20,1)]">
                  <p className="text-base font-bold text-charcoal">
                    Belum ada transaksi.
                  </p>
                </div>
              ) : (
                transactions.map((t) => {
                  const isStuck =
                    t.status === "pending" &&
                    now !== null &&
                    now - new Date(t.createdAt).getTime() > STUCK_THRESHOLD_MS;

                  return (
                    <div
                      key={t.id}
                      className="flex flex-col gap-2 rounded-card border-[2.5px] border-ink bg-white p-5 shadow-[4px_4px_0_0_rgba(20,20,20,1)] sm:flex-row sm:items-center sm:justify-between transition-transform hover:-translate-y-0.5"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-badge border border-ink px-2.5 py-1 text-[12px] font-bold ${
                              statusAccent[t.status] ?? "bg-muted text-white"
                            }`}
                          >
                            {t.status}
                          </span>
                          {isStuck && (
                            <span className="rounded-badge border border-ink bg-error px-2.5 py-1 text-[12px] font-bold text-white">
                              Macet
                            </span>
                          )}
                          <span className="rounded-input border border-border-subtle bg-brand px-2.5 py-1 text-[12px] font-bold text-charcoal">
                            {planLabels[t.planId] ?? t.planId}
                          </span>
                        </div>
                        <p className="mt-2 text-base font-bold text-charcoal">
                          {t.userName ?? "Pengguna tidak diketahui"}
                        </p>
                        <p className="mt-1 text-[12px] font-normal text-muted-foreground">
                          {t.userEmail ?? "Email tidak ada"} ·{" "}
                          {new Date(t.createdAt).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      <p className="text-xl font-bold text-cta">
                        {formatRupiah(t.amount)}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
}
