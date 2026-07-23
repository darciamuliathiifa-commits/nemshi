"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ListingStatusBadge } from "@/components/listing-status-badge";
import { ImageUploader } from "@/components/image-uploader";

type Profile = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  whatsappLink: string | null;
  phoneNumber: string | null;
  verificationStatus: string;
};

type Activity = {
  quotas: {
    id: string;
    quotaType: string;
    remainingAmount: number;
    validityEnd: string;
  }[];
  listings: {
    id: string;
    title: string;
    type: string;
    status: string;
    publishedAt: string | null;
    expiresAt: string | null;
  }[];
};

const QUOTA_LABELS: Record<string, string> = {
  Listing_Slot: "Kuota Iklan Tawarkan Jasa",
  Priority_Slot: "Kuota Cari Jasa Prioritas",
};

export default function AkunSayaPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [form, setForm] = useState({ fullName: "", avatarUrl: "", whatsappLink: "", phoneNumber: "" });
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    fetch("/api/me").then(async (meResponse) => {
      if (meResponse.status === 401) {
        router.replace("/masuk?redirectTo=/akun");
        return;
      }

      const [profileData, activityData] = await Promise.all([
        meResponse.json(),
        fetch("/api/me/activity").then((r) => r.json()),
      ]);
      setProfile(profileData);
      setActivity(activityData);
      setForm({
        fullName: profileData.fullName ?? "",
        avatarUrl: profileData.avatarUrl ?? "",
        whatsappLink: profileData.whatsappLink ?? "",
        phoneNumber: profileData.phoneNumber ?? "",
      });
    });
  }, [router]);

  async function handleSave() {
    setSaving(true);
    setSavedMessage("");
    const response = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const updated = await response.json();
    setProfile(updated);
    setSaving(false);
    setSavedMessage("Perubahan tersimpan.");
  }

  if (!profile || !activity) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-text-secondary">Memuat akun...</p>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-b from-surface-tint to-white">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-text">Akun Saya</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-primary">
            <Link href="/akun/verifikasi" className="hover:underline">
              Status Verifikasi
            </Link>
            <Link href="/akun/transaksi" className="hover:underline">
              Riwayat Transaksi
            </Link>
            <Link href="/akun/kontak-darurat" className="hover:underline">
              Kontak Darurat
            </Link>
            <Link href={`/profil/${profile.id}`} className="hover:underline">
              Lihat profil publik →
            </Link>
          </div>
        </header>

      <section className="mb-6 border border-black/5 bg-white p-6">
        <h2 className="mb-4 font-semibold text-text">Data Diri</h2>
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm text-text-secondary">
            Nama Lengkap
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="border border-black/10 px-3 py-2 text-text outline-none focus:border-accent"
            />
          </label>
          <div className="flex flex-col gap-1 text-sm text-text-secondary">
            Foto Profil
            <div className="w-28">
              <ImageUploader
                value={form.avatarUrl}
                folder="avatars"
                aspectClassName="aspect-square"
                onChange={(url) => setForm({ ...form, avatarUrl: url })}
                onRemove={() => setForm({ ...form, avatarUrl: "" })}
              />
            </div>
          </div>
          <label className="flex flex-col gap-1 text-sm text-text-secondary">
            Link WhatsApp
            <input
              type="text"
              value={form.whatsappLink}
              onChange={(e) => setForm({ ...form, whatsappLink: e.target.value })}
              placeholder="https://wa.me/20XXXXXXXXXX"
              className="border border-black/10 px-3 py-2 text-text outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-text-secondary">
            Nomor Telepon
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              placeholder="081234567890"
              className="border border-black/10 px-3 py-2 text-text outline-none focus:border-accent"
            />
            <span className="text-xs text-text-secondary">
              Wajib diisi sebelum checkout pembayaran (dipakai oleh payment gateway).
            </span>
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-fit bg-primary px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            {savedMessage && <span className="text-sm text-text-secondary">{savedMessage}</span>}
          </div>
        </div>
      </section>

      <section className="mb-6 border border-black/5 bg-white p-6">
        <h2 className="mb-4 font-semibold text-text">Sisa Kuota</h2>
        {activity.quotas.length === 0 ? (
          <p className="text-sm text-text-secondary">Belum ada kuota Paket Plus.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {activity.quotas.map((quota) => (
              <li
                key={quota.id}
                className="flex items-center justify-between bg-surface px-4 py-3 text-sm"
              >
                <span>
                  {QUOTA_LABELS[quota.quotaType] ?? quota.quotaType}
                  <span className="block text-xs text-text-secondary">
                    Berlaku hingga {new Date(quota.validityEnd).toLocaleDateString("id-ID")}
                  </span>
                </span>
                <span className="font-semibold text-primary">{quota.remainingAmount} tersisa</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="border border-black/5 bg-white p-6">
        <h2 className="mb-4 font-semibold text-text">Riwayat Iklan & Permintaan</h2>
        {activity.listings.length === 0 ? (
          <p className="text-sm text-text-secondary">Belum ada iklan atau permintaan.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {activity.listings.map((listing) => (
              <li
                key={listing.id}
                className="flex items-center justify-between bg-surface px-4 py-3 text-sm"
              >
                <span>{listing.title}</span>
                <ListingStatusBadge status={listing.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
      </div>
    </main>
  );
}
