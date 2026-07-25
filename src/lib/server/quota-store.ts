import type { SupabaseClient } from "@supabase/supabase-js";

export type PlanId = "plus" | "extra_ad" | "extra_sayembara";

export interface UserQuota {
  userId: string;
  freeAdSlotUsed: boolean;
  freeSayembaraSlotUsed: boolean;
  extraAdSlots: number;
  extraSayembaraSlots: number;
  plan: "free" | "plus";
  planExpiresAt: string | null;
}

interface PlanBenefit {
  extraAdSlots: number;
  extraSayembaraSlots: number;
  durationMonths: number;
  grantsPlus: boolean;
}

const PLAN_BENEFITS: Record<PlanId, PlanBenefit> = {
  plus: { extraAdSlots: 3, extraSayembaraSlots: 2, durationMonths: 3, grantsPlus: true },
  extra_ad: { extraAdSlots: 1, extraSayembaraSlots: 0, durationMonths: 0, grantsPlus: false },
  extra_sayembara: {
    extraAdSlots: 0,
    extraSayembaraSlots: 1,
    durationMonths: 0,
    grantsPlus: false,
  },
};

export const PLAN_PRICE_IDR: Record<PlanId, number> = {
  plus: 150000,
  extra_ad: 50000,
  extra_sayembara: 12000,
};

export const PLAN_LABELS: Record<PlanId, string> = {
  plus: "Paket Plus Nemshi",
  extra_ad: "Slot Iklan Tambahan Nemshi",
  extra_sayembara: "Slot Sayembara Tambahan Nemshi",
};

interface UserQuotaRow {
  user_id: string;
  free_ad_slot_used: boolean;
  free_sayembara_slot_used: boolean;
  extra_ad_slots: number;
  extra_sayembara_slots: number;
  plan: "free" | "plus";
  plan_expires_at: string | null;
}

function rowToQuota(row: UserQuotaRow): UserQuota {
  return {
    userId: row.user_id,
    freeAdSlotUsed: row.free_ad_slot_used,
    freeSayembaraSlotUsed: row.free_sayembara_slot_used,
    extraAdSlots: row.extra_ad_slots,
    extraSayembaraSlots: row.extra_sayembara_slots,
    plan: row.plan,
    planExpiresAt: row.plan_expires_at,
  };
}

function defaultQuota(userId: string): UserQuota {
  return {
    userId,
    freeAdSlotUsed: false,
    freeSayembaraSlotUsed: false,
    extraAdSlots: 0,
    extraSayembaraSlots: 0,
    plan: "free",
    planExpiresAt: null,
  };
}

export async function getQuota(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserQuota> {
  const { data } = await supabase
    .from("user_quotas")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  return data ? rowToQuota(data as UserQuotaRow) : defaultQuota(userId);
}

// Grants plan benefits only — the caller owns writing/updating the
// mayar_transactions row (checkout inserts it 'pending', the webhook flips
// it to 'success' right around calling this).
export async function activatePlan(
  supabase: SupabaseClient,
  planId: PlanId,
  userId: string,
): Promise<UserQuota> {
  const benefit = PLAN_BENEFITS[planId];
  if (!benefit) {
    throw new Error(`Unknown planId: ${planId}`);
  }

  const current = await getQuota(supabase, userId);

  let plan = current.plan;
  let planExpiresAt = current.planExpiresAt;
  if (benefit.grantsPlus) {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + benefit.durationMonths);
    plan = "plus";
    planExpiresAt = expiresAt.toISOString();
  }

  const { data, error } = await supabase
    .from("user_quotas")
    .upsert(
      {
        user_id: userId,
        free_ad_slot_used: current.freeAdSlotUsed,
        free_sayembara_slot_used: current.freeSayembaraSlotUsed,
        extra_ad_slots: current.extraAdSlots + benefit.extraAdSlots,
        extra_sayembara_slots:
          current.extraSayembaraSlots + benefit.extraSayembaraSlots,
        plan,
        plan_expires_at: planExpiresAt,
      },
      { onConflict: "user_id" },
    )
    .select("*")
    .single();

  if (error) throw error;

  return rowToQuota(data as UserQuotaRow);
}

export function hasAdSlotAvailable(quota: UserQuota): boolean {
  return !quota.freeAdSlotUsed || quota.extraAdSlots > 0;
}

export async function consumeAdSlot(
  supabase: SupabaseClient,
  userId: string,
  quota: UserQuota,
): Promise<void> {
  await supabase.from("user_quotas").upsert(
    {
      user_id: userId,
      free_ad_slot_used: true,
      free_sayembara_slot_used: quota.freeSayembaraSlotUsed,
      extra_ad_slots: quota.freeAdSlotUsed
        ? Math.max(0, quota.extraAdSlots - 1)
        : quota.extraAdSlots,
      extra_sayembara_slots: quota.extraSayembaraSlots,
      plan: quota.plan,
      plan_expires_at: quota.planExpiresAt,
    },
    { onConflict: "user_id" },
  );
}

export function hasSayembaraSlotAvailable(quota: UserQuota): boolean {
  return !quota.freeSayembaraSlotUsed || quota.extraSayembaraSlots > 0;
}

export async function consumeSayembaraSlot(
  supabase: SupabaseClient,
  userId: string,
  quota: UserQuota,
): Promise<void> {
  await supabase.from("user_quotas").upsert(
    {
      user_id: userId,
      free_ad_slot_used: quota.freeAdSlotUsed,
      free_sayembara_slot_used: true,
      extra_ad_slots: quota.extraAdSlots,
      extra_sayembara_slots: quota.freeSayembaraSlotUsed
        ? Math.max(0, quota.extraSayembaraSlots - 1)
        : quota.extraSayembaraSlots,
      plan: quota.plan,
      plan_expires_at: quota.planExpiresAt,
    },
    { onConflict: "user_id" },
  );
}
