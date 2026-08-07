import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { MapPinIcon, UserIcon } from "@/components/icons";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { DEFAULT_OG_IMAGE } from "@/lib/site-url";
import { SayembaraOwnerActions } from "@/components/sayembara/sayembara-owner-actions";
import { TransactionDisclaimer } from "@/components/shared/transaction-disclaimer";
import { ShareButton } from "@/components/ads/share-button";

const statusAccent: Record<string, string> = {
  Aktif: "bg-success text-white",
  Terjual: "bg-charcoal text-white",
  Selesai: "bg-charcoal text-white",
  Kedaluwarsa: "bg-muted text-white",
  Ditutup: "bg-error text-white",
};

interface SayembaraDetailRow {
  id: string;
  owner_id: string;
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  // Public read — a link preview must render for crawlers with no session, so
  // this deliberately doesn't use the cookie-backed server client.
  const supabase = createSupabasePublicClient();
  if (!supabase) return { title: "Nemsy!" };

  const { data } = await supabase
    .from("sayembara")
    .select("title, description, price_label, location")
    .eq("id", id)
    .maybeSingle();

  if (!data) return { title: "Sayembara tidak ditemukan | Nemsy!" };

  // The reward is the hook when this gets pasted into a WhatsApp group, so it
  // goes in the title rather than being buried in the description.
  const reward = data.price_label?.trim();
  const title = reward
    ? `${data.title} · ${reward} | Nemsy!`
    : `${data.title} | Nemsy!`;

  const place = data.location?.trim();
  const description = [place ? `Sayembara di ${place}.` : "Sayembara Masisir.", data.description]
    .join(" ")
    .slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      type: "article",
      siteName: "Nemsy!",
      locale: "id_ID",
      title,
      description,
      url: `/sayembara/${id}`,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

export default async function SayembaraDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    notFound();
  }

  const { data } = await supabase
    .from("sayembara")
    .select(
      `id, owner_id, title, description, category, location, price_label, wa_nego,
       status, created_at, profiles!owner_id ( name )`,
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const row = data as unknown as SayembaraDetailRow;
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user?.id === row.owner_id;

  const [{ count: applicantCount }, { data: relatedRows }] = await Promise.all([
    supabase
      .from("sayembara_applicants")
      .select("id", { count: "exact", head: true })
      .eq("sayembara_id", row.id),
    supabase
      .from("sayembara")
      .select("id, title, description, category, location, price_label, wa_nego, status, created_at")
      .eq("category", row.category)
      .eq("status", "Aktif")
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .neq("id", row.id)
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const related = relatedRows ?? [];

  return (
    <>
      <Header title="Detail Sayembara" />

      <main className="flex-1 px-6 py-8">
        <Link
          href="/sayembara"
          className="mb-6 inline-flex items-center text-[14px] font-bold text-cta hover:text-highlight"
        >
          ← Kembali ke Sayembara
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="rounded-card border-[2.5px] border-ink bg-white shadow-[3px_3px_0_0_rgba(20,20,20,1)] p-6 sm:p-8">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-badge bg-highlight px-3 py-1 text-[12px] leading-4 font-bold text-white">
                {row.category}
              </span>
              <span
                className={`rounded-badge px-3 py-1 text-[12px] leading-4 font-bold ${statusAccent[row.status] ?? statusAccent.Aktif}`}
              >
                {row.status}
              </span>
            </div>

            <h2 className="mt-4 text-2xl leading-[30px] font-bold text-charcoal">
              {row.title}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[14px] font-normal text-muted-foreground">
              <MapPinIcon width={16} height={16} />
              <span>{row.location}</span>
              <span className="mx-1">·</span>
              <span>Diposting {formatRelativeTime(row.created_at)}</span>
            </div>

            {(row.price_label || row.wa_nego) && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {row.price_label && (
                  <span className="text-xl font-bold text-cta">{row.price_label}</span>
                )}
                {row.wa_nego && (
                  <span className="rounded-badge bg-success/10 px-3 py-1 text-[12px] font-bold text-success">
                    Nego via WA
                  </span>
                )}
              </div>
            )}

            <div className="mt-6 border-t border-border-subtle pt-6">
              <p className="text-[12px] font-bold text-muted-foreground">
                Deskripsi Kebutuhan
              </p>
              <p className="mt-2 text-base font-normal leading-6 text-charcoal">
                {row.description}
              </p>
            </div>

            <div className="mt-6 flex border-t border-border-subtle pt-6">
              <ShareButton title={row.title} path={`/sayembara/${row.id}`} />
            </div>

            <div className="mt-6 flex items-center gap-3 border-t border-border-subtle pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-ink">
                <UserIcon width={18} height={18} />
              </div>
              <span className="text-base font-bold text-charcoal">
                {profile?.name ?? "Pengguna Nemsy!"}
              </span>
            </div>

            {isOwner && (
              <div className="mt-4">
                <SayembaraOwnerActions id={row.id} />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {row.status === "Aktif" && !isOwner && (
              <div className="rounded-card border-[2.5px] border-ink bg-white shadow-[3px_3px_0_0_rgba(20,20,20,1)] p-6">
                <h3 className="text-base font-bold text-charcoal">
                  Tertarik menawarkan jasa ini?
                </h3>
                <p className="mt-1 text-[14px] font-normal text-muted-foreground">
                  Daftarkan dirimu sebagai calon penyedia jasa untuk sayembara
                  ini.
                </p>
                <Link
                  href={`/sayembara/${row.id}/daftar`}
                  className="mt-4 flex h-11 w-full items-center justify-center rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black"
                >
                  Daftar Sekarang
                </Link>
              </div>
            )}

            <div className="rounded-card border-[2.5px] border-ink bg-white shadow-[3px_3px_0_0_rgba(20,20,20,1)] p-6">
              {isOwner ? (
                <>
                  <h3 className="text-base font-bold text-charcoal">
                    Pendaftar ({applicantCount ?? 0})
                  </h3>
                  <p className="mt-1 text-[14px] font-normal text-muted-foreground">
                    {(applicantCount ?? 0) > 0
                      ? "Lihat siapa saja yang mendaftar dan hubungi mereka langsung."
                      : "Belum ada yang mendaftar untuk sayembara ini."}
                  </p>
                  <Link
                    href={`/sayembara/${row.id}/pendaftar`}
                    className="mt-4 flex h-11 w-full items-center justify-center rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black"
                  >
                    Lihat Pendaftar
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="text-base font-bold text-charcoal">Pendaftar</h3>
                  <p className="mt-2 text-[14px] font-normal text-muted-foreground">
                    {applicantCount ?? 0} orang sudah mendaftar. Nomor kontak
                    pendaftar hanya bisa dilihat oleh pemilik sayembara ini.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-charcoal">Sayembara Serupa</h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/sayembara/${item.id}`}
                  className="flex flex-col gap-2 rounded-card border-[2.5px] border-ink bg-white p-4 shadow-[3px_3px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5"
                >
                  <span className="w-fit rounded-badge bg-highlight px-2.5 py-1 text-[11px] font-bold text-white">
                    {item.category}
                  </span>
                  <h4 className="line-clamp-2 text-[14px] font-bold leading-5 text-charcoal">
                    {item.title}
                  </h4>
                  <p className="line-clamp-2 text-[12px] font-normal leading-4 text-muted-foreground">
                    {item.description}
                  </p>
                  {item.price_label && (
                    <span className="text-[13px] font-bold text-cta">
                      {item.price_label}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        <TransactionDisclaimer />
      </main>
    </>
  );
}
