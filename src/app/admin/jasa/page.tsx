"use client";

import { useEffect, useState } from "react";
import { ListingStatusBadge } from "@/components/listing-status-badge";
import { Modal } from "@/components/modal";

type AdminListing = {
  id: string;
  title: string;
  status: string;
  type: string;
  createdAt: string;
  publishedAt: string | null;
  ownerName: string;
  categoryName: string;
  areaName: string;
};

type ListingDetail = AdminListing & {
  description: string;
  whatsappLink: string;
  priceType: string;
  priceMin: number | null;
  priceMax: number | null;
  moderationReason: string | null;
  ownerEmail: string;
  photos: string[];
};

const STATUS_OPTIONS = ["", "Pending_Moderation", "Active", "Expired", "Rejected", "Suspended"];

export default function KelolaJasaPage() {
  const [listings, setListings] = useState<AdminListing[] | null>(null);
  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<ListingDetail | null>(null);
  const [reason, setReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (query) params.set("q", query);
    fetch(`/api/admin/listings?${params.toString()}`)
      .then((r) => r.json())
      .then(setListings);
  }, [status, query]);

  async function openDetail(id: string) {
    const response = await fetch(`/api/admin/listings/${id}`);
    setDetail(await response.json());
    setReason("");
  }

  async function refreshList() {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (query) params.set("q", query);
    const listingsList = await fetch(`/api/admin/listings?${params.toString()}`).then((r) =>
      r.json()
    );
    setListings(listingsList);
  }

  async function handleSuspend() {
    if (!detail || !reason.trim()) return;
    setActionLoading(true);
    await fetch(`/api/admin/listings/${detail.id}/suspend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    setActionLoading(false);
    setDetail(null);
    refreshList();
  }

  async function handleDelete() {
    if (!detail) return;
    setActionLoading(true);
    await fetch(`/api/admin/listings/${detail.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    setActionLoading(false);
    setDetail(null);
    refreshList();
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm shadow-black/5 sm:p-8">
      <h1 className="mb-2 text-2xl font-bold text-text">Kelola Jasa</h1>
      <p className="mb-6 text-sm text-text-secondary">
        Tinjau semua iklan dan permintaan jasa; tangguhkan atau hapus yang melanggar.
      </p>

      <div className="mb-4 flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari judul..."
          className="w-full max-w-sm rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">Semua Status</option>
          {STATUS_OPTIONS.filter(Boolean).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {!listings ? (
        <p className="text-text-secondary">Memuat...</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 text-text-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">Judul</th>
                <th className="px-4 py-3 font-medium">Pengunggah</th>
                <th className="px-4 py-3 font-medium">Kategori · Area</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id} className="border-b border-black/10 last:border-0">
                  <td className="px-4 py-3 text-text">{listing.title}</td>
                  <td className="px-4 py-3 text-text-secondary">{listing.ownerName}</td>
                  <td className="px-4 py-3 text-text-secondary">
                    {listing.categoryName} · {listing.areaName}
                  </td>
                  <td className="px-4 py-3">
                    <ListingStatusBadge status={listing.status} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openDetail(listing.id)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {detail && (
        <Modal onClose={() => setDetail(null)}>
          <h2 className="mb-1 text-lg font-bold text-text">{detail.title}</h2>
          <p className="mb-3 text-sm text-text-secondary">
            {detail.ownerName} ({detail.ownerEmail}) · {detail.categoryName} · {detail.areaName}
          </p>
          <ListingStatusBadge status={detail.status} />

          {detail.photos.length > 0 && (
            <div className="my-3 flex gap-2 overflow-x-auto">
              {detail.photos.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={url} src={url} alt="" className="h-24 w-32 rounded-lg object-cover" />
              ))}
            </div>
          )}

          <p className="my-3 whitespace-pre-line text-sm text-text-secondary">
            {detail.description}
          </p>
          <p className="mb-3 text-sm text-text-secondary">WhatsApp: {detail.whatsappLink}</p>

          {detail.moderationReason && (
            <p className="mb-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
              Alasan sebelumnya: {detail.moderationReason}
            </p>
          )}

          <label className="mb-3 flex flex-col gap-1 text-sm text-text-secondary">
            Alasan (wajib untuk tangguhkan/hapus)
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="rounded-xl border border-black/10 px-3 py-2 text-text outline-none focus:border-primary"
            />
          </label>

          <div className="flex gap-2">
            <button
              onClick={handleSuspend}
              disabled={actionLoading || !reason.trim()}
              className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Tangguhkan
            </button>
            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Hapus
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
