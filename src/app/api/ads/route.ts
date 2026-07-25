import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AD_CATEGORIES } from "@/lib/types";
import { evaluateAdSubmission } from "@/lib/server/ad-filter";
import { consumeAdSlot, getQuota, hasAdSlotAvailable } from "@/lib/server/quota-store";

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
       profiles!owner_id ( id, name, whatsapp_number, created_at )`,
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

interface CreateAdBody {
  kind?: string;
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  priceLabel?: string;
  condition?: string;
  deliveryMethod?: string;
  scope?: string;
  estimatedDuration?: string;
  photos?: string[];
}

export async function POST(request: Request) {
  let body: CreateAdBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const kind = body.kind === "produk" || body.kind === "jasa" ? body.kind : null;
  const title = body.title?.trim();
  const description = body.description?.trim();
  const location = body.location?.trim();
  const priceLabel = body.priceLabel?.trim();

  if (!kind) {
    return NextResponse.json({ error: "Tipe iklan tidak valid." }, { status: 400 });
  }
  if (!title) {
    return NextResponse.json({ error: "Judul wajib diisi." }, { status: 400 });
  }
  if (!description) {
    return NextResponse.json({ error: "Deskripsi wajib diisi." }, { status: 400 });
  }
  if (!location) {
    return NextResponse.json({ error: "Lokasi wajib diisi." }, { status: 400 });
  }
  if (!priceLabel) {
    return NextResponse.json({ error: "Harga wajib diisi." }, { status: 400 });
  }
  if (!body.category || !AD_CATEGORIES.includes(body.category as (typeof AD_CATEGORIES)[number])) {
    return NextResponse.json(
      { error: `Kategori harus salah satu dari: ${AD_CATEGORIES.join(", ")}.` },
      { status: 400 },
    );
  }

  const condition = body.condition?.trim();
  const deliveryMethod = body.deliveryMethod?.trim();
  const scope = body.scope?.trim();
  const estimatedDuration = body.estimatedDuration?.trim();

  if (kind === "produk") {
    if (condition !== "Baru" && condition !== "Bekas") {
      return NextResponse.json({ error: "Kondisi wajib diisi untuk produk." }, { status: 400 });
    }
    if (!deliveryMethod) {
      return NextResponse.json(
        { error: "Metode penyerahan wajib diisi untuk produk." },
        { status: 400 },
      );
    }
  } else {
    if (!scope) {
      return NextResponse.json(
        { error: "Cakupan layanan wajib diisi untuk jasa." },
        { status: 400 },
      );
    }
    if (!estimatedDuration) {
      return NextResponse.json(
        { error: "Estimasi pengerjaan wajib diisi untuk jasa." },
        { status: 400 },
      );
    }
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

  const quota = await getQuota(supabase, user.id);
  if (!hasAdSlotAvailable(quota)) {
    return NextResponse.json(
      {
        error:
          "Slot iklan gratis sudah terpakai. Upgrade ke Paket Plus untuk menambah slot.",
      },
      { status: 402 },
    );
  }

  const { flagged, reasons } = evaluateAdSubmission({ title, description, priceLabel });
  const status = flagged ? "Menunggu Validasi" : "Aktif";

  const { data: ad, error } = await supabase
    .from("ads")
    .insert({
      owner_id: user.id,
      kind,
      title,
      description,
      category: body.category,
      price_label: priceLabel,
      location,
      status,
      condition: kind === "produk" ? condition : null,
      delivery_method: kind === "produk" ? deliveryMethod : null,
      scope: kind === "jasa" ? scope : null,
      estimated_duration: kind === "jasa" ? estimatedDuration : null,
      flag_reason: flagged ? reasons.join("; ") : null,
    })
    .select("id, status")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const photos = Array.isArray(body.photos)
    ? body.photos.filter((url): url is string => typeof url === "string" && url.length > 0)
    : [];

  if (photos.length > 0) {
    await supabase.from("ad_photos").insert(
      photos.map((url, index) => ({ ad_id: ad.id, url, position: index })),
    );
  }

  // user_quotas only has a SELECT RLS policy for users — writes need the
  // service-role client, same reasoning as the Mayar webhook.
  const adminClient = createSupabaseAdminClient();
  if (adminClient) {
    await consumeAdSlot(adminClient, user.id, quota);
  }

  return NextResponse.json({ id: ad.id, status: ad.status }, { status: 201 });
}
