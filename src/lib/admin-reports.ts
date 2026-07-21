import { and, count, eq, sql, sum } from "drizzle-orm";
import { db } from "@/db";
import { categories, clickAnalytics, listings, orders } from "@/db/schema";

export async function getTotalRevenue(): Promise<number> {
  const [row] = await db
    .select({ total: sum(orders.amount) })
    .from(orders)
    .where(eq(orders.paymentStatus, "Sukses"));

  return Number(row?.total ?? 0);
}

export async function getTraktirTotal(): Promise<number> {
  const [row] = await db
    .select({ total: sum(orders.amount) })
    .from(orders)
    .where(and(eq(orders.productType, "Traktir_Platform"), eq(orders.paymentStatus, "Sukses")));

  return Number(row?.total ?? 0);
}

export async function getAvgClicksPerCategory() {
  const listingCounts = await db
    .select({
      categoryId: listings.categoryId,
      categoryName: categories.name,
      listingCount: count(listings.id),
    })
    .from(listings)
    .innerJoin(categories, eq(listings.categoryId, categories.id))
    .groupBy(listings.categoryId, categories.name);

  const clickCounts = await db
    .select({ categoryId: listings.categoryId, clickCount: count(clickAnalytics.id) })
    .from(clickAnalytics)
    .innerJoin(listings, eq(clickAnalytics.listingId, listings.id))
    .groupBy(listings.categoryId);

  const clickMap = new Map(clickCounts.map((c) => [c.categoryId, c.clickCount]));

  return listingCounts.map((lc) => ({
    categoryName: lc.categoryName,
    averageClicks:
      lc.listingCount > 0 ? (clickMap.get(lc.categoryId) ?? 0) / lc.listingCount : 0,
  }));
}

/**
 * Proksi Rasio Perpanjangan Iklan: belum ada penautan "perpanjangan" yang
 * eksplisit di skema (akan datang bersama fitur 10 - Pasang Iklan Tawarkan
 * Jasa), jadi dihitung dari persentase pengguna yang membeli lebih dari
 * satu Iklan Tawarkan Jasa sebagai indikator pembelian berulang.
 */
export async function getRenewalRatio(): Promise<number> {
  const rows = await db
    .select({ userId: orders.userId, purchaseCount: count(orders.id) })
    .from(orders)
    .where(and(eq(orders.productType, "Iklan_Tawarkan_Jasa"), eq(orders.paymentStatus, "Sukses")))
    .groupBy(orders.userId);

  if (rows.length === 0) return 0;
  const repeatBuyers = rows.filter((r) => r.purchaseCount > 1).length;
  return (repeatBuyers / rows.length) * 100;
}

export async function getMonthlyRevenue(monthsBack = 3) {
  const monthExpr = sql<string>`to_char(${orders.createdAt}, 'YYYY-MM')`;

  const rows = await db
    .select({ month: monthExpr, total: sum(orders.amount) })
    .from(orders)
    .where(eq(orders.paymentStatus, "Sukses"))
    .groupBy(monthExpr)
    .orderBy(monthExpr);

  return rows.slice(-monthsBack).map((row) => ({ month: row.month, total: Number(row.total) }));
}
