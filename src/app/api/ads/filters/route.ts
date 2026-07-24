import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AD_CATEGORIES } from "@/lib/types";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase belum dikonfigurasi." },
      { status: 500 },
    );
  }

  const { data, error } = await supabase
    .from("ads")
    .select("location")
    .eq("status", "Aktif");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const locations = Array.from(
    new Set((data ?? []).map((row) => row.location)),
  ).sort((a, b) => a.localeCompare(b));

  return NextResponse.json({
    categories: AD_CATEGORIES,
    locations,
  });
}
