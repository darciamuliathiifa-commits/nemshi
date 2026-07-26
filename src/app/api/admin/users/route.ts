import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/server/require-admin";
import { SEED_OWNER_IDS } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface UserProfileRow {
  id: string;
  name: string;
  email: string | null;
  whatsapp_number: string | null;
  location: string | null;
  created_at: string;
}

export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi." },
      { status: 500 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Belum masuk akun." }, { status: 401 });
  }

  const forbidden = await requireAdmin(supabase, user.id);
  if (forbidden) return forbidden;

  const adminClient = createSupabaseAdminClient() ?? supabase;

  const { data: userRows, error } = await adminClient
    .from("profiles")
    .select("id, name, email, whatsapp_number, location, created_at")
    .not("id", "in", `(${SEED_OWNER_IDS.join(",")})`)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const users = (userRows ?? []) as UserProfileRow[];
  const userIds = users.map((u) => u.id);

  const quotaMap = new Map<string, any>();
  const activeAdsMap = new Map<string, number>();

  if (userIds.length > 0) {
    const [{ data: quotas }, { data: activeAds }] = await Promise.all([
      adminClient
        .from("user_quotas")
        .select("user_id, plan, extra_ad_slots, extra_sayembara_slots, free_ad_slot_used, free_sayembara_slot_used, plan_expires_at")
        .in("user_id", userIds),
      adminClient
        .from("ads")
        .select("owner_id")
        .in("owner_id", userIds)
        .eq("status", "Aktif"),
    ]);

    for (const q of (quotas ?? []) as any[]) {
      quotaMap.set(q.user_id, q);
    }

    for (const ad of (activeAds ?? []) as { owner_id: string }[]) {
      activeAdsMap.set(ad.owner_id, (activeAdsMap.get(ad.owner_id) ?? 0) + 1);
    }
  }

  const result = users.map((u) => {
    const q = quotaMap.get(u.id);
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      whatsappNumber: u.whatsapp_number,
      location: u.location,
      createdAt: u.created_at,
      plan: q?.plan ?? "free",
      extraAdSlots: q?.extra_ad_slots ?? 0,
      extraSayembaraSlots: q?.extra_sayembara_slots ?? 0,
      freeAdSlotUsed: q?.free_ad_slot_used ?? false,
      freeSayembaraSlotUsed: q?.free_sayembara_slot_used ?? false,
      planExpiresAt: q?.plan_expires_at ?? null,
      activeAdsCount: activeAdsMap.get(u.id) ?? 0,
    };
  });

  return NextResponse.json({ users: result });
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi." },
      { status: 500 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Belum masuk akun." }, { status: 401 });
  }

  const forbidden = await requireAdmin(supabase, user.id);
  if (forbidden) return forbidden;

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return NextResponse.json(
      { error: "Supabase admin key belum dikonfigurasi." },
      { status: 500 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const { targetUserId, action, amount = 1 } = body as {
    targetUserId?: string;
    action?: "grant_ad" | "grant_sayembara" | "grant_plus" | "reset_free_slot";
    amount?: number;
  };

  if (!targetUserId || !action) {
    return NextResponse.json(
      { error: "targetUserId dan action wajib diisi." },
      { status: 400 },
    );
  }

  // Fetch or initialize user quota row
  const { data: existingQuota } = await adminClient
    .from("user_quotas")
    .select("*")
    .eq("user_id", targetUserId)
    .maybeSingle();

  const currentExtraAd = existingQuota?.extra_ad_slots ?? 0;
  const currentExtraSayembara = existingQuota?.extra_sayembara_slots ?? 0;

  let updatePayload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (action === "grant_ad") {
    updatePayload.extra_ad_slots = Math.max(0, currentExtraAd + Number(amount));
  } else if (action === "grant_sayembara") {
    updatePayload.extra_sayembara_slots = Math.max(0, currentExtraSayembara + Number(amount));
  } else if (action === "grant_plus") {
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 3);
    updatePayload.plan = "plus";
    updatePayload.plan_expires_at = expiresAt.toISOString();
    updatePayload.extra_ad_slots = currentExtraAd + 3;
    updatePayload.extra_sayembara_slots = currentExtraSayembara + 2;
  } else if (action === "reset_free_slot") {
    updatePayload.free_ad_slot_used = false;
    updatePayload.free_sayembara_slot_used = false;
  }

  const { error: upsertError } = await adminClient
    .from("user_quotas")
    .upsert({
      user_id: targetUserId,
      ...updatePayload,
    });

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, action, targetUserId });
}
