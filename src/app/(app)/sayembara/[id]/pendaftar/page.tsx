import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { ChatIcon, UserIcon } from "@/components/icons";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatRelativeTime } from "@/lib/format-relative-time";

interface ApplicantRow {
  id: string;
  applicant_name: string;
  contact: string;
  created_at: string;
}

export default async function SayembaraPendaftarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: sayembara } = await supabase
    .from("sayembara")
    .select("id, title, owner_id")
    .eq("id", id)
    .maybeSingle();

  if (!sayembara) {
    notFound();
  }
  if (sayembara.owner_id !== user.id) {
    notFound();
  }

  const { data: applicantRows } = await supabase
    .from("sayembara_applicants")
    .select("id, applicant_name, contact, created_at")
    .eq("sayembara_id", id)
    .order("created_at", { ascending: false });

  const applicants = (applicantRows ?? []) as ApplicantRow[];

  return (
    <>
      <Header title="Pendaftar Sayembara" containerClassName="max-w-4xl" />

      <main className="flex-1 px-6 py-8">
        <Link
          href={`/sayembara/${sayembara.id}`}
          className="mb-6 inline-flex items-center text-[14px] font-bold text-cta hover:text-highlight"
        >
          ← Kembali ke Detail Sayembara
        </Link>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-charcoal">{sayembara.title}</h2>
          <p className="mt-1 text-[14px] font-normal text-muted-foreground">
            {applicants.length} orang mendaftar sebagai penyedia jasa untuk
            sayembara ini.
          </p>
        </div>

        {applicants.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {applicants.map((applicant) => {
              const digits = applicant.contact.replace(/\D/g, "");
              const whatsappHref = digits
                ? `https://wa.me/${digits}?text=${encodeURIComponent(
                    `Halo ${applicant.applicant_name}, terima kasih sudah mendaftar untuk sayembara "${sayembara.title}" di Nemsy!`,
                  )}`
                : null;

              return (
                <div
                  key={applicant.id}
                  className="flex flex-col gap-3 rounded-card border-[2.5px] border-ink bg-white p-5 shadow-[3px_3px_0_0_rgba(20,20,20,1)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-cream text-charcoal">
                      <UserIcon width={20} height={20} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-base font-bold text-charcoal">
                        {applicant.applicant_name}
                      </p>
                      <p className="text-[12px] font-normal text-muted-foreground">
                        Mendaftar {formatRelativeTime(applicant.created_at)}
                      </p>
                    </div>
                  </div>

                  {whatsappHref ? (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 items-center justify-center gap-2 rounded-pill bg-success text-[14px] font-bold text-white transition-colors hover:brightness-90"
                    >
                      <ChatIcon width={16} height={16} />
                      Chat WA
                    </a>
                  ) : (
                    <p className="text-[13px] font-normal text-muted-foreground">
                      Kontak: {applicant.contact}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border-strong py-16 text-center">
            <p className="text-base font-normal text-charcoal">
              Belum ada yang mendaftar.
            </p>
            <p className="mt-1 text-[14px] font-normal text-muted-foreground">
              Bagikan sayembaramu supaya lebih banyak orang tahu.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
