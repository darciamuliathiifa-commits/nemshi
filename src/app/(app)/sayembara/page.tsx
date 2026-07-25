import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SayembaraBrowser, type SayembaraListItem } from "@/components/sayembara/sayembara-browser";

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
  profiles: { name: string } | { name: string }[] | null;
}

export default async function SayembaraPage() {
  const supabase = await createSupabaseServerClient();

  let items: SayembaraListItem[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("sayembara")
      .select(
        `id, title, description, category, location, price_label, wa_nego, status, created_at,
         profiles ( name )`,
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
      };
    });
  }

  return <SayembaraBrowser items={items} />;
}
