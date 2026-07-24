import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { RegisterForm } from "@/components/sayembara/register-form";
import { getSayembaraById } from "@/lib/mock-sayembara";

export default async function DaftarSayembaraPage({
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
      <Header title="Daftar Sebagai Penyedia" />

      <main className="flex-1 px-6 py-8">
        <Link
          href={`/sayembara/${item.id}`}
          className="mb-6 inline-flex items-center text-[14px] font-bold text-cta hover:text-highlight"
        >
          ← Kembali ke Detail Sayembara
        </Link>

        <div className="mx-auto max-w-xl">
          <h2 className="text-xl font-bold text-charcoal">
            Daftar Sebagai Penyedia Jasa
          </h2>
          <p className="mt-1 text-[14px] font-normal text-muted-foreground">
            Isi identitas yang jelas agar pemilik sayembara bisa
            menghubungimu.
          </p>

          <div className="mt-6">
            <RegisterForm sayembaraId={item.id} sayembaraTitle={item.title} />
          </div>
        </div>
      </main>
    </>
  );
}
