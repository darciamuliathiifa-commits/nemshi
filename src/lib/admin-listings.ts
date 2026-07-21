import { and, desc, eq, ilike } from "drizzle-orm";
import { db } from "@/db";
import { areas, categories, listingPhotos, listings, listingStatusEnum, users } from "@/db/schema";

type ListingStatus = (typeof listingStatusEnum.enumValues)[number];

export async function getAdminListings(filters: { status?: ListingStatus; q?: string } = {}) {
  const conditions = [];
  if (filters.status) conditions.push(eq(listings.status, filters.status));
  if (filters.q) conditions.push(ilike(listings.title, `%${filters.q}%`));

  return db
    .select({
      id: listings.id,
      title: listings.title,
      status: listings.status,
      type: listings.type,
      createdAt: listings.createdAt,
      publishedAt: listings.publishedAt,
      ownerName: users.fullName,
      categoryName: categories.name,
      areaName: areas.name,
    })
    .from(listings)
    .innerJoin(users, eq(listings.userId, users.id))
    .innerJoin(categories, eq(listings.categoryId, categories.id))
    .innerJoin(areas, eq(listings.areaId, areas.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(listings.createdAt));
}

export async function getAdminListingDetail(listingId: string) {
  const [row] = await db
    .select({
      id: listings.id,
      title: listings.title,
      description: listings.description,
      whatsappLink: listings.whatsappLink,
      status: listings.status,
      type: listings.type,
      priceType: listings.priceType,
      priceMin: listings.priceMin,
      priceMax: listings.priceMax,
      moderationReason: listings.moderationReason,
      createdAt: listings.createdAt,
      ownerName: users.fullName,
      ownerEmail: users.email,
      categoryName: categories.name,
      areaName: areas.name,
    })
    .from(listings)
    .innerJoin(users, eq(listings.userId, users.id))
    .innerJoin(categories, eq(listings.categoryId, categories.id))
    .innerJoin(areas, eq(listings.areaId, areas.id))
    .where(eq(listings.id, listingId))
    .limit(1);

  if (!row) return null;

  const photos = await db
    .select({ url: listingPhotos.url })
    .from(listingPhotos)
    .where(eq(listingPhotos.listingId, listingId))
    .orderBy(listingPhotos.sortOrder);

  return { ...row, photos: photos.map((p) => p.url) };
}

export async function getPendingListings(type: "Offers_Service" | "Needs_Service") {
  return db
    .select({
      id: listings.id,
      title: listings.title,
      createdAt: listings.createdAt,
      ownerName: users.fullName,
      categoryName: categories.name,
      coverPhotoUrl: listingPhotos.url,
    })
    .from(listings)
    .innerJoin(users, eq(listings.userId, users.id))
    .innerJoin(categories, eq(listings.categoryId, categories.id))
    .leftJoin(
      listingPhotos,
      and(eq(listingPhotos.listingId, listings.id), eq(listingPhotos.sortOrder, 0))
    )
    .where(and(eq(listings.status, "Pending_Moderation"), eq(listings.type, type)))
    .orderBy(listings.createdAt);
}

export async function suspendListing(listingId: string, reason: string) {
  const [updated] = await db
    .update(listings)
    .set({ status: "Suspended", moderationReason: reason })
    .where(eq(listings.id, listingId))
    .returning();

  return updated;
}

export async function deleteListing(listingId: string) {
  await db.delete(listings).where(eq(listings.id, listingId));
}
