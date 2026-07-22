import { and, desc, eq, or } from "drizzle-orm";
import { db } from "@/db";
import { listings, orders, userQuotas, users } from "@/db/schema";
import { PRODUCT_LABELS, type OrderProductType, PRODUCT_PRICES, requiresModeration } from "@/lib/pricing";
import { refundQuota } from "@/lib/quotas";
import {
  createMayarInvoice,
  getMayarWebhookHistory,
  type MayarPaymentReceivedPayload,
} from "@/lib/mayar";

const DAY_MS = 24 * 60 * 60 * 1000;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

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
 * Menandai order sukses dibayar dan menerapkan efek bisnisnya (penahanan
 * dana untuk produk bermoderasi, pemberian kuota Paket Plus, iklan masuk
 * antrean moderasi). Idempoten — aman dipanggil ulang (mis. oleh retry
 * webhook gateway) karena hanya bekerja saat order masih Menunggu_Pembayaran.
 */
async function markOrderPaidByGateway(orderId: string, paymentMethod: string) {
  const order = await getOrderById(orderId);
  if (!order) throw new Error("Pesanan tidak ditemukan.");
  if (order.paymentStatus !== "Menunggu_Pembayaran") {
    return order;
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
 * Membuat invoice di Mayar untuk sebuah order dan mengembalikan link
 * checkout untuk diarahkan (redirect) penggunanya. Menyimpan referensi
 * invoice/transaction Mayar di order agar bisa dicocokkan lagi saat
 * webhook payment.received masuk — lihat verifyAndMarkMayarPayment().
 */
export async function initiateMayarPayment(orderId: string, userId: string): Promise<string> {
  const order = await getOrderById(orderId);
  if (!order) throw new Error("Pesanan tidak ditemukan.");
  if (order.userId !== userId) throw new Error("Pesanan ini bukan milik Anda.");
  if (order.paymentStatus !== "Menunggu_Pembayaran") {
    throw new Error("Pesanan ini sudah diproses sebelumnya.");
  }

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) throw new Error("Pengguna tidak ditemukan.");
  if (!user.phoneNumber) {
    throw new Error(
      "Nomor telepon belum diisi. Lengkapi dulu di Akun Saya sebelum melanjutkan pembayaran."
    );
  }

  const productType = order.productType as OrderProductType;
  const productLabel = PRODUCT_LABELS[productType];

  const invoice = await createMayarInvoice({
    name: user.fullName,
    email: user.email,
    mobile: user.phoneNumber,
    redirectUrl: `${APP_URL}/bayar/${order.id}`,
    description: productLabel,
    expiredAt: new Date(Date.now() + DAY_MS).toISOString(),
    items: [{ quantity: 1, rate: order.amount, description: productLabel }],
    extraData: { noCustomer: userId, idProd: order.id },
  });

  await db
    .update(orders)
    .set({ mayarInvoiceId: invoice.id, mayarTransactionId: invoice.transactionId })
    .where(eq(orders.id, order.id));

  return invoice.link;
}

/**
 * Verifikasi keaslian notifikasi payment.received dari webhook Mayar
 * dengan memanggil balik endpoint Get History milik Mayar memakai API
 * key rahasia kita. Mayar tidak mendokumentasikan skema signature untuk
 * webhook, jadi ini dipakai sebagai penggantinya: penyerang yang mengirim
 * POST palsu ke endpoint kita tidak akan pernah muncul di riwayat webhook
 * resmi akun kita, sehingga pencocokan ini gagal dan order tidak ditandai
 * lunas.
 */
export async function verifyAndMarkMayarPayment(payload: MayarPaymentReceivedPayload) {
  const eventId = payload?.data?.id;
  if (!eventId) {
    throw new Error("Payload webhook tidak valid: data.id tidak ada.");
  }

  const history = await getMayarWebhookHistory({
    type: "payment.received",
    status: "SUCCESS",
    limit: 50,
  });

  const matchedDelivery = history.find((entry) => {
    if (entry.type !== "payment.received") return false;
    try {
      const deliveredPayload = JSON.parse(entry.payload) as MayarPaymentReceivedPayload;
      return deliveredPayload?.data?.id === eventId;
    } catch {
      return false;
    }
  });

  if (!matchedDelivery) {
    throw new Error("Notifikasi webhook tidak ditemukan di riwayat resmi Mayar — diabaikan.");
  }

  // Cocokkan ke order kita lewat transactionId (paling dapat diandalkan),
  // dengan invoiceId sebagai fallback — bentuk pasti field `data.id` pada
  // payload webhook belum terkonfirmasi lewat pengujian sandbox nyata.
  const [order] = await db
    .select()
    .from(orders)
    .where(
      or(
        eq(orders.mayarTransactionId, matchedDelivery.paymentLinkTransactionId),
        eq(orders.mayarTransactionId, eventId),
        eq(orders.mayarInvoiceId, eventId)
      )
    )
    .limit(1);

  if (!order) {
    throw new Error(`Tidak ada order yang cocok dengan transaksi Mayar ${eventId}.`);
  }

  return markOrderPaidByGateway(order.id, "Mayar");
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
 * lewat confirmRefund() di halaman Kategori & Refund. Untuk iklan yang
 * dibayar pakai kuota Paket Plus, kuotanya dikembalikan otomatis di sini
 * karena tidak melibatkan uang yang perlu dikonfirmasi terpisah.
 */
export async function rejectListingOrder(listingId: string, reason?: string) {
  const [updatedListing] = await db
    .update(listings)
    .set({ status: "Rejected", moderationReason: reason ?? null })
    .where(eq(listings.id, listingId))
    .returning();

  if (!updatedListing) throw new Error("Iklan tidak ditemukan.");

  if (updatedListing.paidWithQuota) {
    const quotaType = updatedListing.type === "Offers_Service" ? "Listing_Slot" : "Priority_Slot";
    await refundQuota(updatedListing.userId, quotaType);
  }

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
