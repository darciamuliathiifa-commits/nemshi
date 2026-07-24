import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface SavedAdRow {
  created_at: string;
  ads: {
    id: string;
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
  } | null;
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

  const { data, error } = await supabase
    .from("saved_ads")
    .select(
      `created_at,
       ads ( id, kind, title, description, category, price_label, location,
             status, condition, delivery_method, scope, estimated_duration,
             whatsapp_number )`,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as unknown as SavedAdRow[];

  const ads = rows
    .filter((row) => row.ads !== null)
    .map((row) => {
      const ad = row.ads!;
      return {
        id: ad.id,
        kind: ad.kind,
        title: ad.title,
        description: ad.description,
        category: ad.category,
        priceLabel: ad.price_label,
        location: ad.location,
        status: ad.status,
        condition: ad.condition,
        deliveryMethod: ad.delivery_method,
        scope: ad.scope,
        estimatedDuration: ad.estimated_duration,
        whatsappNumber: ad.whatsapp_number,
        savedAt: row.created_at,
      };
    });

  return NextResponse.json({ ads });
}

export async function POST(request: Request) {
  let body: { adId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  if (!body.adId) {
    return NextResponse.json({ error: "adId wajib diisi." }, { status: 400 });
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

  const { error } = await supabase
    .from("saved_ads")
    .upsert({ user_id: user.id, ad_id: body.adId }, { onConflict: "user_id,ad_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ saved: true, adId: body.adId });
}
