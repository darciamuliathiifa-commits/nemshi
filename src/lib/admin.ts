import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { adminActivityLogs, users } from "@/db/schema";
import { getCurrentUserId } from "@/lib/current-user";

async function isUserAdmin(userId: string): Promise<boolean> {
  const [user] = await db
    .select({ isAdmin: users.isAdmin })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user?.isAdmin ?? false;
}

/** Untuk Server Component halaman /admin/*: redirect jika bukan admin. */
export async function requireAdminForPage(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/masuk?redirectTo=/admin");
  }

  if (!(await isUserAdmin(userId))) {
    redirect("/");
  }

  return userId;
}

/** Untuk API route /api/admin/*: null berarti belum masuk atau bukan admin. */
export async function getAdminUserId(): Promise<string | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  if (!(await isUserAdmin(userId))) return null;
  return userId;
}

export async function logAdminActivity(data: {
  adminUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  reason?: string;
}) {
  await db.insert(adminActivityLogs).values(data);
}
