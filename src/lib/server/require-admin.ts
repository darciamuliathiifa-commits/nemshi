import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function requireAdmin(supabase: SupabaseClient, userId: string) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .maybeSingle();

  if (!profile?.is_admin) {
    return NextResponse.json(
      { error: "Akses ditolak. Khusus admin." },
      { status: 403 },
    );
  }

  return null;
}
