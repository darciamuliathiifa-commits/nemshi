import { and, avg, count, desc, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { listings, testimonials, userQuotas, users } from "@/db/schema";

export type PublicProfile = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  whatsappLink: string | null;
  verificationStatus: string;
};

/**
 * Membuat baris profil di public.users setelah supabase.auth.signUp()
 * berhasil, dengan id yang sama persis dengan auth.users.id. Idempoten
 * (aman dipanggil ulang) karena memakai id yang sama sebagai primary key.
 */
export async function bootstrapUserProfile(data: {
  id: string;
  email: string;
  fullName: string;
  role: "Pelanggan" | "Penyedia_Jasa";
}) {
  const [user] = await db
    .insert(users)
    .values(data)
    .onConflictDoNothing({ target: users.id })
    .returning();

  return user;
}

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
  const visible = and(eq(testimonials.revieweeUserId, userId), eq(testimonials.isHidden, false));

  const rows = await db
    .select({
      id: testimonials.id,
      reviewerName: testimonials.reviewerName,
      rating: testimonials.rating,
      comment: testimonials.comment,
      createdAt: testimonials.createdAt,
    })
    .from(testimonials)
    .where(visible)
    .orderBy(desc(testimonials.createdAt));

  const [summary] = await db
    .select({
      averageRating: avg(testimonials.rating),
      totalCount: count(testimonials.id),
    })
    .from(testimonials)
    .where(visible);

  return {
    items: rows,
    averageRating: summary?.averageRating ? Number(summary.averageRating) : null,
    totalCount: summary?.totalCount ?? 0,
  };
}

export async function createTestimonial(
  revieweeUserId: string,
  data: { reviewerName: string; rating: number; comment: string }
) {
  const [testimonial] = await db
    .insert(testimonials)
    .values({
      revieweeUserId,
      reviewerName: data.reviewerName,
      rating: data.rating,
      comment: data.comment,
    })
    .returning();

  return testimonial;
}

export async function getUserActivitySummary(userId: string) {
  // Kuota yang validity_end-nya sudah lewat dianggap hangus — tidak
  // ditampilkan sebagai "sisa kuota" meskipun remaining_amount > 0.
  const quotas = await db
    .select()
    .from(userQuotas)
    .where(and(eq(userQuotas.userId, userId), gt(userQuotas.validityEnd, new Date())))
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
