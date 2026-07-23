import Link from "next/link";
import { requireAdminForPage } from "@/lib/admin";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminForPage();

  return (
    <div className="min-h-screen bg-surface-tint">
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="w-60 shrink-0">
          <div className="sticky top-6 bg-white p-4 border border-black/10">
            <Link
              href="/"
              className="mb-4 flex items-center gap-2 px-2 text-sm font-medium text-text-secondary hover:text-primary"
            >
              ← Kembali ke Nemshi
            </Link>
            <div className="mb-4 flex items-center gap-2 px-2">
              <span className="flex h-8 w-8 items-center justify-center bg-primary text-sm font-bold text-white">
                N
              </span>
              <h2 className="text-base font-bold text-text">Dasbor Admin</h2>
            </div>
            <AdminNav />
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
