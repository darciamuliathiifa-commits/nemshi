import { and, desc, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { userQuotas } from "@/db/schema";

type QuotaType = "Listing_Slot" | "Priority_Slot";

/**
 * Memakai 1 kuota (dari Paket Plus) yang masih berlaku.
 * Mengembalikan false jika tidak ada kuota tersedia.
 */
export async function consumeQuota(userId: string, quotaType: QuotaType): Promise<boolean> {
  const [quota] = await db
    .select()
    .from(userQuotas)
    .where(
      and(
        eq(userQuotas.userId, userId),
        eq(userQuotas.quotaType, quotaType),
        gt(userQuotas.remainingAmount, 0),
        gt(userQuotas.validityEnd, new Date())
      )
    )
    .orderBy(userQuotas.validityEnd)
    .limit(1);

  if (!quota) return false;

  await db
    .update(userQuotas)
    .set({ remainingAmount: quota.remainingAmount - 1 })
    .where(eq(userQuotas.id, quota.id));

  return true;
}

/**
 * Mengembalikan 1 kuota ke pengguna, dipakai saat iklan/sayembara yang
 * dibayar pakai kuota ditolak moderasi.
 */
export async function refundQuota(userId: string, quotaType: QuotaType): Promise<void> {
  const [quota] = await db
    .select()
    .from(userQuotas)
    .where(and(eq(userQuotas.userId, userId), eq(userQuotas.quotaType, quotaType)))
    .orderBy(desc(userQuotas.validityEnd))
    .limit(1);

  if (!quota) return;

  await db
    .update(userQuotas)
    .set({ remainingAmount: quota.remainingAmount + 1 })
    .where(eq(userQuotas.id, quota.id));
}
