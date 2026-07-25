import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { activatePlusPlan, type PlanId } from "@/lib/server/quota-store";

// Called by Mayar's servers, not a logged-in browser — there's no session
// cookie to authenticate with. Mayar doesn't document HMAC/signature
// verification for webhooks, so the shared secret is a query param on the
// URL registered in the Mayar dashboard:
//   https://<app>/api/mayar/webhook?secret=<MAYAR_WEBHOOK_SECRET>
interface MayarWebhookPayload {
  event?: string;
  data?: {
    id?: string;
    status?: boolean;
    amount?: number;
    [key: string]: unknown;
  };
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const expectedSecret = process.env.MAYAR_WEBHOOK_SECRET;

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let payload: MayarWebhookPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const mayarId = payload.data?.id;
  if (!mayarId) {
    return NextResponse.json({ error: "data.id tidak ada di payload." }, { status: 400 });
  }

  if (payload.data?.status !== true) {
    return NextResponse.json({ status: "ignored (belum dibayar)" });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase admin belum dikonfigurasi." },
      { status: 500 },
    );
  }

  // Mayar's Create Invoice response returns both `id` and `transactionId` —
  // the docs don't confirm which one the webhook echoes back as data.id, so
  // we stored both at checkout time and match against either.
  const { data: transaction, error: findError } = await supabase
    .from("mayar_transactions")
    .select("id, user_id, plan_id, status")
    .or(`mayar_invoice_id.eq.${mayarId},mayar_transaction_ref.eq.${mayarId}`)
    .maybeSingle();

  if (findError) {
    return NextResponse.json({ error: findError.message }, { status: 500 });
  }

  if (!transaction) {
    return NextResponse.json({ error: "Transaksi tidak ditemukan." }, { status: 404 });
  }

  if (transaction.status === "success") {
    return NextResponse.json({ status: "already processed" });
  }

  const quota = await activatePlusPlan(
    supabase,
    transaction.plan_id as PlanId,
    transaction.user_id,
  );

  await supabase
    .from("mayar_transactions")
    .update({ status: "success" })
    .eq("id", transaction.id);

  return NextResponse.json({ status: "ok", quota });
}
