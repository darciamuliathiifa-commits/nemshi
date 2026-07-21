import { and, desc, eq, ilike, or } from "drizzle-orm";
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
  provider: { id: string; fullName: string; verificationStatus: string };
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
};

export async function getActiveListings(
  filters: ListingFilters = {}
): Promise<ListingSummary[]> {
  const conditions = [eq(listings.status, "Active")];

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
    })
    .from(listings)
    .innerJoin(categories, eq(listings.categoryId, categories.id))
    .innerJoin(areas, eq(listings.areaId, areas.id))
    .innerJoin(users, eq(listings.userId, users.id))
    .where(and(...conditions))
    .orderBy(desc(listings.isPriority), desc(listings.publishedAt));

  const coverPhotos = await db
    .select({ listingId: listingPhotos.listingId, url: listingPhotos.url })
    .from(listingPhotos)
    .where(eq(listingPhotos.sortOrder, 0));

  const coverByListingId = new Map(coverPhotos.map((p) => [p.listingId, p.url]));

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
    })
    .from(listings)
    .innerJoin(categories, eq(listings.categoryId, categories.id))
    .innerJoin(areas, eq(listings.areaId, areas.id))
    .innerJoin(users, eq(listings.userId, users.id))
    .where(and(eq(listings.id, id), eq(listings.status, "Active")))
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
