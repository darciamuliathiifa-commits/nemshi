import Link from "next/link";
import { Header } from "@/components/layout/header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatRelativeTime } from "@/lib/format-relative-time";

const statusAccent: Record<string, string> = {
  Aktif: "bg-success text-white",
  Terjual: "bg-charcoal text-white",
  Selesai: "bg-charcoal text-white",
  Kedaluwarsa: "bg-muted text-white",
  Ditutup: "bg-error text-white",
};

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

  let items: (SayembaraRow & { ownerName: string | null; applicantCount: number })[] = [];

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

  return (
    <>
      <Header title="Sayembara Jasa" />

      <main className="flex-1 px-6 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-charcoal">Sayembara Jasa</h2>
            <p className="mt-1 text-[14px] font-normal text-muted-foreground">
              Pengumuman kebutuhan jasa dari komunitas Masisir. Daftarkan diri
              kalau kamu bisa bantu.
            </p>
          </div>

          <Link
            href="/sayembara/baru"
            className="h-11 shrink-0 rounded-pill bg-charcoal px-5 text-base font-bold leading-[44px] text-white transition-colors hover:bg-black"
          >
            Pasang Sayembara
          </Link>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/sayembara/${item.id}`}
                className="flex flex-col gap-3 rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[3px_3px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-badge bg-highlight px-3 py-1 text-[12px] leading-4 font-bold text-white">
                    {item.category}
                  </span>
                  <span
                    className={`rounded-badge px-3 py-1 text-[12px] leading-4 font-bold ${statusAccent[item.status] ?? statusAccent.Aktif}`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-xl font-normal leading-[26px] text-charcoal">
                  {item.title}
                </h3>

                <p className="text-[14px] leading-5 font-normal text-muted-foreground">
                  {item.description}
                </p>

                {(item.price_label || item.wa_nego) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {item.price_label && (
                      <span className="text-[14px] font-bold text-cta">
                        {item.price_label}
                      </span>
                    )}
                    {item.wa_nego && (
                      <span className="rounded-badge bg-success/10 px-2.5 py-1 text-[11px] font-bold text-success">
                        Nego via WA
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-3">
                  <span className="text-[12px] font-bold text-muted-foreground">
                    {item.location}
                  </span>
                  <span className="rounded-badge bg-surface px-2.5 py-1 text-[12px] font-bold text-charcoal">
                    {item.applicantCount} pendaftar
                  </span>
                </div>

                <div className="flex items-center justify-between text-[12px] text-muted-foreground">
                  <span>{item.ownerName ?? "Pengguna Nemshi"}</span>
                  <span>{formatRelativeTime(item.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border-strong py-16 text-center">
            <p className="text-base font-normal text-charcoal">
              Belum ada sayembara.
            </p>
            <p className="mt-1 text-[14px] font-normal text-muted-foreground">
              Jadilah yang pertama memasang sayembara untuk komunitas Masisir.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
