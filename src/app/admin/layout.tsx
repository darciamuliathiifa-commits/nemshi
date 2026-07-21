import Link from "next/link";
import { requireAdminForPage } from "@/lib/admin";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/moderasi", label: "Antrean Moderasi" },
  { href: "/admin/jasa", label: "Kelola Jasa" },
  { href: "/admin/pengguna", label: "Kelola Pengguna" },
  { href: "/admin/testimoni", label: "Testimoni" },
  { href: "/admin/kategori", label: "Kategori & Refund" },
  { href: "/admin/transaksi", label: "Pantau Transaksi" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminForPage();

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <aside className="w-56 shrink-0">
        <Link href="/" className="mb-6 block text-sm font-medium text-primary hover:underline">
          ← Kembali ke Nemshi
        </Link>
        <h2 className="mb-4 text-lg font-bold text-text">Dasbor Admin</h2>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-2 text-sm font-medium text-text-secondary hover:bg-black/5 hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
