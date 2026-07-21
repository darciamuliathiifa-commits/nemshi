import { and, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { listings, orders, users } from "@/db/schema";

export type AdminOrderFilters = {
  productType?: string;
  paymentStatus?: string;
  from?: string;
  to?: string;
};

export async function getAllOrdersForAdmin(filters: AdminOrderFilters = {}) {
  const conditions = [];
  if (filters.productType) {
    conditions.push(eq(orders.productType, filters.productType as never));
  }
  if (filters.paymentStatus) {
    conditions.push(eq(orders.paymentStatus, filters.paymentStatus as never));
  }
  if (filters.from) {
    conditions.push(gte(orders.createdAt, new Date(filters.from)));
  }
  if (filters.to) {
    conditions.push(lte(orders.createdAt, new Date(filters.to)));
  }

  return db
    .select({
      id: orders.id,
      productType: orders.productType,
      amount: orders.amount,
      paymentStatus: orders.paymentStatus,
      fundStatus: orders.fundStatus,
      createdAt: orders.createdAt,
      userFullName: users.fullName,
      listingTitle: listings.title,
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id))
    .leftJoin(listings, eq(orders.listingId, listings.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(orders.createdAt));
}
