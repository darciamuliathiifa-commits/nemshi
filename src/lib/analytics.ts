import { and, count, eq, inArray, max } from "drizzle-orm";
import { db } from "@/db";
import { clickAnalytics, listingImpressions, listings } from "@/db/schema";

export type ListingAnalytics = {
  id: string;
  title: string;
  impressions: number;
  clicks: number;
  lastClickAt: Date | null;
};

/** Dasbor Analitik Exposure: tayangan, klik WA, dan waktu klik terakhir per iklan aktif. */
export async function getListingAnalyticsForUser(userId: string): Promise<ListingAnalytics[]> {
  const ownListings = await db
    .select({ id: listings.id, title: listings.title })
    .from(listings)
    .where(
      and(eq(listings.userId, userId), eq(listings.type, "Offers_Service"), eq(listings.status, "Active"))
    );

  if (ownListings.length === 0) return [];

  const listingIds = ownListings.map((l) => l.id);

  const impressionRows = await db
    .select({ listingId: listingImpressions.listingId, total: count() })
    .from(listingImpressions)
    .where(inArray(listingImpressions.listingId, listingIds))
    .groupBy(listingImpressions.listingId);

  const clickRows = await db
    .select({
      listingId: clickAnalytics.listingId,
      total: count(),
      lastClickAt: max(clickAnalytics.clickedAt),
    })
    .from(clickAnalytics)
    .where(inArray(clickAnalytics.listingId, listingIds))
    .groupBy(clickAnalytics.listingId);

  const impressionMap = new Map(impressionRows.map((r) => [r.listingId, r.total]));
  const clickMap = new Map(clickRows.map((r) => [r.listingId, r]));

  return ownListings.map((listing) => {
    const clickRow = clickMap.get(listing.id);
    return {
      id: listing.id,
      title: listing.title,
      impressions: impressionMap.get(listing.id) ?? 0,
      clicks: clickRow?.total ?? 0,
      lastClickAt: clickRow?.lastClickAt ? new Date(clickRow.lastClickAt) : null,
    };
  });
}
