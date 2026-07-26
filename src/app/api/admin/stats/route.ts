import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/server/require-admin";

import { SEED_OWNER_IDS } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    { count: totalUsers },
    { count: pendingModeration },
    { count: newReports },
    { count: activePlusCustomers },
    { data: monthlyTransactions },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .not("id", "in", `(${SEED_OWNER_IDS.join(",")})`),
    supabase
      .from("ads")
      .select("id", { count: "exact", head: true })
      .not("owner_id", "in", `(${SEED_OWNER_IDS.join(",")})`)
      .eq("status", "Menunggu Validasi"),
    supabase
      .from("ad_reports")
      .select("id", { count: "exact", head: true })
      .eq("status", "Baru"),
    supabase
      .from("user_quotas")
      .select("user_id", { count: "exact", head: true })
      .not("user_id", "in", `(${SEED_OWNER_IDS.join(",")})`)
      .eq("plan", "plus"),
    supabase
      .from("mayar_transactions")
      .select("amount")
      .eq("status", "success")
      .gte("created_at", startOfMonth.toISOString()),
  ]);

  const revenueThisMonth = (monthlyTransactions ?? []).reduce(
    (sum, row) => sum + row.amount,
    0,
  );

  return NextResponse.json({
    totalUsers: totalUsers ?? 0,
    pendingModeration: pendingModeration ?? 0,
    newReports: newReports ?? 0,
    activePlusCustomers: activePlusCustomers ?? 0,
    revenueThisMonth: `Rp ${revenueThisMonth.toLocaleString("id-ID")}`,
  });
}
