import { desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

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
