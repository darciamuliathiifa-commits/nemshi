import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { UserIcon } from "@/components/icons";
import { getSayembaraById } from "@/lib/mock-sayembara";

const statusAccent: Record<string, string> = {
  Aktif: "bg-success text-white",
  Terjual: "bg-charcoal text-white",
  Selesai: "bg-charcoal text-white",
  Kedaluwarsa: "bg-muted text-white",
  Ditutup: "bg-error text-white",
};

export default async function SayembaraDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getSayembaraById(id);

  if (!item) {
    notFound();
  }

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

        <div className="mx-auto max-w-2xl">
          <div className="rounded-card border-[2.5px] border-ink bg-white shadow-[3px_3px_0_0_rgba(20,20,20,1)] p-6">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-badge bg-highlight px-3 py-1 text-[12px] leading-4 font-bold text-white">
                {item.category}
              </span>
              <span
                className={`rounded-badge px-3 py-1 text-[12px] leading-4 font-bold ${statusAccent[item.status]}`}
              >
                {item.status}
              </span>
            </div>

            <h2 className="mt-4 text-2xl leading-[30px] font-bold text-charcoal">
              {item.title}
            </h2>

            <div className="mt-3 flex items-center gap-1.5 text-[14px] font-normal text-muted-foreground">
              <span>{item.location}</span>
              <span className="mx-1">·</span>
              <span>Diposting {item.postedAt}</span>
            </div>

            <div className="mt-6 border-t border-border-subtle pt-6">
              <p className="text-[12px] font-bold text-muted-foreground">
                Deskripsi Kebutuhan
              </p>
              <p className="mt-2 text-base font-normal leading-6 text-charcoal">
                {item.description}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border-subtle pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-ink">
                  <UserIcon width={18} height={18} />
                </div>
                <span className="text-base font-bold text-charcoal">
                  {item.ownerName}
                </span>
              </div>
              <span className="rounded-badge bg-surface px-2.5 py-1 text-[12px] font-bold text-charcoal">
                {item.applicantCount} pendaftar
              </span>
            </div>
          </div>

          {item.status === "Aktif" && (
            <div className="mt-4 rounded-card border-[2.5px] border-ink bg-white shadow-[3px_3px_0_0_rgba(20,20,20,1)] p-6">
              <h3 className="text-base font-bold text-charcoal">
                Tertarik menawarkan jasa ini?
              </h3>
              <p className="mt-1 text-[14px] font-normal text-muted-foreground">
                Daftarkan dirimu sebagai calon penyedia jasa untuk sayembara ini.
              </p>
              <Link
                href={`/sayembara/${item.id}/daftar`}
                className="mt-4 flex h-11 w-full items-center justify-center rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black"
              >
                Daftar Sekarang
              </Link>
            </div>
          )}

          <div className="mt-4 rounded-card border-[2.5px] border-ink bg-white shadow-[3px_3px_0_0_rgba(20,20,20,1)] p-6">
            <h3 className="text-base font-bold text-charcoal">
              Daftar Pendaftar ({item.applicants.length})
            </h3>

            {item.applicants.length > 0 ? (
              <div className="mt-4 flex flex-col gap-3">
                {item.applicants.map((applicant) => (
                  <div
                    key={applicant.contact}
                    className="flex items-center justify-between gap-3 rounded-input border border-border-subtle px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/20 text-ink">
                        <UserIcon width={16} height={16} />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-charcoal">
                          {applicant.name}
                        </p>
                        <p className="text-[12px] font-normal text-muted-foreground">
                          {applicant.contact}
                        </p>
                      </div>
                    </div>
                    <span className="text-[12px] text-muted-foreground">
                      {applicant.appliedAt}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-[14px] font-normal text-muted-foreground">
                Belum ada yang mendaftar untuk sayembara ini.
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
