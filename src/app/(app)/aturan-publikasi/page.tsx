import { Header } from "@/components/layout/header";

const rules = [
  {
    title: "Moderasi Admin",
    description:
      "Setiap iklan yang dipasang akan divalidasi oleh admin sebelum tayang di halaman Eksplor, untuk mencegah konten terlarang atau menyesatkan.",
  },
  {
    title: "Konten yang Dilarang",
    description:
      "Barang ilegal, konten dewasa, penipuan, MLM/skema piramida, serta produk atau jasa yang melanggar hukum Mesir maupun Indonesia tidak diperbolehkan.",
  },
  {
    title: "Informasi yang Jelas & Jujur",
    description:
      "Judul, deskripsi, harga, dan kondisi barang harus sesuai dengan kenyataan. Foto yang digunakan harus mewakili produk atau jasa yang sebenarnya.",
  },
  {
    title: "Masa Kedaluwarsa Otomatis",
    description:
      "Iklan memiliki masa tayang terbatas dan akan berstatus Kedaluwarsa secara otomatis agar katalog tetap relevan. Perpanjang masa tayang kapan saja dari halaman Iklan Saya.",
  },
  {
    title: "Satu Transaksi, Satu Kesepakatan",
    description:
      "Nemsy! tidak menyediakan rekening bersama (escrow) atau mengambil komisi. Seluruh kesepakatan harga dan transaksi menjadi tanggung jawab penuh pengguna melalui WhatsApp.",
  },
  {
    title: "Laporkan Pelanggaran",
    description:
      "Jika menemukan iklan yang mencurigakan atau melanggar aturan, gunakan tombol Laporkan pada halaman detail iklan agar admin dapat meninjaunya.",
  },
];

export default function AturanPublikasiPage() {
  return (
    <>
      <Header title="Aturan Publikasi" containerClassName="max-w-2xl" />

      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-xl font-bold text-charcoal">
            Aturan Publikasi & Moderasi
          </h2>
          <p className="mt-1 text-[14px] font-normal text-muted-foreground">
            Panduan ini menjaga Nemsy! tetap aman dan relevan untuk komunitas
            Masisir.
          </p>

          <div className="mt-6 flex flex-col gap-4">
            {rules.map((rule) => (
              <div
                key={rule.title}
                className="rounded-card border border-border-subtle bg-white p-6"
              >
                <h3 className="text-base font-bold text-charcoal">
                  {rule.title}
                </h3>
                <p className="mt-2 text-[14px] font-normal leading-5 text-muted-foreground">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
