import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { RegisterForm } from "@/components/sayembara/register-form";
import { ChatIcon } from "@/components/icons";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface OwnerProfileRow {
  name: string;
  whatsapp_number: string | null;
}

interface SayembaraRow {
  id: string;
  title: string;
  profiles: OwnerProfileRow | OwnerProfileRow[] | null;
}

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
    .select("id, title, profiles!owner_id ( name, whatsapp_number )")
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const row = data as unknown as SayembaraRow;
  const owner = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  const whatsappHref = owner?.whatsapp_number
    ? `https://wa.me/${owner.whatsapp_number}?text=${encodeURIComponent(
        `Halo ${owner.name}, saya tertarik menawarkan bantuan untuk sayembara "${row.title}" di Nemshi. Boleh saya tahu detailnya lebih lanjut?`,
      )}`
    : null;

  return (
    <>
      <Header title="Daftar Sebagai Penyedia" />

      <main className="flex-1 px-6 py-8">
        <Link
          href={`/sayembara/${row.id}`}
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

          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-3 rounded-card border-[2.5px] border-ink bg-white p-5 shadow-[3px_3px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                <ChatIcon width={20} height={20} />
              </span>
              <div>
                <p className="text-[14px] font-bold text-charcoal">
                  Chat Langsung via WhatsApp
                </p>
                <p className="mt-0.5 text-[12px] font-normal text-muted-foreground">
                  Pesan otomatis sudah disiapkan, tinggal kirim ke {owner?.name}.
                </p>
              </div>
            </a>
          )}

          <div className="mt-6">
            {whatsappHref && (
              <p className="mb-3 text-[12px] font-bold text-muted-foreground">
                Atau isi formulir di bawah untuk mendaftar secara resmi:
              </p>
            )}
            <RegisterForm sayembaraId={row.id} sayembaraTitle={row.title} />
          </div>
        </div>
      </main>
    </>
  );
}
