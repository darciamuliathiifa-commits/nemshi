import { createSupabasePublicClient } from "@/lib/supabase/public";
import { SayembaraBrowser, type SayembaraListItem } from "@/components/sayembara/sayembara-browser";

// ISR: serve a cached version of the listing for up to 30s instead of
// blocking every page view on a fresh Supabase round-trip.
export const revalidate = 30;

interface SayembaraRow {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  price_label: string | null;
  wa_nego: boolean;
  status: string;
  created_at: string;
  featured_until: string | null;
  profiles: { name: string } | { name: string }[] | null;
}

export default async function SayembaraPage() {
  const supabase = createSupabasePublicClient();

  let items: SayembaraListItem[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("sayembara")
      .select(
        `id, title, description, category, location, price_label, wa_nego, status, created_at, featured_until,
         profiles!owner_id ( name )`,
      )
      .order("created_at", { ascending: false });

    const rows = (data ?? []) as unknown as SayembaraRow[];
    const ids = rows.map((row) => row.id);

    const applicantCountById = new Map<string, number>();
    if (ids.length > 0) {
      const { data: applicantRows } = await supabase
        .from("sayembara_applicants")
        .select("sayembara_id")
        .in("sayembara_id", ids);

      for (const row of (applicantRows ?? []) as { sayembara_id: string }[]) {
        applicantCountById.set(
          row.sayembara_id,
          (applicantCountById.get(row.sayembara_id) ?? 0) + 1,
        );
      }
    }

    items = rows.map((row) => {
      const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
      return {
        ...row,
        ownerName: profile?.name ?? null,
        applicantCount: applicantCountById.get(row.id) ?? 0,
        featured: !!row.featured_until && new Date(row.featured_until) > new Date(),
      };
    });
  }

  return <SayembaraBrowser items={items} />;
}
