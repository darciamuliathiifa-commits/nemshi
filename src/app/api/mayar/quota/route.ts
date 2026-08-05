import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  ensureMasterListingsUnlimited,
  getQuota,
} from "@/lib/server/quota-store";

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

  const quota = await getQuota(supabase, user.id, user.email);
  if (quota.isUnlimited) {
    const admin = createSupabaseAdminClient();
    if (admin) {
      await ensureMasterListingsUnlimited(admin, user.id);
    }
  }

  return NextResponse.json(quota);
}
