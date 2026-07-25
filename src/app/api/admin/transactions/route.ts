import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/server/require-admin";

interface TransactionRow {
  id: string;
  plan_id: string;
  amount: number;
  status: string;
  created_at: string;
  mayar_invoice_id: string | null;
  profiles: { name: string; email: string | null } | { name: string; email: string | null }[] | null;
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

  const forbidden = await requireAdmin(supabase, user.id);
  if (forbidden) return forbidden;

  const { data, error } = await supabase
    .from("mayar_transactions")
    .select(
      `id, plan_id, amount, status, created_at, mayar_invoice_id,
       profiles ( name, email )`,
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as unknown as TransactionRow[];

  const transactions = rows.map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.id,
      planId: row.plan_id,
      amount: row.amount,
      status: row.status,
      createdAt: row.created_at,
      hasInvoice: !!row.mayar_invoice_id,
      userName: profile?.name ?? null,
      userEmail: profile?.email ?? null,
    };
  });

  return NextResponse.json({ transactions });
}
