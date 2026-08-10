import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  ensureMasterListingsUnlimited,
  isMasterAccountEmail,
} from "@/lib/server/quota-store";

const DEFAULT_NEXT = "/jelajahi";

/**
 * `next` rides in on a query string, so it can't be trusted. Only same-site
 * paths are allowed: anything starting with "//" (or "/\") is read by browsers
 * as protocol-relative and would turn this callback into an open redirect
 * pointing at another host.
 */
function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/")) return DEFAULT_NEXT;
  if (raw.startsWith("//") || raw.startsWith("/\\")) return DEFAULT_NEXT;
  return raw;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const supabase = await createSupabaseServerClient();

    if (supabase) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      // This used to fail silently, redirecting to "/" with no trace of why
      // — the symptom users reported was "I have to log in twice," which was
      // actually a first attempt failing outright. Logging the real reason
      // (e.g. PKCE verifier cookie missing — often a www vs apex domain
      // mismatch between where login started and where this callback landed)
      // turns that into something diagnosable from Vercel's function logs.
      if (error) {
        console.error("[auth/callback] exchangeCodeForSession failed:", error.message);
      }

      if (!error && data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          name:
            data.user.user_metadata?.full_name ??
            data.user.user_metadata?.name ??
            data.user.email ??
            "Pengguna Nemsy!",
          email: data.user.email,
          avatar_url:
            data.user.user_metadata?.avatar_url ??
            data.user.user_metadata?.picture ??
            null,
        });

        if (isMasterAccountEmail(data.user.email)) {
          const admin = createSupabaseAdminClient();
          if (admin) {
            await ensureMasterListingsUnlimited(admin, data.user.id);
          }
        }

        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`);
}
