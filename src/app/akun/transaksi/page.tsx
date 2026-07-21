import Link from "next/link";
import { requireActiveUser } from "@/lib/current-user";
import { getUserOrders } from "@/lib/orders";
import { PRODUCT_LABELS, type OrderProductType } from "@/lib/pricing";
import { formatRupiah } from "@/lib/format";
import { PaymentStatusBadge, FundStatusBadge } from "@/components/order-status-badges";

export const dynamic = "force-dynamic";

export default async function RiwayatTransaksiPage() {
  const userId = await requireActiveUser("/akun/transaksi");

  const ordersList = await getUserOrders(userId);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/akun" className="mb-6 inline-block text-sm font-medium text-primary hover:underline">
        ← Kembali ke Akun Saya
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-text">Riwayat Transaksi</h1>

      {ordersList.length === 0 ? (
        <p className="text-text-secondary">
          Belum ada transaksi.{" "}
          <Link href="/bayar" className="font-medium text-primary hover:underline">
            Beli produk promosi →
          </Link>
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {ordersList.map((order) => (
            <li key={order.id} className="rounded-xl border border-black/5 bg-white p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-text">
                  {PRODUCT_LABELS[order.productType as OrderProductType]}
                </span>
                <span className="text-sm text-text-secondary">
                  {new Date(order.createdAt).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-primary">{formatRupiah(order.amount)}</span>
                <div className="flex gap-2">
                  <PaymentStatusBadge status={order.paymentStatus} />
                  {order.fundStatus && <FundStatusBadge status={order.fundStatus} />}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
