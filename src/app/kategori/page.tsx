import Link from "next/link";
import { getCategories } from "@/lib/listings";

// Daftar kategori bisa berubah (admin nonaktifkan kategori) — jangan
// biarkan Next.js static-optimize halaman ini jadi snapshot beku saat build.
export const dynamic = "force-dynamic";

export default async function KategoriPage() {
  const categories = await getCategories();

  return (
    <div className="bg-surface-tint">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm shadow-black/5 sm:p-10">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-primary"
          >
            ← Kembali ke Jelajahi Iklan Jasa
          </Link>
          <h1 className="font-display text-3xl font-semibold text-text">Kategori Jasa</h1>
          <p className="mt-2 text-text-secondary">
            Jelajahi jasa berdasarkan kategori yang tersedia di Nemshi.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category, index) => {
              const tint = ["bg-primary", "bg-accent", "bg-text"][index % 3];
              return (
                <Link
                  key={category.id}
                  href={`/?category=${category.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-black/5 bg-surface p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white transition-transform group-hover:scale-105 ${tint}`}
                  >
                    {category.icon}
                  </span>
                  <span className="font-medium text-text">{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
