import { Header } from "@/components/layout/header";
import { MyAdsList, type MyAd } from "@/components/ads/my-ads-list";
import { SayembaraManageList, type MySayembara } from "@/components/sayembara/sayembara-manage-list";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatRelativeTime } from "@/lib/format-relative-time";
import type { AdStatus } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function IklanSayaPage() {
  const supabase = await createSupabaseServerClient();

  let ads: MyAd[] = [];
  let sayembara: MySayembara[] = [];

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const [{ data: adRows }, { data: sayembaraRows }] = await Promise.all([
        supabase
          .from("ads")
          .select("id, status, category, title, price_label, location, created_at, expires_at, ad_photos ( url, position )")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("sayembara")
          .select("id, status, category, title, location, price_label, created_at, expires_at")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      ads = (adRows ?? []).map((row) => {
        const photos = (row.ad_photos ?? [])
          .slice()
          .sort((a, b) => a.position - b.position)
          .map((p) => p.url);

        return {
          id: row.id,
          status: row.status as AdStatus,
          category: row.category,
          title: row.title,
          priceLabel: row.price_label,
          location: row.location,
          postedAt: formatRelativeTime(row.created_at),
          expiresAt: row.expires_at,
          coverPhoto: photos[0] ?? undefined,
        };
      });

      const sayembaraIds = (sayembaraRows ?? []).map((row) => row.id);
      const applicantCountById = new Map<string, number>();
      if (sayembaraIds.length > 0) {
        const { data: applicantRows } = await supabase
          .from("sayembara_applicants")
          .select("sayembara_id")
          .in("sayembara_id", sayembaraIds);

        for (const row of (applicantRows ?? []) as { sayembara_id: string }[]) {
          applicantCountById.set(
            row.sayembara_id,
            (applicantCountById.get(row.sayembara_id) ?? 0) + 1,
          );
        }
      }

      sayembara = (sayembaraRows ?? []).map((row) => ({
        id: row.id,
        status: row.status,
        category: row.category,
        title: row.title,
        location: row.location ?? "",
        priceLabel: row.price_label,
        applicantCount: applicantCountById.get(row.id) ?? 0,
        postedAt: formatRelativeTime(row.created_at),
        expiresAt: row.expires_at,
      }));
    }
  }

  return (
    <>
      <Header title="Iklan Saya" />

      <main className="flex-1 px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-charcoal">Kelola Iklan Saya</h2>
          <p className="mt-1 text-[14px] font-normal text-muted-foreground">
            Pantau status semua iklan yang pernah kamu pasang.
          </p>
        </div>

        <MyAdsList ads={ads} />

        <div className="mb-6 mt-12">
          <h2 className="text-xl font-bold text-charcoal">Sayembara Saya</h2>
          <p className="mt-1 text-[14px] font-normal text-muted-foreground">
            Kelola sayembara jasa yang pernah kamu pasang.
          </p>
        </div>

        <SayembaraManageList items={sayembara} />
      </main>
    </>
  );
}
