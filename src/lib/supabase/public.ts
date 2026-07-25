import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// For fully public, non-personalized reads (Eksplor/Sayembara listings).
// Unlike createSupabaseServerClient, this never touches cookies(), so the
// route stays eligible for static rendering + ISR (`export const revalidate`)
// instead of being forced dynamic on every request.
export function createSupabasePublicClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
