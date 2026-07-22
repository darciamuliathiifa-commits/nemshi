import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-surface-tint to-white px-4 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white">
        N
      </span>
      <h1 className="font-display text-3xl font-semibold text-text">Halaman tidak ditemukan</h1>
      <p className="max-w-sm text-sm text-text-secondary">
        Iklan atau halaman yang kamu cari mungkin sudah dihapus, kedaluwarsa, atau alamatnya
        salah ketik.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
}
