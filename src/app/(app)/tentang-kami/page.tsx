import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import {
  CheckCircleIcon,
  CompassIcon,
  HeartIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Tentang Kami · Nemsy!",
  description:
    "Kenapa Nemsy! dibuat, apa yang jadi tanggung jawab kami, dan apa yang bukan.",
};

const doItems = [
  {
    icon: CompassIcon,
    title: "Menyediakan direktori yang mudah dicari",
    description:
      "Satu tempat buat Masisir cari produk, jasa, dan bantuan dari sesama komunitas, tanpa perlu tanya ke sana-sini di grup WhatsApp yang cepat tenggelam.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Memoderasi konten yang naik",
    description:
      "Setiap iklan divalidasi sebelum tayang, untuk menyaring konten terlarang, menyesatkan, atau melanggar aturan publikasi.",
  },
  {
    icon: HeartIcon,
    title: "Menjaga akses tetap terjangkau",
    description:
      "Slot iklan dan sayembara pertama selalu gratis. Paket berbayar kami jaga di harga yang wajar buat kantong mahasiswa, bukan buat mengejar untung sebesar-besarnya.",
  },
  {
    icon: UsersIcon,
    title: "Mendengarkan masukan komunitas",
    description:
      "Nemsy! terus berubah berdasarkan masukan langsung dari pengguna: fitur, perbaikan, dan desain di sini lahir dari apa yang komunitas benar-benar butuhkan.",
  },
];

const notResponsibleItems = [
  "Transaksi, pembayaran, atau serah terima antar pengguna. Semua kesepakatan dilakukan langsung antara pembeli dan penjual lewat WhatsApp.",
  "Kualitas, keaslian, atau kesesuaian produk dan jasa yang ditawarkan pengguna lain.",
  "Kerugian akibat kelalaian, penipuan, atau itikad buruk dari salah satu pihak dalam sebuah transaksi.",
  "Menjadi rekening bersama (escrow), perantara pembayaran, atau pihak yang menjamin suatu kesepakatan.",
];

export default function TentangKamiPage() {
  return (
    <>
      <Header title="Tentang Kami" containerClassName="max-w-3xl" />

      <main className="mx-auto w-full max-w-3xl px-6 py-8">
        <section className="relative overflow-hidden rounded-card border-[2.5px] border-ink bg-gradient-to-br from-brand-dark to-brand bg-dot-pattern p-8 text-center shadow-[5px_5px_0_0_rgba(20,20,20,1)] sm:p-12">
          <h1 className="text-3xl font-black tracking-tight text-charcoal sm:text-4xl">
            Tentang Nemsy!
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-[15px] font-normal leading-6 text-charcoal/70">
            Nemsy! dibangun oleh Dar Dev buat satu alasan sederhana: Masisir
            butuh tempat yang gampang buat jualan, cari jasa, dan saling
            bantu, tanpa ribet.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-charcoal">Kenapa Nemsy! Dibuat</h2>
          <p className="mt-2 text-[14px] font-normal leading-6 text-muted-foreground">
            Selama ini, kebutuhan jual-beli dan cari jasa antar Masisir
            tersebar di banyak grup WhatsApp yang riuh dan cepat tenggelam.
            Info bagus gampang kelewat, dan susah tahu siapa yang bisa
            dipercaya. Dar Dev membangun Nemsy! supaya komunitas Masisir
            punya satu portal yang rapi, gampang dicari, dan tetap
            terjangkau, dibuat oleh mahasiswa, untuk mahasiswa.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-charcoal">Yang Kami Lakukan</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {doItems.map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-2 rounded-card border-[2.5px] border-ink bg-white p-5 shadow-[3px_3px_0_0_rgba(20,20,20,1)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-charcoal">
                  <item.icon width={18} height={18} />
                </span>
                <h3 className="text-base font-bold text-charcoal">{item.title}</h3>
                <p className="text-[13px] font-normal leading-5 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-charcoal">
            Yang Bukan Tanggung Jawab Kami
          </h2>
          <p className="mt-2 text-[14px] font-normal leading-6 text-muted-foreground">
            Supaya jelas sejak awal: Nemsy! adalah platform direktori yang
            mempertemukan pengguna, bukan pihak dalam transaksi itu sendiri.
            Ini artinya kami tidak bertanggung jawab atas:
          </p>
          <div className="mt-4 flex flex-col gap-3 rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[3px_3px_0_0_rgba(20,20,20,1)]">
            {notResponsibleItems.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <ShieldCheckIcon
                  width={18}
                  height={18}
                  className="mt-0.5 shrink-0 text-error"
                />
                <p className="text-[14px] font-normal leading-5 text-charcoal">
                  {item}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[13px] font-normal leading-5 text-muted-foreground">
            Selalu berhati-hati, verifikasi identitas, dan sepakati detail
            transaksi langsung dengan pihak terkait sebelum membayar atau
            serah terima.
          </p>
        </section>

        <section className="mt-10 rounded-card border-[2.5px] border-ink bg-white p-6 text-center shadow-[3px_3px_0_0_rgba(20,20,20,1)] sm:p-8">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand text-charcoal">
            <HeartIcon width={22} height={22} />
          </span>
          <h2 className="mt-3 text-xl font-bold text-charcoal">
            Dibangun untuk Komunitas
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-[14px] font-normal leading-6 text-muted-foreground">
            Slot pertama selalu gratis, harga paket kami jaga tetap
            terjangkau, dan setiap masukan dari komunitas benar-benar kami
            dengar. Nemsy! akan terus berkembang selama itu berarti hidup
            di Mesir jadi sedikit lebih mudah buat kita semua.
          </p>
          <p className="mt-4 text-[12px] font-bold text-charcoal/50">
            Dar Dev
          </p>
        </section>

        <div className="mt-10 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center">
          <Link
            href="/jelajahi"
            className="flex h-11 items-center justify-center gap-1.5 rounded-pill bg-charcoal px-6 text-[14px] font-bold text-white transition-colors hover:bg-black"
          >
            <CompassIcon width={16} height={16} />
            Mulai Eksplor
          </Link>
          <Link
            href="/sayembara"
            className="flex h-11 items-center justify-center gap-1.5 rounded-pill border-2 border-ink px-6 text-[14px] font-bold text-charcoal transition-colors hover:bg-surface"
          >
            <MegaphoneIcon width={16} height={16} />
            Lihat Sayembara
          </Link>
        </div>

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
