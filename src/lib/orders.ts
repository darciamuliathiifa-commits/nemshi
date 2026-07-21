import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { listings, orders, userQuotas, users } from "@/db/schema";
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
  // Iklan Tawarkan Jasa: 30 hari. Cari Jasa: 3 hari jika Prioritas (berbayar),
  // 24 jam jika Gratis — isPriority sudah ditentukan pengguna saat membuat
  // sayembara, bukan di sini.
  const durationMs =
    listing.type === "Offers_Service" ? 30 * DAY_MS : listing.isPriority ? 3 * DAY_MS : DAY_MS;
  const expiresAt = new Date(publishedAt.getTime() + durationMs);

  const [updatedListing] = await db
    .update(listings)
    .set({ status: "Active", publishedAt, expiresAt })
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
 * Dipakai oleh antrean moderasi admin (fitur 08) untuk menolak iklan.
 * Dana yang sudah ditahan TIDAK langsung dikembalikan di sini — tetap
 * berstatus "Ditahan" sampai admin mengonfirmasi refund secara manual
 * lewat confirmRefund() di halaman Kategori & Refund.
 */
export async function rejectListingOrder(listingId: string, reason?: string) {
  const [updatedListing] = await db
    .update(listings)
    .set({ status: "Rejected", moderationReason: reason ?? null })
    .where(eq(listings.id, listingId))
    .returning();

  if (!updatedListing) throw new Error("Iklan tidak ditemukan.");

  return updatedListing;
}

/** Order yang menunggu konfirmasi refund: iklan ditolak, dana masih ditahan. */
export async function getPendingRefunds() {
  const rows = await db
    .select({
      orderId: orders.id,
      amount: orders.amount,
      paidAt: orders.paidAt,
      listingId: listings.id,
      listingTitle: listings.title,
      moderationReason: listings.moderationReason,
      userFullName: users.fullName,
    })
    .from(orders)
    .innerJoin(listings, eq(orders.listingId, listings.id))
    .innerJoin(users, eq(orders.userId, users.id))
    .where(and(eq(orders.fundStatus, "Ditahan"), eq(listings.status, "Rejected")));

  return rows;
}

export async function confirmRefund(orderId: string) {
  const [updated] = await db
    .update(orders)
    .set({ fundStatus: "Dikembalikan" })
    .where(and(eq(orders.id, orderId), eq(orders.fundStatus, "Ditahan")))
    .returning();

  if (!updated) throw new Error("Order tidak ditemukan atau sudah diproses.");

  return updated;
}
