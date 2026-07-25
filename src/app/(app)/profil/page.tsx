"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { ChevronRightIcon, UserIcon } from "@/components/icons";
import { supabase } from "@/lib/supabase/client";
import type { UserQuota } from "@/lib/server/quota-store";

interface ProfileData {
  id: string;
  name: string;
  email: string | null;
  location: string | null;
  avatarUrl: string | null;
  joinedYear: number;
  activeAdsCount: number;
}

const inputClass =
  "h-10 w-full rounded-input border border-border bg-white px-3 text-[14px] text-charcoal placeholder:text-muted focus:border-cta focus:outline-none focus:ring-3 focus:ring-cta/10";

export default function ProfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [totalAdsCount, setTotalAdsCount] = useState<number | null>(null);
  const [quota, setQuota] = useState<UserQuota | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({ name: "", location: "" });
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat profil.");
        return res.json();
      })
      .then((data: ProfileData) => setProfile(data))
      .catch(() => setLoadError(true));

    fetch("/api/my-ads?limit=1")
      .then((res) => res.json())
      .then((data: { pagination: { total: number } }) =>
        setTotalAdsCount(data.pagination.total),
      )
      .catch(() => setTotalAdsCount(null));

    fetch("/api/mayar/quota")
      .then((res) => res.json())
      .then(setQuota)
      .catch(() => setQuota(null));
  }, []);

  async function handleLogout() {
    setSigningOut(true);
    await supabase?.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function startEditing() {
    if (!profile) return;
    setDraft({ name: profile.name, location: profile.location ?? "" });
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  async function saveEditing() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error("Gagal menyimpan profil.");
      const updated: ProfileData = await res.json();
      setProfile(updated);
      setIsEditing(false);
    } catch {
      // keep the edit form open so the user can retry
    } finally {
      setSaving(false);
    }
  }

  if (loadError) {
    return (
      <>
        <Header title="Profil" />
        <main className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border-strong py-16 text-center">
              <p className="text-base font-normal text-charcoal">
                Gagal memuat profil.
              </p>
              <p className="mt-1 text-[14px] font-normal text-muted-foreground">
                Pastikan kamu sudah masuk dengan akun Google.
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Profil" />

      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-2xl">
          {!profile ? (
            <p className="text-[14px] font-normal text-muted-foreground">Memuat...</p>
          ) : (
            <>
              <div className="rounded-card border border-border-subtle bg-white p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-black/20 text-ink">
                      {profile.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profile.avatarUrl}
                          alt={profile.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserIcon width={28} height={28} />
                      )}
                    </div>
                    <div className="min-w-0">
                      {isEditing ? (
                        <input
                          className={inputClass}
                          value={draft.name}
                          onChange={(event) =>
                            setDraft((prev) => ({ ...prev, name: event.target.value }))
                          }
                        />
                      ) : (
                        <h2 className="truncate text-xl font-bold text-charcoal">
                          {profile.name}
                        </h2>
                      )}
                      <p className="mt-1 truncate text-[14px] font-normal text-muted-foreground">
                        {profile.email}
                      </p>
                    </div>
                  </div>

                  {!isEditing && (
                    <button
                      type="button"
                      onClick={startEditing}
                      className="h-9 shrink-0 rounded-pill border border-border-strong px-4 text-[14px] font-bold text-charcoal transition-colors hover:bg-surface"
                    >
                      Edit Profil
                    </button>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border-subtle pt-6">
                  <div>
                    <p className="text-2xl font-bold text-charcoal">
                      {totalAdsCount ?? "–"}
                    </p>
                    <p className="mt-1 text-[12px] font-bold text-muted-foreground">
                      Total Iklan
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-charcoal">
                      {profile.activeAdsCount}
                    </p>
                    <p className="mt-1 text-[12px] font-bold text-muted-foreground">
                      Iklan Aktif
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-charcoal">
                      {quota?.plan === "plus" ? "Plus" : "Gratis"}
                    </p>
                    <p className="mt-1 text-[12px] font-bold text-muted-foreground">
                      Paket
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-card border border-border-subtle bg-white p-6">
                <p className="text-[12px] font-bold text-muted-foreground">
                  Informasi Akun
                </p>

                <div className="mt-3 flex items-center justify-between border-b border-border-subtle pb-3">
                  <span className="text-[14px] font-normal text-muted-foreground">
                    Bergabung sejak
                  </span>
                  <span className="text-base font-normal text-charcoal">
                    {profile.joinedYear}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between border-b border-border-subtle pb-3">
                  <span className="text-[14px] font-normal text-muted-foreground">
                    Lokasi
                  </span>
                  {isEditing ? (
                    <input
                      className={`${inputClass} max-w-[200px]`}
                      value={draft.location}
                      onChange={(event) =>
                        setDraft((prev) => ({ ...prev, location: event.target.value }))
                      }
                    />
                  ) : (
                    <span className="text-base font-normal text-charcoal">
                      {profile.location || "Belum diisi"}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between border-b border-border-subtle pb-3">
                  <span className="text-[14px] font-normal text-muted-foreground">
                    Status Paket
                  </span>
                  <span className="text-base font-normal text-charcoal">
                    {quota?.plan === "plus" && quota.planExpiresAt
                      ? `Plus aktif hingga ${new Date(quota.planExpiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`
                      : "Paket Gratis"}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between border-b border-border-subtle pb-3">
                  <span className="text-[14px] font-normal text-muted-foreground">
                    Sisa Slot Iklan
                  </span>
                  <span className="text-base font-normal text-charcoal">
                    {quota
                      ? (quota.freeAdSlotUsed ? 0 : 1) + quota.extraAdSlots
                      : "–"}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[14px] font-normal text-muted-foreground">
                    Sisa Slot Sayembara
                  </span>
                  <span className="text-base font-normal text-charcoal">
                    {quota
                      ? (quota.freeSayembaraSlotUsed ? 0 : 1) + quota.extraSayembaraSlots
                      : "–"}
                  </span>
                </div>

                {quota?.plan !== "plus" && (
                  <Link
                    href="/paket-plus"
                    className="mt-4 flex items-center justify-between gap-3 rounded-input border-2 border-ink bg-brand px-4 py-3 transition-transform hover:-translate-y-0.5"
                  >
                    <div>
                      <p className="text-[14px] font-bold text-charcoal">
                        Upgrade ke Paket Plus
                      </p>
                      <p className="mt-0.5 text-[12px] font-normal text-charcoal/70">
                        Tambah slot iklan &amp; sayembara, plus promosi prioritas.
                      </p>
                    </div>
                    <span className="flex h-9 shrink-0 items-center gap-1 rounded-pill bg-charcoal px-4 text-[13px] font-bold text-white">
                      Lihat Paket
                      <ChevronRightIcon width={14} height={14} />
                    </span>
                  </Link>
                )}
              </div>

              {isEditing ? (
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={saving}
                    className="h-11 flex-1 rounded-pill border border-border-strong text-base font-bold text-charcoal transition-colors hover:bg-surface disabled:opacity-60"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={saveEditing}
                    disabled={saving}
                    className="h-11 flex-1 rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black disabled:opacity-60"
                  >
                    {saving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={signingOut}
                  className="mt-6 h-11 w-full rounded-pill border border-border-strong text-base font-bold text-charcoal transition-colors hover:bg-surface disabled:opacity-60"
                >
                  {signingOut ? "Keluar..." : "Keluar"}
                </button>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
