"use client";

import { useEffect, useState } from "react";
import { formatRupiah } from "@/lib/format";

type Category = { id: string; name: string; slug: string; icon: string; isActive: boolean };
type PendingRefund = {
  orderId: string;
  amount: number;
  paidAt: string | null;
  listingId: string;
  listingTitle: string;
  moderationReason: string | null;
  userFullName: string;
};

export default function KategoriRefundPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [refunds, setRefunds] = useState<PendingRefund[] | null>(null);

  function loadCategories() {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then(setCategories);
  }

  function loadRefunds() {
    fetch("/api/admin/refunds")
      .then((r) => r.json())
      .then(setRefunds);
  }

  useEffect(() => {
    loadCategories();
    loadRefunds();
  }, []);

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !icon.trim()) return;
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, icon }),
    });
    setName("");
    setIcon("");
    loadCategories();
  }

  async function handleToggleActive(category: Category) {
    await fetch(`/api/admin/categories/${category.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !category.isActive }),
    });
    loadCategories();
  }

  async function handleConfirmRefund(orderId: string) {
    await fetch(`/api/admin/refunds/${orderId}/confirm`, { method: "POST" });
    loadRefunds();
  }

  return (
    <div className="rounded-3xl bg-white p-6 border border-black/10 sm:p-8">
      <h1 className="mb-6 text-2xl font-bold text-text">Manajemen Kategori & Refund</h1>

      <section className="mb-8">
        <h2 className="mb-3 font-semibold text-text">Kategori Jasa</h2>

        <form onSubmit={handleAddCategory} className="mb-4 flex gap-2">
          <input
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="Ikon (emoji)"
            className="w-24 rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama kategori baru"
            className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
          />
          <button
            type="submit"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Tambah
          </button>
        </form>

        {!categories ? (
          <p className="text-text-secondary">Memuat...</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between bg-surface px-4 py-3"
              >
                <span>
                  {category.icon} {category.name}
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      category.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-black/10 text-text-secondary"
                    }`}
                  >
                    {category.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                  <button
                    onClick={() => handleToggleActive(category)}
                    className="text-sm font-medium text-accent hover:underline"
                  >
                    {category.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-text">Permintaan Refund</h2>
        {!refunds ? (
          <p className="text-text-secondary">Memuat...</p>
        ) : refunds.length === 0 ? (
          <p className="text-text-secondary">Tidak ada permintaan refund yang menunggu.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {refunds.map((refund) => (
              <li
                key={refund.orderId}
                className="rounded-2xl bg-surface p-4"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium text-text">{refund.listingTitle}</span>
                  <span className="font-semibold text-primary">
                    {formatRupiah(refund.amount)}
                  </span>
                </div>
                <p className="mb-2 text-sm text-text-secondary">
                  {refund.userFullName}
                  {refund.moderationReason && ` · Ditolak: ${refund.moderationReason}`}
                </p>
                <button
                  onClick={() => handleConfirmRefund(refund.orderId)}
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                >
                  Konfirmasi Refund Selesai
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
