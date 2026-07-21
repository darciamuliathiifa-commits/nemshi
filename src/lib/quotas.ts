import { and, desc, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { userQuotas } from "@/db/schema";

/**
 * Memakai 1 kuota Listing_Slot (dari Paket Plus) yang masih berlaku.
 * Mengembalikan false jika tidak ada kuota tersedia.
 */
export async function consumeListingSlotQuota(userId: string): Promise<boolean> {
  const [quota] = await db
    .select()
    .from(userQuotas)
    .where(
      and(
        eq(userQuotas.userId, userId),
        eq(userQuotas.quotaType, "Listing_Slot"),
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
 * Mengembalikan 1 kuota Listing_Slot ke pengguna, dipakai saat iklan yang
 * dibayar pakai kuota ditolak moderasi.
 */
export async function refundListingSlotQuota(userId: string): Promise<void> {
  const [quota] = await db
    .select()
    .from(userQuotas)
    .where(and(eq(userQuotas.userId, userId), eq(userQuotas.quotaType, "Listing_Slot")))
    .orderBy(desc(userQuotas.validityEnd))
    .limit(1);

  if (!quota) return;

  await db
    .update(userQuotas)
    .set({ remainingAmount: quota.remainingAmount + 1 })
    .where(eq(userQuotas.id, quota.id));
}
