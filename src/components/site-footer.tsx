import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="w-full rounded-t-[2.5rem] bg-text text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:px-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-text">
              N
            </span>
            <span className="text-xl font-bold">Nemshi</span>
          </div>
          <p className="mt-3 text-sm text-white/60">
            Direktori iklan jasa untuk Masisir. Nemshi menjamin exposure (tampilan dan klik),
            bukan kepastian kesepakatan kerja — seluruh negosiasi dan transaksi dilakukan mandiri
            di WhatsApp.
          </p>
        </div>

        <nav className="flex gap-12 text-sm">
          <div className="flex flex-col gap-3">
            <span className="font-semibold">Jelajahi</span>
            <Link href="/jelajahi" className="text-white/60 hover:text-white">
              Iklan Jasa
            </Link>
            <Link href="/sayembara" className="text-white/60 hover:text-white">
              Cari Jasa
            </Link>
            <Link href="/kategori" className="text-white/60 hover:text-white">
              Kategori
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-semibold">Akun</span>
            <Link href="/pasang-iklan" className="text-white/60 hover:text-white">
              Pasang Iklan
            </Link>
            <Link href="/bayar" className="text-white/60 hover:text-white">
              Paket Plus
            </Link>
          </div>
        </nav>
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-white/50 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Nemshi — Direktori Iklan Jasa Masisir.
      </div>
    </footer>
  );
}
