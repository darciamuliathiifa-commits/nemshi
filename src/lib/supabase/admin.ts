import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Bypasses RLS — only for server-to-server contexts with no user session to
// scope the request to, e.g. the Mayar webhook (Mayar's servers call this,
// not a logged-in browser, so there's no auth cookie to read).
export function createSupabaseAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) return null;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
