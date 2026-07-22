import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { areas, categories, listingPhotos, listings, savedListings, users } from "@/db/schema";
import { isCurrentlyLive, type ListingSummary } from "@/lib/listings";

export async function isListingSaved(userId: string, listingId: string): Promise<boolean> {
  const [row] = await db
    .select({ id: savedListings.id })
    .from(savedListings)
    .where(and(eq(savedListings.userId, userId), eq(savedListings.listingId, listingId)))
    .limit(1);

  return !!row;
}

export async function getSavedListingIds(userId: string): Promise<string[]> {
  const rows = await db
    .select({ listingId: savedListings.listingId })
    .from(savedListings)
    .where(eq(savedListings.userId, userId));

  return rows.map((row) => row.listingId);
}

/** Idempoten — aman dipanggil ulang untuk listing yang sudah tersimpan. */
export async function saveListing(userId: string, listingId: string) {
  await db.insert(savedListings).values({ userId, listingId }).onConflictDoNothing();
}

export async function unsaveListing(userId: string, listingId: string) {
  await db
    .delete(savedListings)
    .where(and(eq(savedListings.userId, userId), eq(savedListings.listingId, listingId)));
}

/**
 * Iklan yang ditandai pengguna, terurut dari yang terbaru disimpan.
 * Hanya menampilkan yang masih benar-benar tayang — iklan yang sudah
 * kedaluwarsa/ditangguhkan cukup hilang dari daftar tanpa perlu
 * ditampilkan sebagai "kedaluwarsa" di sini.
 */
export async function getSavedListings(userId: string): Promise<ListingSummary[]> {
  const savedRows = await db
    .select({ listingId: savedListings.listingId, savedAt: savedListings.createdAt })
    .from(savedListings)
    .where(eq(savedListings.userId, userId))
    .orderBy(desc(savedListings.createdAt));

  if (savedRows.length === 0) return [];

  const savedOrder = new Map(savedRows.map((row, index) => [row.listingId, index]));
  const listingIds = savedRows.map((row) => row.listingId);

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
    .where(and(inArray(listings.id, listingIds), isCurrentlyLive));

  const coverPhotos = await db
    .select({ listingId: listingPhotos.listingId, url: listingPhotos.url })
    .from(listingPhotos)
    .where(and(inArray(listingPhotos.listingId, listingIds), eq(listingPhotos.sortOrder, 0)));
  const coverByListingId = new Map(coverPhotos.map((p) => [p.listingId, p.url]));

  return rows
    .sort((a, b) => (savedOrder.get(a.id) ?? 0) - (savedOrder.get(b.id) ?? 0))
    .map((row) => ({
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
