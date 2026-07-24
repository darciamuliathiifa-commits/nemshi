import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { activatePlusPlan, type PlanId } from "@/lib/server/quota-store";

const VALID_PLAN_IDS: PlanId[] = ["plus"];

interface MayarWebhookPayload {
  event: string;
  data: {
    planId: string;
  };
}

export async function POST(request: Request) {
  let payload: MayarWebhookPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  if (payload.event !== "payment.success") {
    return NextResponse.json(
      { error: `Unsupported event: ${payload.event}` },
      { status: 400 },
    );
  }

  const planId = payload.data?.planId;
  if (!VALID_PLAN_IDS.includes(planId as PlanId)) {
    return NextResponse.json({ error: `Unknown planId: ${planId}` }, { status: 400 });
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

  const quota = await activatePlusPlan(supabase, planId as PlanId, user.id);

  return NextResponse.json({ status: "ok", quota });
}
