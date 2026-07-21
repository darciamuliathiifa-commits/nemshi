import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
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

// LISTINGS.status
export const listingStatusEnum = pgEnum("listing_status", [
  "Pending_Moderation",
  "Active",
  "Expired",
  "Rejected",
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

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  verificationStatus: verificationStatusEnum("verification_status")
    .notNull()
    .default("Unverified"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const listings = pgTable("listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  whatsappLink: text("whatsapp_link").notNull(),
  status: listingStatusEnum("status").notNull().default("Pending_Moderation"),
  type: listingTypeEnum("type").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  // Tawarkan Jasa: 30 hari / Cari Jasa Prioritas: 3 hari / Cari Jasa Gratis: 24 jam
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  isPriority: boolean("is_priority").notNull().default(false),
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

export const usersRelations = relations(users, ({ many }) => ({
  listings: many(listings),
  quotas: many(userQuotas),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  user: one(users, {
    fields: [listings.userId],
    references: [users.id],
  }),
  clicks: many(clickAnalytics),
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
