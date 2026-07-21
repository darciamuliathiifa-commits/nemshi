import { and, avg, count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { listings, testimonials, userQuotas, users } from "@/db/schema";

export type PublicProfile = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  whatsappLink: string | null;
  verificationStatus: string;
};

export async function getPublicProfile(userId: string): Promise<PublicProfile | null> {
  const [user] = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      avatarUrl: users.avatarUrl,
      whatsappLink: users.whatsappLink,
      verificationStatus: users.verificationStatus,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user ?? null;
}

export async function getUserActiveListings(userId: string) {
  const rows = await db
    .select({
      id: listings.id,
      title: listings.title,
      type: listings.type,
      status: listings.status,
    })
    .from(listings)
    .where(and(eq(listings.userId, userId), eq(listings.status, "Active")))
    .orderBy(desc(listings.publishedAt));

  return {
    offers: rows.filter((row) => row.type === "Offers_Service"),
    requests: rows.filter((row) => row.type === "Needs_Service"),
  };
}

export async function getUserTestimonials(userId: string) {
  const rows = await db
    .select({
      id: testimonials.id,
      reviewerName: testimonials.reviewerName,
      rating: testimonials.rating,
      comment: testimonials.comment,
      createdAt: testimonials.createdAt,
    })
    .from(testimonials)
    .where(eq(testimonials.revieweeUserId, userId))
    .orderBy(desc(testimonials.createdAt));

  const [summary] = await db
    .select({
      averageRating: avg(testimonials.rating),
      totalCount: count(testimonials.id),
    })
    .from(testimonials)
    .where(eq(testimonials.revieweeUserId, userId));

  return {
    items: rows,
    averageRating: summary?.averageRating ? Number(summary.averageRating) : null,
    totalCount: summary?.totalCount ?? 0,
  };
}

export async function getUserActivitySummary(userId: string) {
  const quotas = await db
    .select()
    .from(userQuotas)
    .where(eq(userQuotas.userId, userId))
    .orderBy(desc(userQuotas.validityEnd));

  const activityListings = await db
    .select({
      id: listings.id,
      title: listings.title,
      type: listings.type,
      status: listings.status,
      publishedAt: listings.publishedAt,
      expiresAt: listings.expiresAt,
    })
    .from(listings)
    .where(eq(listings.userId, userId))
    .orderBy(desc(listings.publishedAt));

  return { quotas, listings: activityListings };
}

export async function updateUserProfile(
  userId: string,
  data: { fullName?: string; avatarUrl?: string | null; whatsappLink?: string | null }
) {
  const [updated] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, userId))
    .returning();

  return updated;
}
