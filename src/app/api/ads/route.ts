import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

interface SellerProfileRow {
  id: string;
  name: string;
  whatsapp_number: string | null;
  created_at: string;
}

interface AdRow {
  id: string;
  owner_id: string;
  kind: "produk" | "jasa";
  title: string;
  description: string;
  category: string;
  price_label: string;
  location: string;
  status: string;
  condition: string | null;
  delivery_method: string | null;
  scope: string | null;
  estimated_duration: string | null;
  whatsapp_number: string | null;
  created_at: string;
  profiles: SellerProfileRow | SellerProfileRow[] | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const location = searchParams.get("location");
  const keyword = searchParams.get("keyword")?.trim();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number(searchParams.get("limit")) || DEFAULT_LIMIT),
  );

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi." },
      { status: 500 },
    );
  }

  let query = supabase
    .from("ads")
    .select(
      `id, owner_id, kind, title, description, category, price_label, location,
       status, condition, delivery_method, scope, estimated_duration,
       whatsapp_number, created_at,
       profiles ( id, name, whatsapp_number, created_at )`,
      { count: "exact" },
    )
    .eq("status", "Aktif")
    .order("created_at", { ascending: false });

  if (category && category !== "Semua") {
    query = query.eq("category", category);
  }
  if (location && location !== "Semua Lokasi") {
    query = query.eq("location", location);
  }
  if (keyword) {
    query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as unknown as AdRow[];

  const ownerIds = Array.from(new Set(rows.map((row) => row.owner_id)));
  const activeAdsCountByOwner = new Map<string, number>();

  if (ownerIds.length > 0) {
    const { data: activeAdsRows } = await supabase
      .from("ads")
      .select("owner_id")
      .eq("status", "Aktif")
      .in("owner_id", ownerIds);

    for (const row of (activeAdsRows ?? []) as { owner_id: string }[]) {
      activeAdsCountByOwner.set(
        row.owner_id,
        (activeAdsCountByOwner.get(row.owner_id) ?? 0) + 1,
      );
    }
  }

  const ads = rows.map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

    return {
      id: row.id,
      kind: row.kind,
      title: row.title,
      description: row.description,
      category: row.category,
      priceLabel: row.price_label,
      location: row.location,
      status: row.status,
      condition: row.condition,
      deliveryMethod: row.delivery_method,
      scope: row.scope,
      estimatedDuration: row.estimated_duration,
      whatsappNumber: row.whatsapp_number ?? profile?.whatsapp_number ?? null,
      createdAt: row.created_at,
      seller: profile
        ? {
            name: profile.name,
            whatsappNumber: profile.whatsapp_number,
            joinedYear: new Date(profile.created_at).getFullYear(),
            activeAdsCount: activeAdsCountByOwner.get(profile.id) ?? 0,
          }
        : null,
    };
  });

  const total = count ?? 0;

  return NextResponse.json({
    ads,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
}
