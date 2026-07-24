"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { UserIcon } from "@/components/icons";
import { mockUser } from "@/lib/mock-user";
import { mockMyAds } from "@/lib/mock-my-ads";
import { useProfile } from "@/lib/profile-store";
import { supabase } from "@/lib/supabase/client";
import type { UserQuota } from "@/lib/server/quota-store";

const inputClass =
  "h-10 w-full rounded-input border border-border bg-white px-3 text-[14px] text-charcoal placeholder:text-muted focus:border-cta focus:outline-none focus:ring-3 focus:ring-cta/10";

export default function ProfilPage() {
  const router = useRouter();
  const [quota, setQuota] = useState<UserQuota | null>(null);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const { profile, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    fetch("/api/mayar/quota")
      .then((res) => res.json())
      .then(setQuota)
      .catch(() => setQuota(null));

    supabase?.auth.getUser().then(({ data }) => {
      setAuthEmail(data.user?.email ?? null);
    });
  }, []);

  async function handleLogout() {
    setSigningOut(true);
    await supabase?.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const activeAdsCount = mockMyAds.filter((ad) => ad.status === "Aktif").length;
  const totalAdsCount = mockMyAds.length;

  function startEditing() {
    setDraft(profile);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  function saveEditing() {
    updateProfile(draft);
    setIsEditing(false);
  }

  return (
    <>
      <Header title="Profil" />

      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-card border border-border-subtle bg-white p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-black/20 text-ink">
                  <UserIcon width={28} height={28} />
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
                    {authEmail ?? mockUser.email}
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
                <p className="text-2xl font-bold text-charcoal">{totalAdsCount}</p>
                <p className="mt-1 text-[12px] font-bold text-muted-foreground">
                  Total Iklan
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">{activeAdsCount}</p>
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
                {mockUser.joinedAt}
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
                  {profile.location}
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[14px] font-normal text-muted-foreground">
                Status Paket
              </span>
              <span className="text-base font-normal text-charcoal">
                {quota?.plan === "plus" && quota.planExpiresAt
                  ? `Plus aktif hingga ${new Date(quota.planExpiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`
                  : "Paket Gratis"}
              </span>
            </div>
          </div>

          {isEditing ? (
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={cancelEditing}
                className="h-11 flex-1 rounded-pill border border-border-strong text-base font-bold text-charcoal transition-colors hover:bg-surface"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={saveEditing}
                className="h-11 flex-1 rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black"
              >
                Simpan
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
        </div>
      </main>
    </>
  );
}
