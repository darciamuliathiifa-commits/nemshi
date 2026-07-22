"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PaymentStatusBadge, FundStatusBadge } from "@/components/order-status-badges";
import { PRODUCT_LABELS, type OrderProductType } from "@/lib/pricing";
import { formatRupiah } from "@/lib/format";

type Order = {
  id: string;
  productType: OrderProductType;
  amount: number;
  paymentStatus: string;
  paymentMethod: string | null;
  fundStatus: string | null;
  listingId: string | null;
};

export default function RingkasanPesananPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState("");

  async function loadOrder() {
    const response = await fetch(`/api/orders/${orderId}`);
    if (response.status === 401) {
      router.replace(`/masuk?redirectTo=/bayar/${orderId}`);
      return;
    }
    setOrder(await response.json());
  }

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Webhook Mayar bisa datang beberapa detik setelah pengguna diarahkan
  // kembali ke halaman ini, jadi poll status secara berkala selagi masih
  // menunggu pembayaran.
  useEffect(() => {
    if (order?.paymentStatus !== "Menunggu_Pembayaran") return;

    const interval = setInterval(loadOrder, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.paymentStatus]);

  async function handleBayar() {
    setRedirecting(true);
    setError("");

    const response = await fetch(`/api/orders/${orderId}/mayar-checkout`, { method: "POST" });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Gagal memulai pembayaran.");
      setRedirecting(false);
      return;
    }

    window.location.href = data.link;
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-text-secondary">Memuat pesanan...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/bayar" className="mb-6 inline-block text-sm font-medium text-primary hover:underline">
        ← Kembali ke Pilihan Produk
      </Link>

      <h1 className="mb-4 text-2xl font-bold text-text">Ringkasan Pesanan</h1>

      <section className="mb-6 rounded-xl border border-black/5 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-text-secondary">Produk</span>
          <span className="font-medium text-text">{PRODUCT_LABELS[order.productType]}</span>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-text-secondary">Total Biaya</span>
          <span className="text-lg font-semibold text-primary">{formatRupiah(order.amount)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Status Pembayaran</span>
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
        {order.fundStatus && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-text-secondary">Status Dana</span>
            <FundStatusBadge status={order.fundStatus} />
          </div>
        )}
      </section>

      {order.paymentStatus === "Menunggu_Pembayaran" && (
        <section className="rounded-xl border border-black/5 bg-white p-6">
          <p className="mb-4 text-sm text-text-secondary">
            Kamu akan diarahkan ke halaman pembayaran Mayar untuk memilih metode bayar (QRIS,
            transfer bank, e-wallet, dsb.).
          </p>
          {error && (
            <p className="mb-4 text-sm text-red-600">
              {error}{" "}
              {error.includes("telepon") && (
                <Link href="/akun" className="font-medium underline">
                  Lengkapi di Akun Saya →
                </Link>
              )}
            </p>
          )}
          <button
            onClick={handleBayar}
            disabled={redirecting}
            className="w-full rounded-xl bg-primary px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {redirecting ? "Mengarahkan ke Mayar..." : `Bayar ${formatRupiah(order.amount)}`}
          </button>
          <button
            onClick={loadOrder}
            className="mt-3 w-full text-center text-sm font-medium text-text-secondary hover:underline"
          >
            Sudah bayar? Cek status terbaru
          </button>
        </section>
      )}

      {order.paymentStatus === "Sukses" && order.productType === "Traktir_Platform" && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
          <p className="mb-1 text-lg font-semibold text-text">Terima kasih atas apresiasimu!</p>
          <p className="text-sm text-text-secondary">
            Donasi {formatRupiah(order.amount)} sudah kami terima dan digunakan untuk mendukung
            pengembangan Nemshi.
          </p>
        </div>
      )}

      {order.paymentStatus === "Sukses" && order.productType !== "Traktir_Platform" && (
        <p className="text-sm text-text-secondary">
          Pembayaran berhasil.{" "}
          {order.fundStatus === "Ditahan"
            ? "Iklanmu berstatus Menunggu Moderasi — dana ditahan sampai admin menyetujui."
            : "Lihat riwayat transaksi dan akunmu untuk detail lebih lanjut."}{" "}
          <Link href="/akun/transaksi" className="font-medium text-primary hover:underline">
            Lihat Riwayat Transaksi →
          </Link>
        </p>
      )}

      {order.paymentStatus === "Gagal" && (
        <p className="text-sm text-red-600">
          Pembayaran gagal. Silakan coba lagi dengan membuat pesanan baru dari halaman{" "}
          <Link href="/bayar" className="font-medium underline">
            Beli Produk Promosi
          </Link>
          .
        </p>
      )}
    </main>
  );
}
