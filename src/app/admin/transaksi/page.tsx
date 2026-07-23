"use client";

import { Fragment, useEffect, useState } from "react";
import { PaymentStatusBadge, FundStatusBadge } from "@/components/order-status-badges";
import { PRODUCT_LABELS, type OrderProductType } from "@/lib/pricing";
import { formatRupiah } from "@/lib/format";

type AdminOrder = {
  id: string;
  productType: OrderProductType;
  amount: number;
  paymentStatus: string;
  fundStatus: string | null;
  createdAt: string;
  userFullName: string;
  listingTitle: string | null;
};

export default function PantauTransaksiPage() {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [productType, setProductType] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (productType) params.set("productType", productType);
    if (paymentStatus) params.set("paymentStatus", paymentStatus);
    fetch(`/api/admin/orders?${params.toString()}`)
      .then((r) => r.json())
      .then(setOrders);
  }, [productType, paymentStatus]);

  return (
    <div className="rounded-3xl bg-white p-6 border border-black/10 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-text">Pantau Transaksi</h1>
        <a
          href="/api/admin/reports/export"
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface"
        >
          Unduh CSV
        </a>
      </div>

      <div className="mb-4 flex gap-3">
        <select
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
        >
          <option value="">Semua Tipe</option>
          {Object.entries(PRODUCT_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
        >
          <option value="">Semua Status</option>
          <option value="Menunggu_Pembayaran">Menunggu Pembayaran</option>
          <option value="Sukses">Sukses</option>
          <option value="Gagal">Gagal</option>
        </select>
      </div>

      {!orders ? (
        <p className="text-text-secondary">Memuat...</p>
      ) : (
        <div className="overflow-x-auto bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 text-text-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Pengguna</th>
                <th className="px-4 py-3 font-medium">Tipe</th>
                <th className="px-4 py-3 font-medium">Jumlah</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <Fragment key={order.id}>
                  <tr
                    onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                    className="cursor-pointer border-b border-black/10 last:border-0 hover:bg-white"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-text-secondary">
                      {order.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-text">{order.userFullName}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      {PRODUCT_LABELS[order.productType]}
                    </td>
                    <td className="px-4 py-3 font-medium text-primary">
                      {formatRupiah(order.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <PaymentStatusBadge status={order.paymentStatus} />
                        {order.fundStatus && <FundStatusBadge status={order.fundStatus} />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {new Date(order.createdAt).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                  {expandedId === order.id && (
                    <tr className="border-b border-black/10 bg-white">
                      <td colSpan={6} className="px-4 py-3 text-sm text-text-secondary">
                        ID Lengkap: {order.id}
                        {order.listingTitle && <> · Jasa Terkait: {order.listingTitle}</>}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
