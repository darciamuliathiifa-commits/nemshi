import Link from "next/link";
import { getCategories } from "@/lib/listings";

export default async function KategoriPage() {
  const categories = await getCategories();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-2">
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          ← Kembali ke Jelajahi Iklan Jasa
        </Link>
        <h1 className="text-2xl font-bold text-text">Kategori Jasa</h1>
        <p className="text-text-secondary">
          Jelajahi jasa berdasarkan kategori yang tersedia di Nemshi.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/?category=${category.slug}`}
            className="flex flex-col items-center gap-2 rounded-xl border border-black/5 bg-white p-6 text-center transition-shadow hover:shadow-lg"
          >
            <span className="text-3xl">{category.icon}</span>
            <span className="font-medium text-text">{category.name}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
