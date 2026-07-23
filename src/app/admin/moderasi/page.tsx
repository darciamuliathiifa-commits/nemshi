"use client";

import { useEffect, useState } from "react";

type PendingListing = {
  id: string;
  title: string;
  createdAt: string;
  ownerName: string;
  categoryName: string;
  coverPhotoUrl: string | null;
};

type Tab = "Offers_Service" | "Needs_Service";

export default function AntreanModerasiPage() {
  const [tab, setTab] = useState<Tab>("Offers_Service");
  const [items, setItems] = useState<PendingListing[] | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  async function loadItems() {
    setItems(null);
    const data = await fetch(`/api/admin/moderation/pending?type=${tab}`).then((r) => r.json());
    setItems(data);
  }

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function handleApprove(id: string) {
    await fetch(`/api/admin/listings/${id}/approve`, { method: "POST" });
    setMessage("Iklan disetujui dan sekarang tayang.");
    loadItems();
  }

  async function handleReject() {
    if (!rejectingId || !reason.trim()) return;
    await fetch(`/api/admin/listings/${rejectingId}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    setRejectingId(null);
    setReason("");
    setMessage("Iklan ditolak.");
    loadItems();
  }

  return (
    <div className="rounded-3xl bg-white p-6 border border-black/10 sm:p-8">
      <h1 className="mb-2 text-2xl font-bold text-text">Antrean Moderasi</h1>
      <p className="mb-6 text-sm text-text-secondary">
        Tinjau iklan dan permintaan jasa sebelum tayang ke publik.
      </p>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab("Offers_Service")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "Offers_Service"
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-surface"
          }`}
        >
          Iklan Menunggu
        </button>
        <button
          onClick={() => setTab("Needs_Service")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "Needs_Service"
              ? "bg-primary text-white"
              : "text-text-secondary hover:bg-surface"
          }`}
        >
          Cari Jasa Menunggu
        </button>
      </div>

      {message && <p className="mb-4 text-sm text-success">{message}</p>}

      {!items ? (
        <p className="text-text-secondary">Memuat...</p>
      ) : items.length === 0 ? (
        <p className="text-text-secondary">Tidak ada yang menunggu moderasi.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-surface p-4">
              <div className="mb-2 flex gap-3">
                {item.coverPhotoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.coverPhotoUrl}
                    alt=""
                    className="h-16 w-20 shrink-0 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-text">{item.title}</h3>
                  <p className="text-xs text-text-secondary">
                    {item.ownerName} · {item.categoryName}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Diajukan {new Date(item.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>

              {rejectingId === item.id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Alasan penolakan..."
                    rows={2}
                    className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleReject}
                      disabled={!reason.trim()}
                      className="rounded-full bg-red-600 px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      Simpan Penolakan
                    </button>
                    <button
                      onClick={() => setRejectingId(null)}
                      className="rounded-full border border-black/10 px-3 py-1.5 text-sm text-text-secondary"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-white"
                  >
                    Setuju
                  </button>
                  <button
                    onClick={() => setRejectingId(item.id)}
                    className="rounded-full border border-black/10 px-3 py-1.5 text-sm text-text-secondary"
                  >
                    Tolak
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
