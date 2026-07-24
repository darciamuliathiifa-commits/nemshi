import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface SellerProfileRow {
  id: string;
  name: string;
  whatsapp_number: string | null;
  location: string | null;
  created_at: string;
}

interface AdDetailRow {
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi." },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("ads")
    .select(
      `id, owner_id, kind, title, description, category, price_label, location,
       status, condition, delivery_method, scope, estimated_duration,
       whatsapp_number, created_at,
       profiles ( id, name, whatsapp_number, location, created_at )`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Iklan tidak ditemukan." }, { status: 404 });
  }

  const row = data as unknown as AdDetailRow;
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  const [{ data: photoRows }, { count: activeAdsCount }] = await Promise.all([
    supabase
      .from("ad_photos")
      .select("url")
      .eq("ad_id", row.id)
      .order("position", { ascending: true }),
    supabase
      .from("ads")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", row.owner_id)
      .eq("status", "Aktif"),
  ]);

  return NextResponse.json({
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
    photos: (photoRows ?? []).map((photo) => photo.url),
    seller: profile
      ? {
          name: profile.name,
          whatsappNumber: profile.whatsapp_number,
          location: profile.location,
          joinedYear: new Date(profile.created_at).getFullYear(),
          activeAdsCount: activeAdsCount ?? 0,
        }
      : null,
  });
}
