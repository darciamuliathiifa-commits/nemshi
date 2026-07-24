import Link from "next/link";
import { Header } from "@/components/layout/header";
import { mockSayembara } from "@/lib/mock-sayembara";

const statusAccent: Record<string, string> = {
  Aktif: "bg-success text-white",
  Terjual: "bg-charcoal text-white",
  Selesai: "bg-charcoal text-white",
  Kedaluwarsa: "bg-muted text-white",
  Ditutup: "bg-error text-white",
};

export default function SayembaraPage() {
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockSayembara.map((item) => (
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
                  className={`rounded-badge px-3 py-1 text-[12px] leading-4 font-bold ${statusAccent[item.status]}`}
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

              <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-3">
                <span className="text-[12px] font-bold text-muted-foreground">
                  {item.location}
                </span>
                <span className="rounded-badge bg-surface px-2.5 py-1 text-[12px] font-bold text-charcoal">
                  {item.applicantCount} pendaftar
                </span>
              </div>

              <div className="flex items-center justify-between text-[12px] text-muted-foreground">
                <span>{item.ownerName}</span>
                <span>{item.postedAt}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
