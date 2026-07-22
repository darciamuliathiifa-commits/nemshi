import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Skema database Nemshi — sesuai PRD.md bagian 6 "Database Schema".
 * Platform murni direktori iklan: tidak ada tabel pemesanan (booking)
 * atau obrolan (chat) in-app.
 */

// USERS.verification_status
export const verificationStatusEnum = pgEnum("verification_status", [
  "Unverified",
  "Identity_Verified",
  "Skill_Verified",
]);

// USERS.role — dipilih saat daftar akun, informasional (tidak membatasi
// fitur; siapa pun tetap bisa memasang iklan maupun membuat permintaan jasa).
export const userRoleEnum = pgEnum("user_role", ["Pelanggan", "Penyedia_Jasa"]);

// LISTINGS.status
export const listingStatusEnum = pgEnum("listing_status", [
  "Pending_Moderation",
  "Active",
  "Expired",
  "Rejected",
  "Suspended",
]);

// LISTINGS.type
export const listingTypeEnum = pgEnum("listing_type", [
  "Offers_Service",
  "Needs_Service",
]);

// USER_QUOTAS.quota_type
export const quotaTypeEnum = pgEnum("quota_type", [
  "Listing_Slot",
  "Priority_Slot",
]);

// LISTINGS.price_type
export const priceTypeEnum = pgEnum("price_type", ["Range", "Contact"]);

// ORDERS.product_type — produk promosi berbayar, sesuai model bisnis PRD
// (biaya publikasi tetap, bukan komisi transaksi antar pengguna).
export const orderProductTypeEnum = pgEnum("order_product_type", [
  "Iklan_Tawarkan_Jasa",
  "Cari_Jasa_Prioritas",
  "Paket_Plus",
  "Traktir_Platform",
]);

// ORDERS.payment_status
export const paymentStatusEnum = pgEnum("payment_status", [
  "Menunggu_Pembayaran",
  "Sukses",
  "Gagal",
]);

// ORDERS.fund_status — status penahanan dana untuk produk yang memerlukan moderasi
export const fundStatusEnum = pgEnum("fund_status", [
  "Ditahan",
  "Dirilis",
  "Dikembalikan",
]);

// REPORTS.reason
export const reportReasonEnum = pgEnum("report_reason", [
  "Penipuan",
  "Informasi_Palsu",
  "Spam",
  "Konten_Tidak_Pantas",
  "Lainnya",
]);

// REPORTS.status
export const reportStatusEnum = pgEnum("report_status", [
  "Belum_Ditinjau",
  "Ditinjau",
]);

// Kontak darurat pengguna — hanya untuk verifikasi identitas dan
// keperluan keamanan oleh admin, tidak pernah ditampilkan ke publik.
export const emergencyContacts = pgTable("emergency_contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  whatsappLink: text("whatsapp_link"),
  // Wajib diisi sebelum checkout — dipakai sebagai field "mobile" saat
  // membuat invoice di payment gateway (Mayar).
  phoneNumber: text("phone_number"),
  role: userRoleEnum("role").notNull().default("Pelanggan"),
  verificationStatus: verificationStatusEnum("verification_status")
    .notNull()
    .default("Unverified"),
  isAdmin: boolean("is_admin").notNull().default(false),
  // Penangguhan permanen akibat pelanggaran berat (lihat fitur Keamanan
  // Komunitas) — akun tidak bisa memasang iklan/permintaan baru lagi.
  isSuspended: boolean("is_suspended").notNull().default(false),
  suspendedReason: text("suspended_reason"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const areas = pgTable("areas", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const listings = pgTable("listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),
  areaId: uuid("area_id")
    .notNull()
    .references(() => areas.id, { onDelete: "restrict" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  whatsappLink: text("whatsapp_link").notNull(),
  priceType: priceTypeEnum("price_type").notNull().default("Contact"),
  // dalam EGP, hanya relevan ketika priceType = 'Range'
  priceMin: integer("price_min"),
  priceMax: integer("price_max"),
  status: listingStatusEnum("status").notNull().default("Pending_Moderation"),
  type: listingTypeEnum("type").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  // Tawarkan Jasa: 30 hari / Cari Jasa Prioritas: 3 hari / Cari Jasa Gratis: 24 jam
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  isPriority: boolean("is_priority").notNull().default(false),
  // alasan admin menolak (moderasi) atau menangguhkan (pelanggaran) iklan ini
  moderationReason: text("moderation_reason"),
  // true jika dibayar pakai 1 kuota Listing_Slot dari Paket Plus, bukan Rp50.000
  paidWithQuota: boolean("paid_with_quota").notNull().default(false),
});

export const listingPhotos = pgTable("listing_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  listingId: uuid("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  // urutan tampil, 0-4 (maksimal 5 foto portofolio per iklan)
  sortOrder: integer("sort_order").notNull().default(0),
});

export const userQuotas = pgTable("user_quotas", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  quotaType: quotaTypeEnum("quota_type").notNull(),
  remainingAmount: integer("remaining_amount").notNull().default(0),
  // 90 hari dari pembelian Paket Plus
  validityEnd: timestamp("validity_end", { withTimezone: true }).notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  revieweeUserId: uuid("reviewee_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reviewerName: text("reviewer_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  // disembunyikan dari profil publik oleh admin, tanpa menghapus datanya
  isHidden: boolean("is_hidden").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Iklan yang ditandai pengguna untuk dilihat lagi nanti — murni penanda
// pribadi, tidak terlihat oleh siapa pun selain pemiliknya.
export const savedListings = pgTable(
  "saved_listings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [unique().on(table.userId, table.listingId)]
);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  listingId: uuid("listing_id").references(() => listings.id, { onDelete: "set null" }),
  productType: orderProductTypeEnum("product_type").notNull(),
  // dalam Rupiah (biaya publikasi/paket), terpisah dari harga jasa dalam EGP
  amount: integer("amount").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("Menunggu_Pembayaran"),
  paymentMethod: text("payment_method"),
  // null selama menunggu pembayaran; terisi begitu pembayaran sukses
  fundStatus: fundStatusEnum("fund_status"),
  // Referensi ke invoice Mayar (payment gateway) — dipakai untuk
  // mencocokkan notifikasi webhook payment.received ke order ini.
  mayarInvoiceId: text("mayar_invoice_id"),
  mayarTransactionId: text("mayar_transaction_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
});

export const adminActivityLogs = pgTable("admin_activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminUserId: uuid("admin_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const clickAnalytics = pgTable("click_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  listingId: uuid("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  clickedAt: timestamp("clicked_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  userAgent: text("user_agent"),
});

// Tayangan (impressions) — dicatat setiap kali halaman detail iklan dibuka.
export const listingImpressions = pgTable("listing_impressions", {
  id: uuid("id").primaryKey().defaultRandom(),
  listingId: uuid("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  viewedAt: timestamp("viewed_at", { withTimezone: true }).notNull().defaultNow(),
});

// Laporan pengguna atas iklan yang mencurigakan/tidak pantas.
export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  listingId: uuid("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  reporterUserId: uuid("reporter_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reason: reportReasonEnum("reason").notNull(),
  description: text("description"),
  status: reportStatusEnum("status").notNull().default("Belum_Ditinjau"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
});

export const usersRelations = relations(users, ({ many }) => ({
  listings: many(listings),
  quotas: many(userQuotas),
  testimonials: many(testimonials),
  orders: many(orders),
  adminActivityLogs: many(adminActivityLogs),
  reports: many(reports),
  emergencyContacts: many(emergencyContacts),
  savedListings: many(savedListings),
}));

export const savedListingsRelations = relations(savedListings, ({ one }) => ({
  user: one(users, {
    fields: [savedListings.userId],
    references: [users.id],
  }),
  listing: one(listings, {
    fields: [savedListings.listingId],
    references: [listings.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  listing: one(listings, {
    fields: [reports.listingId],
    references: [listings.id],
  }),
  reporter: one(users, {
    fields: [reports.reporterUserId],
    references: [users.id],
  }),
}));

export const emergencyContactsRelations = relations(emergencyContacts, ({ one }) => ({
  user: one(users, {
    fields: [emergencyContacts.userId],
    references: [users.id],
  }),
}));

export const adminActivityLogsRelations = relations(adminActivityLogs, ({ one }) => ({
  adminUser: one(users, {
    fields: [adminActivityLogs.adminUserId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  listing: one(listings, {
    fields: [orders.listingId],
    references: [listings.id],
  }),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  reviewee: one(users, {
    fields: [testimonials.revieweeUserId],
    references: [users.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  listings: many(listings),
}));

export const areasRelations = relations(areas, ({ many }) => ({
  listings: many(listings),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  user: one(users, {
    fields: [listings.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [listings.categoryId],
    references: [categories.id],
  }),
  area: one(areas, {
    fields: [listings.areaId],
    references: [areas.id],
  }),
  photos: many(listingPhotos),
  clicks: many(clickAnalytics),
  impressions: many(listingImpressions),
  orders: many(orders),
  reports: many(reports),
}));

export const listingPhotosRelations = relations(listingPhotos, ({ one }) => ({
  listing: one(listings, {
    fields: [listingPhotos.listingId],
    references: [listings.id],
  }),
}));

export const userQuotasRelations = relations(userQuotas, ({ one }) => ({
  user: one(users, {
    fields: [userQuotas.userId],
    references: [users.id],
  }),
}));

export const clickAnalyticsRelations = relations(clickAnalytics, ({ one }) => ({
  listing: one(listings, {
    fields: [clickAnalytics.listingId],
    references: [listings.id],
  }),
}));

export const listingImpressionsRelations = relations(listingImpressions, ({ one }) => ({
  listing: one(listings, {
    fields: [listingImpressions.listingId],
    references: [listings.id],
  }),
}));
