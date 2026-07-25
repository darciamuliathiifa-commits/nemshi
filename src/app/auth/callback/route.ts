import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/jelajahi";

  if (code) {
    const supabase = await createSupabaseServerClient();

    if (supabase) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          name:
            data.user.user_metadata?.full_name ??
            data.user.user_metadata?.name ??
            data.user.email ??
            "Pengguna Nemshi",
          email: data.user.email,
        });

        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`);
}
