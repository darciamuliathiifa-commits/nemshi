import { NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/admin";
import { getAllOrdersForAdmin } from "@/lib/admin-orders";

function csvEscape(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET() {
  const adminUserId = await getAdminUserId();
  if (!adminUserId) {
    return NextResponse.json({ error: "Tidak diizinkan" }, { status: 403 });
  }

  const ordersList = await getAllOrdersForAdmin();

  const header = ["ID Transaksi", "Pengguna", "Produk", "Jasa Terkait", "Jumlah", "Status", "Tanggal"];
  const rows = ordersList.map((order) => [
    order.id,
    order.userFullName,
    order.productType,
    order.listingTitle ?? "-",
    String(order.amount),
    order.paymentStatus,
    new Date(order.createdAt).toISOString(),
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=laporan-transaksi-nemshi.csv",
    },
  });
}
