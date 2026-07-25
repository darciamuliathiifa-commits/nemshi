import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createMayarInvoice, MayarNotConfiguredError } from "@/lib/server/mayar";
import { PLAN_PRICE_IDR, type PlanId } from "@/lib/server/quota-store";

const VALID_PLAN_IDS: PlanId[] = ["plus"];

interface CheckoutBody {
  planId?: string;
  mobile?: string;
}

export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const planId = body.planId;
  if (!planId || !VALID_PLAN_IDS.includes(planId as PlanId)) {
    return NextResponse.json({ error: "Paket tidak valid." }, { status: 400 });
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email, whatsapp_number")
    .eq("id", user.id)
    .maybeSingle();

  const mobile = body.mobile?.trim() || profile?.whatsapp_number;

  if (!mobile) {
    return NextResponse.json(
      { error: "Nomor WhatsApp wajib diisi." },
      { status: 400 },
    );
  }
  if (!profile?.email) {
    return NextResponse.json(
      { error: "Email akun kamu tidak ditemukan." },
      { status: 400 },
    );
  }

  // Keep the profile in sync so the user doesn't have to re-enter it next time.
  if (body.mobile?.trim() && body.mobile.trim() !== profile.whatsapp_number) {
    await supabase
      .from("profiles")
      .update({ whatsapp_number: body.mobile.trim() })
      .eq("id", user.id);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const amount = PLAN_PRICE_IDR[planId as PlanId];
  const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  let invoice;
  try {
    invoice = await createMayarInvoice({
      name: profile.name,
      email: profile.email,
      mobile,
      redirectUrl: `${appUrl}/paket-plus?status=return`,
      description: "Paket Plus Nemshi",
      expiredAt,
      items: [{ quantity: 1, rate: amount, description: "Paket Plus Nemshi" }],
      extraData: { userId: user.id, planId },
    });
  } catch (err) {
    if (err instanceof MayarNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Gagal menghubungkan ke Mayar.",
      },
      { status: 502 },
    );
  }

  const { error: insertError } = await supabase.from("mayar_transactions").insert({
    user_id: user.id,
    plan_id: planId,
    amount,
    status: "pending",
    mayar_invoice_id: invoice.id,
    mayar_transaction_ref: invoice.transactionId,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ link: invoice.link });
}
