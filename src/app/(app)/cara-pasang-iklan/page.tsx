import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import {
  CheckCircleIcon,
  CompassIcon,
  EditIcon,
  ListIcon,
  PlusCircleIcon,
  SparklesIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Cara Pasang Iklan · Nemsy!",
  description: "Panduan singkat pasang iklan produk atau jasa di Nemsy!, 3 langkah, gratis buat iklan pertama.",
};

const steps = [
  {
    icon: ListIcon,
    title: "1. Pilih Tipe & Kategori",
    description:
      "Pilih Produk atau Jasa, terus pilih kategori yang paling sesuai (Makanan & Minuman, Kreatif & Digital, dan lainnya).",
  },
  {
    icon: EditIcon,
    title: "2. Isi Detail Iklan",
    description:
      "Judul, deskripsi, lokasi, harga, sama foto. Kalau harganya nggak tetap, centang \"Harga bervariasi\" — nggak perlu isi nominal. Klik foto sampul buat atur bagian yang paling kelihatan pas iklan tampil sebagai kartu kecil.",
  },
  {
    icon: CheckCircleIcon,
    title: "3. Cek & Publikasikan",
    description:
      "Periksa dulu semua detailnya di halaman ringkasan, baru klik Publikasikan. Iklan langsung tayang, kecuali sistem mendeteksi hal yang perlu ditinjau dulu oleh admin.",
  },
];

const tips = [
  "Iklan pertama selalu gratis, nggak ada biaya apa pun.",
  "Nomor WhatsApp wajib diisi sekali di awal, biar pembeli bisa langsung chat dari iklanmu.",
  "Foto yang jelas dan terang bikin iklan lebih menarik dan cepat dilirik.",
  "Nulis link (http/https) di deskripsi otomatis jadi bisa diklik, misalnya link menu atau portofolio.",
];

export default function CaraPasangIklanPage() {
  return (
    <>
      <Header title="Cara Pasang Iklan" containerClassName="max-w-3xl" />

      <main className="mx-auto w-full max-w-3xl px-6 py-8">
        <section className="relative overflow-hidden rounded-card border-[2.5px] border-ink bg-gradient-to-br from-brand-dark to-brand bg-dot-pattern p-8 text-center shadow-[5px_5px_0_0_rgba(20,20,20,1)] sm:p-12">
          <h1 className="text-3xl font-black tracking-tight text-charcoal sm:text-4xl">
            Pasang Iklan, 3 Langkah Doang
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] font-normal leading-6 text-charcoal/70">
            Nggak sampai 5 menit, dan iklan pertamamu gratis. Ini panduannya.
          </p>
        </section>

        <section className="mt-10">
          <div className="flex flex-col gap-4">
            {steps.map((step) => (
              <div
                key={step.title}
                className="flex flex-col gap-2 rounded-card border-[2.5px] border-ink bg-white p-5 shadow-[3px_3px_0_0_rgba(20,20,20,1)] sm:flex-row sm:items-start sm:gap-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-charcoal">
                  <step.icon width={18} height={18} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-charcoal">{step.title}</h3>
                  <p className="mt-1 text-[13px] font-normal leading-5 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-charcoal">Tips Biar Iklannya Lebih Laku</h2>
          <div className="mt-4 flex flex-col gap-3 rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[3px_3px_0_0_rgba(20,20,20,1)]">
            {tips.map((tip) => (
              <div key={tip} className="flex items-start gap-3">
                <SparklesIcon
                  width={16}
                  height={16}
                  className="mt-0.5 shrink-0 text-cta"
                />
                <p className="text-[14px] font-normal leading-5 text-charcoal">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-card border-[2.5px] border-ink bg-white p-6 text-center shadow-[3px_3px_0_0_rgba(20,20,20,1)] sm:p-8">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand text-charcoal">
            <PlusCircleIcon width={22} height={22} />
          </span>
          <h2 className="mt-3 text-xl font-bold text-charcoal">Siap Coba?</h2>
          <p className="mx-auto mt-2 max-w-xl text-[14px] font-normal leading-6 text-muted-foreground">
            Login pakai Google, terus langsung mulai pasang iklan pertamamu.
          </p>
          <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/pasang-iklan"
              className="flex h-11 items-center justify-center gap-1.5 rounded-pill bg-charcoal px-6 text-[14px] font-bold text-white transition-colors hover:bg-black"
            >
              <PlusCircleIcon width={16} height={16} />
              Pasang Iklan
            </Link>
            <Link
              href="/jelajahi"
              className="flex h-11 items-center justify-center gap-1.5 rounded-pill border-2 border-ink px-6 text-[14px] font-bold text-charcoal transition-colors hover:bg-surface"
            >
              <CompassIcon width={16} height={16} />
              Lihat Iklan Dulu
            </Link>
          </div>
        </section>

        <div className="mt-8 flex items-center justify-center gap-2 text-[12px] font-normal text-charcoal/40">
          <CheckCircleIcon width={14} height={14} />
          <Link href="/aturan-publikasi" className="hover:text-charcoal/70">
            Baca juga Aturan Publikasi
          </Link>
        </div>
      </main>
    </>
  );
}
