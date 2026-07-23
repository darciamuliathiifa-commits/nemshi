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
    <div className="bg-surface-tint">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/akun"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-accent"
        >
          ← Kembali ke Akun Saya
        </Link>

        <section className="rounded-3xl bg-white p-6 border border-black/10 sm:p-8">
          <h1 className="mb-6 font-display text-2xl font-semibold text-text">
            Riwayat Transaksi
          </h1>

          {ordersList.length === 0 ? (
            <p className="text-text-secondary">
              Belum ada transaksi.{" "}
              <Link href="/bayar" className="font-medium text-accent hover:underline">
                Beli produk promosi →
              </Link>
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {ordersList.map((order) => (
                <li key={order.id} className="rounded-2xl bg-surface p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-text">
                      {PRODUCT_LABELS[order.productType as OrderProductType]}
                    </span>
                    <span className="text-sm text-text-secondary">
                      {new Date(order.createdAt).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary">
                      {formatRupiah(order.amount)}
                    </span>
                    <div className="flex gap-2">
                      <PaymentStatusBadge status={order.paymentStatus} />
                      {order.fundStatus && <FundStatusBadge status={order.fundStatus} />}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
