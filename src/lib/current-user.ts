import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isUserSuspended } from "@/lib/users";

export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

/**
 * Dipakai oleh halaman akun yang perlu login DAN memblokir akun yang
 * ditangguhkan permanen (fitur Keamanan Komunitas) dari fitur platform.
 */
export async function requireActiveUser(redirectTo: string): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect(`/masuk?redirectTo=${redirectTo}`);
  }

  if (await isUserSuspended(userId)) {
    redirect("/akun-ditangguhkan");
  }

  return userId;
}
