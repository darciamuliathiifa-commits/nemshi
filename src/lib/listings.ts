import { and, desc, eq, gt, gte, ilike, inArray, isNull, lt, or } from "drizzle-orm";
import { db } from "@/db";
import { areas, categories, listingPhotos, listings, users } from "@/db/schema";

export type ListingSummary = {
  id: string;
  title: string;
  priceType: "Range" | "Contact";
  priceMin: number | null;
  priceMax: number | null;
  isPriority: boolean;
  coverPhotoUrl: string | null;
  category: { id: string; name: string; slug: string };
  area: { id: string; name: string; slug: string };
  provider: { id: string; fullName: string; verificationStatus: string; avatarUrl: string | null };
};

export type OwnListingCard = ListingSummary & {
  status: string;
  moderationReason: string | null;
  isExpired: boolean;
  expiresAt: Date | null;
};

export type ListingDetail = ListingSummary & {
  description: string;
  whatsappLink: string;
  photos: string[];
};

type ListingFilters = {
  q?: string;
  categorySlug?: string;
  areaSlug?: string;
  type?: "Offers_Service" | "Needs_Service";
};

// Iklan dianggap benar-benar tayang hanya jika status Active DAN belum
// lewat masa tayangnya — sweep berkala (expireOldListings) menjaga kolom
// status tetap akurat, tapi query publik tidak bergantung padanya.
export const isCurrentlyLive = and(
  eq(listings.status, "Active"),
  or(isNull(listings.expiresAt), gt(listings.expiresAt, new Date()))
);

async function getCoverPhotosByListingId(listingIds: string[]): Promise<Map<string, string>> {
  if (listingIds.length === 0) return new Map();

  const coverPhotos = await db
    .select({ listingId: listingPhotos.listingId, url: listingPhotos.url })
    .from(listingPhotos)
    .where(and(inArray(listingPhotos.listingId, listingIds), eq(listingPhotos.sortOrder, 0)));

  return new Map(coverPhotos.map((p) => [p.listingId, p.url]));
}

export async function getActiveListings(
  filters: ListingFilters = {}
): Promise<ListingSummary[]> {
  const conditions = [isCurrentlyLive];

  if (filters.q) {
    const keyword = `%${filters.q}%`;
    conditions.push(
      or(ilike(listings.title, keyword), ilike(listings.description, keyword))!
    );
  }
  if (filters.categorySlug) {
    conditions.push(eq(categories.slug, filters.categorySlug));
  }
  if (filters.areaSlug) {
    conditions.push(eq(areas.slug, filters.areaSlug));
  }
  if (filters.type) {
    conditions.push(eq(listings.type, filters.type));
  }

  const rows = await db
    .select({
      id: listings.id,
      title: listings.title,
      priceType: listings.priceType,
      priceMin: listings.priceMin,
      priceMax: listings.priceMax,
      isPriority: listings.isPriority,
      categoryId: categories.id,
      categoryName: categories.name,
      categorySlug: categories.slug,
      areaId: areas.id,
      areaName: areas.name,
      areaSlug: areas.slug,
      providerId: users.id,
      providerFullName: users.fullName,
      providerVerificationStatus: users.verificationStatus,
      providerAvatarUrl: users.avatarUrl,
    })
    .from(listings)
    .innerJoin(categories, eq(listings.categoryId, categories.id))
    .innerJoin(areas, eq(listings.areaId, areas.id))
    .innerJoin(users, eq(listings.userId, users.id))
    .where(and(...conditions))
    .orderBy(desc(listings.isPriority), desc(listings.publishedAt));

  const coverByListingId = await getCoverPhotosByListingId(rows.map((row) => row.id));

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    priceType: row.priceType,
    priceMin: row.priceMin,
    priceMax: row.priceMax,
    isPriority: row.isPriority,
    coverPhotoUrl: coverByListingId.get(row.id) ?? null,
    category: { id: row.categoryId, name: row.categoryName, slug: row.categorySlug },
    area: { id: row.areaId, name: row.areaName, slug: row.areaSlug },
    provider: {
      id: row.providerId,
      fullName: row.providerFullName,
      verificationStatus: row.providerVerificationStatus,
      avatarUrl: row.providerAvatarUrl,
    },
  }));
}

export async function getListingById(id: string): Promise<ListingDetail | null> {
  const [row] = await db
    .select({
      id: listings.id,
      title: listings.title,
      description: listings.description,
      whatsappLink: listings.whatsappLink,
      priceType: listings.priceType,
      priceMin: listings.priceMin,
      priceMax: listings.priceMax,
      isPriority: listings.isPriority,
      status: listings.status,
      categoryId: categories.id,
      categoryName: categories.name,
      categorySlug: categories.slug,
      areaId: areas.id,
      areaName: areas.name,
      areaSlug: areas.slug,
      providerId: users.id,
      providerFullName: users.fullName,
      providerVerificationStatus: users.verificationStatus,
      providerAvatarUrl: users.avatarUrl,
    })
    .from(listings)
    .innerJoin(categories, eq(listings.categoryId, categories.id))
    .innerJoin(areas, eq(listings.areaId, areas.id))
    .innerJoin(users, eq(listings.userId, users.id))
    .where(and(eq(listings.id, id), isCurrentlyLive))
    .limit(1);

  if (!row) return null;

  const photos = await db
    .select({ url: listingPhotos.url })
    .from(listingPhotos)
    .where(eq(listingPhotos.listingId, id))
    .orderBy(listingPhotos.sortOrder);

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    whatsappLink: row.whatsappLink,
    priceType: row.priceType,
    priceMin: row.priceMin,
    priceMax: row.priceMax,
    isPriority: row.isPriority,
    coverPhotoUrl: photos[0]?.url ?? null,
    category: { id: row.categoryId, name: row.categoryName, slug: row.categorySlug },
    area: { id: row.areaId, name: row.areaName, slug: row.areaSlug },
    provider: {
      id: row.providerId,
      fullName: row.providerFullName,
      verificationStatus: row.providerVerificationStatus,
      avatarUrl: row.providerAvatarUrl,
    },
    photos: photos.map((p) => p.url),
  };
}

export async function getCategories() {
  return db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(categories.name);
}

export async function getAreas() {
  return db.select().from(areas).orderBy(areas.name);
}

export async function createListing(
  userId: string,
  data: {
    type: "Offers_Service" | "Needs_Service";
    categoryId: string;
    areaId: string;
    title: string;
    description: string;
    whatsappLink: string;
    priceType: "Range" | "Contact";
    priceMin?: number | null;
    priceMax?: number | null;
    isPriority: boolean;
    paidWithQuota?: boolean;
  }
) {
  const [listing] = await db
    .insert(listings)
    .values({ userId, ...data })
    .returning();

  return listing;
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/** Untuk validasi kuota "Cari Jasa Gratis": maksimal 1x per 30 hari. */
export async function countRecentFreeNeedsServiceListings(userId: string) {
  const since = new Date(Date.now() - THIRTY_DAYS_MS);

  const rows = await db
    .select({ id: listings.id })
    .from(listings)
    .where(
      and(
        eq(listings.userId, userId),
        eq(listings.type, "Needs_Service"),
        eq(listings.isPriority, false),
        gte(listings.createdAt, since)
      )
    );

  return rows.length;
}

export async function getUserNeedsServiceListings(userId: string) {
  return db
    .select({
      id: listings.id,
      title: listings.title,
      status: listings.status,
      isPriority: listings.isPriority,
      createdAt: listings.createdAt,
      publishedAt: listings.publishedAt,
      expiresAt: listings.expiresAt,
    })
    .from(listings)
    .where(and(eq(listings.userId, userId), eq(listings.type, "Needs_Service")))
    .orderBy(desc(listings.createdAt));
}

export async function getUserOffersServiceListings(userId: string) {
  return db
    .select({
      id: listings.id,
      title: listings.title,
      status: listings.status,
      moderationReason: listings.moderationReason,
      createdAt: listings.createdAt,
      publishedAt: listings.publishedAt,
      expiresAt: listings.expiresAt,
    })
    .from(listings)
    .where(and(eq(listings.userId, userId), eq(listings.type, "Offers_Service")))
    .orderBy(desc(listings.createdAt));
}

/** Kartu galeri untuk dasbor "Iklan Saya" / "Sayembara Saya" — semua status. */
export async function getOwnListingCards(
  userId: string,
  type: "Offers_Service" | "Needs_Service"
): Promise<OwnListingCard[]> {
  const rows = await db
    .select({
      id: listings.id,
      title: listings.title,
      priceType: listings.priceType,
      priceMin: listings.priceMin,
      priceMax: listings.priceMax,
      isPriority: listings.isPriority,
      status: listings.status,
      moderationReason: listings.moderationReason,
      expiresAt: listings.expiresAt,
      categoryId: categories.id,
      categoryName: categories.name,
      categorySlug: categories.slug,
      areaId: areas.id,
      areaName: areas.name,
      areaSlug: areas.slug,
      providerId: users.id,
      providerFullName: users.fullName,
      providerVerificationStatus: users.verificationStatus,
      providerAvatarUrl: users.avatarUrl,
    })
    .from(listings)
    .innerJoin(categories, eq(listings.categoryId, categories.id))
    .innerJoin(areas, eq(listings.areaId, areas.id))
    .innerJoin(users, eq(listings.userId, users.id))
    .where(and(eq(listings.userId, userId), eq(listings.type, type)))
    .orderBy(desc(listings.createdAt));

  const coverByListingId = await getCoverPhotosByListingId(rows.map((row) => row.id));

  const now = new Date();

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    priceType: row.priceType,
    priceMin: row.priceMin,
    priceMax: row.priceMax,
    isPriority: row.isPriority,
    coverPhotoUrl: coverByListingId.get(row.id) ?? null,
    category: { id: row.categoryId, name: row.categoryName, slug: row.categorySlug },
    area: { id: row.areaId, name: row.areaName, slug: row.areaSlug },
    provider: {
      id: row.providerId,
      fullName: row.providerFullName,
      verificationStatus: row.providerVerificationStatus,
      avatarUrl: row.providerAvatarUrl,
    },
    status: row.status,
    moderationReason: row.moderationReason,
    isExpired: row.status === "Expired" || (row.status === "Active" && !!row.expiresAt && row.expiresAt < now),
    expiresAt: row.expiresAt,
  }));
}

export async function addListingPhotos(listingId: string, urls: string[]) {
  if (urls.length === 0) return;

  await db.insert(listingPhotos).values(
    urls.slice(0, 5).map((url, index) => ({ listingId, url, sortOrder: index }))
  );
}

/** Sweep berkala (lihat /api/cron/expire-listings) agar status di DB akurat. */
export async function expireOldListings() {
  const rows = await db
    .update(listings)
    .set({ status: "Expired" })
    .where(and(eq(listings.status, "Active"), lt(listings.expiresAt, new Date())))
    .returning({ id: listings.id });

  return rows.length;
}
