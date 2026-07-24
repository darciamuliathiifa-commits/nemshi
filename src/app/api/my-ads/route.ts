import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

const VALID_STATUSES = [
  "Aktif",
  "Terjual",
  "Selesai",
  "Kedaluwarsa",
  "Ditutup",
  "Menunggu Validasi",
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status");
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Belum masuk akun." }, { status: 401 });
  }

  let query = supabase
    .from("ads")
    .select(
      `id, kind, title, description, category, price_label, location, status,
       condition, delivery_method, scope, estimated_duration, whatsapp_number,
       created_at`,
      { count: "exact" },
    )
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (status && VALID_STATUSES.includes(status)) {
    query = query.eq("status", status);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query.range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const ads = (data ?? []).map((row) => ({
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
    whatsappNumber: row.whatsapp_number,
    createdAt: row.created_at,
  }));

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
