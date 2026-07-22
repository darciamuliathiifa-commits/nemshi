import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:px-8">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
              N
            </span>
            <span className="text-lg font-extrabold text-text">Nemshi</span>
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            Direktori iklan jasa untuk Masisir. Nemshi menjamin exposure (tampilan dan klik),
            bukan kepastian kesepakatan kerja — seluruh negosiasi dan transaksi dilakukan mandiri
            di WhatsApp.
          </p>
        </div>

        <nav className="flex gap-8 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-text">Jelajahi</span>
            <Link href="/jelajahi" className="text-text-secondary hover:text-primary">
              Iklan Jasa
            </Link>
            <Link href="/sayembara" className="text-text-secondary hover:text-primary">
              Cari Jasa
            </Link>
            <Link href="/kategori" className="text-text-secondary hover:text-primary">
              Kategori
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-text">Akun</span>
            <Link href="/pasang-iklan" className="text-text-secondary hover:text-primary">
              Pasang Iklan
            </Link>
            <Link href="/bayar" className="text-text-secondary hover:text-primary">
              Paket Plus
            </Link>
          </div>
        </nav>
      </div>
      <div className="border-t border-black/5 px-4 py-4 text-center text-xs text-text-secondary">
        © {new Date().getFullYear()} Nemshi — Direktori Iklan Jasa Masisir.
      </div>
    </footer>
  );
}
