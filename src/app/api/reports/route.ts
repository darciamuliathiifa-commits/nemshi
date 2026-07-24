import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const REPORT_REASONS = [
  "Spam atau iklan berulang",
  "Penipuan",
  "Konten terlarang atau tidak pantas",
  "Informasi menyesatkan",
  "Lainnya",
];

interface CreateReportBody {
  adId?: string;
  reason?: string;
  detail?: string;
}

export async function POST(request: Request) {
  let body: CreateReportBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  if (!body.adId) {
    return NextResponse.json({ error: "adId wajib diisi." }, { status: 400 });
  }

  if (!body.reason || !REPORT_REASONS.includes(body.reason)) {
    return NextResponse.json(
      { error: `Alasan harus salah satu dari: ${REPORT_REASONS.join(", ")}.` },
      { status: 400 },
    );
  }

  const reason = body.detail?.trim()
    ? `${body.reason} - ${body.detail.trim()}`
    : body.reason;

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
    .from("ad_reports")
    .insert({ ad_id: body.adId, reporter_id: user.id, reason })
    .select("id, status, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { id: data.id, status: data.status, createdAt: data.created_at },
    { status: 201 },
  );
}
