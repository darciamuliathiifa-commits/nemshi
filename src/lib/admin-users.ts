import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { listings, users } from "@/db/schema";

export async function getAllUsersForAdmin(query?: string) {
  const whereClause = query
    ? or(ilike(users.fullName, `%${query}%`), ilike(users.email, `%${query}%`))
    : undefined;

  return db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      verificationStatus: users.verificationStatus,
      isAdmin: users.isAdmin,
      isSuspended: users.isSuspended,
      suspendedReason: users.suspendedReason,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(whereClause)
    .orderBy(desc(users.createdAt));
}

export async function updateUserVerificationStatus(
  userId: string,
  verificationStatus: "Unverified" | "Identity_Verified" | "Skill_Verified"
) {
  const [updated] = await db
    .update(users)
    .set({ verificationStatus })
    .where(eq(users.id, userId))
    .returning();

  return updated;
}

/**
 * Konsekuensi pelanggaran berat (fitur Keamanan Komunitas): akun tidak
 * bisa lagi memasang iklan/permintaan baru, dan seluruh iklannya yang
 * masih tayang/menunggu moderasi langsung ditangguhkan bersamaan.
 */
export async function suspendUserPermanently(userId: string, reason: string) {
  const [updated] = await db
    .update(users)
    .set({ isSuspended: true, suspendedReason: reason })
    .where(eq(users.id, userId))
    .returning();

  if (!updated) throw new Error("Pengguna tidak ditemukan.");

  await db
    .update(listings)
    .set({ status: "Suspended", moderationReason: reason })
    .where(
      and(
        eq(listings.userId, userId),
        or(eq(listings.status, "Active"), eq(listings.status, "Pending_Moderation"))
      )
    );

  return updated;
}
