"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

const PAYMENT_METHODS = ["QRIS", "Virtual Account BCA", "Virtual Account Mandiri"];

export default function RingkasanPesananPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [method, setMethod] = useState(PAYMENT_METHODS[0]);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then(setOrder);
  }, [orderId]);

  async function handleBayar() {
    setPaying(true);
    const response = await fetch(`/api/orders/${orderId}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentMethod: method, simulateFailure }),
    });
    const updated = await response.json();
    setOrder(updated);
    setPaying(false);
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
          <h2 className="mb-3 font-semibold text-text">Pilih Metode Bayar</h2>
          <div className="mb-4 flex flex-col gap-2">
            {PAYMENT_METHODS.map((paymentMethod) => (
              <label
                key={paymentMethod}
                className="flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2 text-sm"
              >
                <input
                  type="radio"
                  name="method"
                  checked={method === paymentMethod}
                  onChange={() => setMethod(paymentMethod)}
                />
                {paymentMethod}
              </label>
            ))}
          </div>
          <label className="mb-4 flex items-center gap-2 text-xs text-text-secondary">
            <input
              type="checkbox"
              checked={simulateFailure}
              onChange={(e) => setSimulateFailure(e.target.checked)}
            />
            Simulasikan pembayaran gagal (mode uji coba — belum terhubung gateway asli)
          </label>
          <button
            onClick={handleBayar}
            disabled={paying}
            className="w-full rounded-xl bg-primary px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {paying ? "Memproses Pembayaran..." : `Bayar ${formatRupiah(order.amount)}`}
          </button>
        </section>
      )}

      {order.paymentStatus === "Sukses" && (
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
