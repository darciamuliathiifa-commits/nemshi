import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AD_CATEGORIES } from "@/lib/types";
import { SEED_OWNER_IDS } from "@/lib/constants";
import {
  consumeSayembaraSlot,
  getQuota,
  hasSayembaraSlotAvailable,
} from "@/lib/server/quota-store";

interface CreateSayembaraBody {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  priceLabel?: string;
  waNego?: boolean;
}

interface SayembaraRow {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  price_label: string | null;
  wa_nego: boolean;
  status: string;
  created_at: string;
  profiles: { name: string } | { name: string }[] | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const excludeId = searchParams.get("excludeId");
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 100));

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi." },
      { status: 500 },
    );
  }

  let query = supabase
    .from("sayembara")
    .select(
      `id, title, description, category, location, price_label, wa_nego, status, created_at,
       profiles!owner_id ( name )`,
    )
    .not("owner_id", "in", `(${SEED_OWNER_IDS.join(",")})`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (category) {
    query = query.eq("category", category);
  }
  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as unknown as SayembaraRow[];
  const ids = rows.map((row) => row.id);

  const applicantCountById = new Map<string, number>();
  if (ids.length > 0) {
    const { data: applicantRows } = await supabase
      .from("sayembara_applicants")
      .select("sayembara_id")
      .in("sayembara_id", ids);

    for (const row of (applicantRows ?? []) as { sayembara_id: string }[]) {
      applicantCountById.set(
        row.sayembara_id,
        (applicantCountById.get(row.sayembara_id) ?? 0) + 1,
      );
    }
  }

  const items = rows.map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      location: row.location,
      priceLabel: row.price_label,
      waNego: row.wa_nego,
      status: row.status,
      createdAt: row.created_at,
      ownerName: profile?.name ?? null,
      applicantCount: applicantCountById.get(row.id) ?? 0,
    };
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  let body: CreateSayembaraBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const title = body.title?.trim();
  const description = body.description?.trim();
  const location = body.location?.trim();

  if (!title) {
    return NextResponse.json({ error: "Judul wajib diisi." }, { status: 400 });
  }
  if (!description) {
    return NextResponse.json({ error: "Deskripsi wajib diisi." }, { status: 400 });
  }
  if (!location) {
    return NextResponse.json({ error: "Lokasi wajib diisi." }, { status: 400 });
  }
  if (!body.category || !AD_CATEGORIES.includes(body.category as (typeof AD_CATEGORIES)[number])) {
    return NextResponse.json(
      { error: `Kategori harus salah satu dari: ${AD_CATEGORIES.join(", ")}.` },
      { status: 400 },
    );
  }

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

  const quota = await getQuota(supabase, user.id, user.email);
  if (!hasSayembaraSlotAvailable(quota)) {
    return NextResponse.json(
      {
        error:
          "Kuota sayembara udah abis, beli paket satuan atau Paket Plus dulu ya.",
      },
      { status: 402 },
    );
  }

  const priceLabel = body.priceLabel?.trim() || null;
  const waNego = body.waNego === true;

  // Active Paket Plus subscribers get 3 days of featured/exclusive placement
  // (the "Sayembara Unggulan" carousel), same benefit as ads.
  const isActivePlus =
    quota.plan === "plus" &&
    (!quota.planExpiresAt || new Date(quota.planExpiresAt) > new Date());
  const featuredUntil = isActivePlus
    ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    : null;

  // Free slot: aktif 1 hari. Any paid/bonus extra slot: aktif 2 minggu —
  // the quota pool doesn't track which purchase granted a given extra slot,
  // so every source of an extra sayembara slot shares the same duration.
  const usingFreeSlot = !quota.freeSayembaraSlotUsed;
  const durationDays = usingFreeSlot ? 1 : 14;
  const expiresAt = quota.isUnlimited
    ? null
    : new Date(
        Date.now() + durationDays * 24 * 60 * 60 * 1000,
      ).toISOString();

  const { data, error } = await supabase
    .from("sayembara")
    .insert({
      owner_id: user.id,
      title,
      description,
      category: body.category,
      location,
      price_label: priceLabel,
      wa_nego: waNego,
      featured_until: featuredUntil,
      expires_at: expiresAt,
    })
    .select(
      "id, title, description, category, location, price_label, wa_nego, status, created_at",
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const adminClient = createSupabaseAdminClient();
  if (adminClient) {
    await consumeSayembaraSlot(adminClient, user.id, quota);
  }

  return NextResponse.json(
    {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      location: data.location,
      priceLabel: data.price_label,
      waNego: data.wa_nego,
      status: data.status,
      createdAt: data.created_at,
    },
    { status: 201 },
  );
}
