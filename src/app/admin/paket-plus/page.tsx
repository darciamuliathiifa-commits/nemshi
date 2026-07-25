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
      <header className="sticky top-0 z-10 border-b border-border-subtle bg-white/90 px-6 py-4 backdrop-blur">
        <h1 className="text-2xl leading-[30px] font-bold text-charcoal">Paket Plus</h1>
      </header>

      <main className="flex-1 px-6 py-8">
        {loadState === "loading" && (
          <p className="text-[14px] font-normal text-muted-foreground">Memuat...</p>
        )}

        {loadState === "error" && (
          <div className="flex flex-col items-center justify-center rounded-input border border-dashed border-border-strong py-16 text-center">
            <p className="text-base font-normal text-charcoal">
              Gagal memuat transaksi.
            </p>
            <p className="mt-1 text-[14px] font-normal text-muted-foreground">
              Pastikan kamu masuk dengan akun admin.
            </p>
          </div>
        )}

        {loadState === "ready" && (
          <>
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-input border border-border-subtle bg-white p-4">
                <p className="text-2xl font-bold text-charcoal">{formatRupiah(totalRevenue)}</p>
                <p className="mt-1 text-[12px] font-bold text-muted-foreground">
                  Total Pendapatan (Sukses)
                </p>
              </div>
              <div className="rounded-input border border-border-subtle bg-white p-4">
                <p className="text-2xl font-bold text-charcoal">{pendingCount}</p>
                <p className="mt-1 text-[12px] font-bold text-muted-foreground">
                  Menunggu Konfirmasi
                </p>
              </div>
              <div className="rounded-input border border-border-subtle bg-white p-4">
                <p className={`text-2xl font-bold ${stuckCount > 0 ? "text-error" : "text-charcoal"}`}>
                  {stuckCount}
                </p>
                <p className="mt-1 text-[12px] font-bold text-muted-foreground">
                  Kemungkinan Macet (&gt;30 menit)
                </p>
              </div>
            </div>

            {stuckCount > 0 && (
              <div className="mb-4 rounded-input border border-error/40 bg-error/5 px-4 py-3">
                <p className="text-[14px] font-normal text-error">
                  Ada {stuckCount} transaksi pending lebih dari 30 menit. Kemungkinan
                  webhook Mayar gagal atau user belum menyelesaikan pembayaran — cek
                  manual di dashboard Mayar kalau perlu.
                </p>
              </div>
            )}

            <div className="overflow-hidden rounded-input border border-border-subtle bg-white">
              {transactions.length === 0 ? (
                <p className="px-4 py-8 text-center text-[14px] font-normal text-muted-foreground">
                  Belum ada transaksi.
                </p>
              ) : (
                transactions.map((t) => {
                  const isStuck =
                    t.status === "pending" &&
                    now !== null &&
                    now - new Date(t.createdAt).getTime() > STUCK_THRESHOLD_MS;

                  return (
                    <div
                      key={t.id}
                      className="flex flex-col gap-2 border-b border-border-subtle p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-badge px-2.5 py-1 text-[12px] font-bold ${
                              statusAccent[t.status] ?? "bg-muted text-white"
                            }`}
                          >
                            {t.status}
                          </span>
                          {isStuck && (
                            <span className="rounded-badge bg-error/10 px-2.5 py-1 text-[12px] font-bold text-error">
                              Macet
                            </span>
                          )}
                          <span className="text-[12px] font-bold text-muted-foreground">
                            {planLabels[t.planId] ?? t.planId}
                          </span>
                        </div>
                        <p className="mt-2 text-[14px] font-bold text-charcoal">
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

                      <p className="text-base font-bold text-charcoal">
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
