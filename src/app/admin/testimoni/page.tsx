"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StarRating } from "@/components/star-rating";

type AdminTestimonial = {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  isHidden: boolean;
  createdAt: string;
  revieweeUserId: string;
  revieweeName: string;
};

export default function AdminTestimoniPage() {
  const [items, setItems] = useState<AdminTestimonial[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/testimonials")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  async function toggleHidden(id: string, isHidden: boolean) {
    const response = await fetch(`/api/admin/testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden: !isHidden }),
    });
    const updated = await response.json();
    setItems((prev) => prev?.map((item) => (item.id === id ? { ...item, ...updated } : item)) ?? null);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    setItems((prev) => prev?.filter((item) => item.id !== id) ?? null);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-2xl font-bold text-text">Kelola Testimoni</h1>
      <p className="mb-6 text-sm text-text-secondary">
        Halaman moderasi sementara — akan dipindahkan ke Dasbor Admin (fitur 08) begitu autentikasi
        admin tersedia.
      </p>

      {!items ? (
        <p className="text-text-secondary">Memuat testimoni...</p>
      ) : items.length === 0 ? (
        <p className="text-text-secondary">Belum ada testimoni yang masuk.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl border border-black/5 bg-white p-4">
              <div className="mb-1 flex items-center justify-between">
                <Link
                  href={`/profil/${item.revieweeUserId}`}
                  className="font-medium text-text hover:underline"
                >
                  Untuk: {item.revieweeName}
                </Link>
                <StarRating rating={item.rating} size="text-sm" />
              </div>
              <p className="mb-2 text-sm text-text-secondary">
                <span className="font-medium text-text">{item.reviewerName}</span>: {item.comment}
              </p>
              <div className="flex items-center gap-3">
                {item.isHidden && (
                  <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs font-medium text-text-secondary">
                    Disembunyikan
                  </span>
                )}
                <button
                  onClick={() => toggleHidden(item.id, item.isHidden)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {item.isHidden ? "Tampilkan" : "Sembunyikan"}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
