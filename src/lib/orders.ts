import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { listings, orders, userQuotas } from "@/db/schema";
import { type OrderProductType, PRODUCT_PRICES, requiresModeration } from "@/lib/pricing";

const DAY_MS = 24 * 60 * 60 * 1000;

export async function createOrder(
  userId: string,
  productType: OrderProductType,
  listingId?: string
) {
  const [order] = await db
    .insert(orders)
    .values({
      userId,
      listingId: listingId ?? null,
      productType,
      amount: PRODUCT_PRICES[productType],
    })
    .returning();

  return order;
}

export async function getOrderById(orderId: string) {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return order ?? null;
}

export async function getUserOrders(userId: string) {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

/**
 * Memproses pembayaran pesanan. Belum terhubung ke gateway asli
 * (Midtrans/Xendit) — mensimulasikan hasil sukses/gagal untuk keperluan
 * pengembangan sampai kredensial gateway tersedia.
 */
export async function payOrder(
  orderId: string,
  paymentMethod: string,
  simulateFailure = false
) {
  const order = await getOrderById(orderId);
  if (!order) throw new Error("Pesanan tidak ditemukan.");
  if (order.paymentStatus !== "Menunggu_Pembayaran") {
    throw new Error("Pesanan ini sudah diproses sebelumnya.");
  }

  if (simulateFailure) {
    const [updated] = await db
      .update(orders)
      .set({ paymentStatus: "Gagal", paymentMethod })
      .where(eq(orders.id, orderId))
      .returning();
    return updated;
  }

  const productType = order.productType as OrderProductType;
  const fundStatus = requiresModeration(productType) ? "Ditahan" : "Dirilis";

  const [updated] = await db
    .update(orders)
    .set({
      paymentStatus: "Sukses",
      paymentMethod,
      fundStatus,
      paidAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning();

  if (productType === "Paket_Plus") {
    const validityEnd = new Date(Date.now() + 90 * DAY_MS);
    await db.insert(userQuotas).values([
      { userId: order.userId, quotaType: "Listing_Slot", remainingAmount: 3, validityEnd },
      { userId: order.userId, quotaType: "Priority_Slot", remainingAmount: 2, validityEnd },
    ]);
  }

  if (requiresModeration(productType) && order.listingId) {
    await db
      .update(listings)
      .set({ status: "Pending_Moderation" })
      .where(eq(listings.id, order.listingId));
  }

  return updated;
}

/**
 * Dipakai oleh antrean moderasi admin (fitur 08) untuk menyetujui iklan:
 * mengaktifkan iklan dan merilis dana yang ditahan.
 */
export async function approveListingOrder(listingId: string) {
  const [listing] = await db.select().from(listings).where(eq(listings.id, listingId)).limit(1);
  if (!listing) throw new Error("Iklan tidak ditemukan.");

  const publishedAt = new Date();
  const durationMs = listing.type === "Needs_Service" ? 3 * DAY_MS : 30 * DAY_MS;
  const expiresAt = new Date(publishedAt.getTime() + durationMs);

  const [updatedListing] = await db
    .update(listings)
    .set({
      status: "Active",
      publishedAt,
      expiresAt,
      isPriority: listing.type === "Needs_Service" ? true : listing.isPriority,
    })
    .where(eq(listings.id, listingId))
    .returning();

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.listingId, listingId))
    .orderBy(desc(orders.createdAt))
    .limit(1);

  if (order) {
    await db.update(orders).set({ fundStatus: "Dirilis" }).where(eq(orders.id, order.id));
  }

  return updatedListing;
}

/**
 * Dipakai oleh antrean moderasi admin (fitur 08) untuk menolak iklan:
 * menandai iklan ditolak dan mengembalikan dana yang ditahan (refund).
 */
export async function rejectListingOrder(listingId: string) {
  const [updatedListing] = await db
    .update(listings)
    .set({ status: "Rejected" })
    .where(eq(listings.id, listingId))
    .returning();

  if (!updatedListing) throw new Error("Iklan tidak ditemukan.");

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.listingId, listingId))
    .orderBy(desc(orders.createdAt))
    .limit(1);

  if (order) {
    await db.update(orders).set({ fundStatus: "Dikembalikan" }).where(eq(orders.id, order.id));
  }

  return updatedListing;
}
