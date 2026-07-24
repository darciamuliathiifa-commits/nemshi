import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { RegisterForm } from "@/components/sayembara/register-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DaftarSayembaraPage({
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
    .select("id, title")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  return (
    <>
      <Header title="Daftar Sebagai Penyedia" />

      <main className="flex-1 px-6 py-8">
        <Link
          href={`/sayembara/${data.id}`}
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
            <RegisterForm sayembaraId={data.id} sayembaraTitle={data.title} />
          </div>
        </div>
      </main>
    </>
  );
}
