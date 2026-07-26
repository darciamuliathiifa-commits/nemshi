"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { UserIcon, SearchIcon, ZapIcon, PlusCircleIcon, CloseIcon } from "@/components/icons";

interface UserItem {
  id: string;
  name: string;
  email: string | null;
  whatsappNumber: string | null;
  location: string | null;
  createdAt: string;
  plan: "free" | "plus";
  extraAdSlots: number;
  extraSayembaraSlots: number;
  freeAdSlotUsed: boolean;
  freeSayembaraSlotUsed: boolean;
  planExpiresAt: string | null;
  activeAdsCount: number;
}

type LoadState = "loading" | "ready" | "error";

const ITEMS_PER_PAGE = 20;

export default function AdminPenggunaPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [customUser, setCustomUser] = useState<UserItem | null>(null);
  const [customAdAmount, setCustomAdAmount] = useState(1);
  const [customSayembaraAmount, setCustomSayembaraAmount] = useState(1);

  useEffect(() => {
    loadUsers();
  }, []);

  function loadUsers() {
    setLoadState("loading");
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat pengguna.");
        return res.json();
      })
      .then((data: { users: UserItem[] }) => {
        setUsers(data.users);
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));
  }

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleGrant(
    targetUser: UserItem,
    action: "grant_ad" | "grant_sayembara" | "grant_plus" | "reset_free_slot",
    amount = 1,
  ) {
    setPendingId(targetUser.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: targetUser.id,
          action,
          amount,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal memberikan kuota.");
      }

      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== targetUser.id) return u;
          if (action === "grant_ad") {
            return { ...u, extraAdSlots: u.extraAdSlots + amount };
          }
          if (action === "grant_sayembara") {
            return { ...u, extraSayembaraSlots: u.extraSayembaraSlots + amount };
          }
          if (action === "grant_plus") {
            return {
              ...u,
              plan: "plus",
              extraAdSlots: u.extraAdSlots + 3,
              extraSayembaraSlots: u.extraSayembaraSlots + 2,
            };
          }
          if (action === "reset_free_slot") {
            return {
              ...u,
              freeAdSlotUsed: false,
              freeSayembaraSlotUsed: false,
            };
          }
          return u;
        }),
      );

      const actionLabels = {
        grant_ad: `+${amount} Slot Iklan berhasil diberikan ke ${targetUser.name}!`,
        grant_sayembara: `+${amount} Slot Sayembara berhasil diberikan ke ${targetUser.name}!`,
        grant_plus: `Paket Plus 3 bulan berhasil diaktifkan untuk ${targetUser.name}!`,
        reset_free_slot: `Jatah slot gratis berhasil di-reset untuk ${targetUser.name}!`,
      };

      showToast(actionLabels[action]);
      setCustomUser(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setPendingId(null);
    }
  }

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.whatsappNumber && u.whatsappNumber.includes(q))
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <>
      <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle bg-white/90 px-6 py-4 backdrop-blur">
        <div>
          <h1 className="text-2xl leading-[30px] font-bold text-charcoal">
            Pengguna &amp; Hak Akses Iklan
          </h1>
          <p className="mt-0.5 text-[13px] font-normal text-muted-foreground">
            Kelola seluruh pengguna dan berikan jatah slot iklan / sayembara / Paket Plus secara bebas.
          </p>
        </div>

        <div className="relative w-full max-w-xs">
          <SearchIcon
            width={16}
            height={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/50"
          />
          <input
            type="search"
            placeholder="Cari nama, email, atau WA..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 w-full rounded-pill border border-border bg-white pl-10 pr-4 text-[13px] text-charcoal placeholder:text-muted focus:border-cta focus:outline-none focus:ring-3 focus:ring-cta/10"
          />
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        {loadState === "loading" && (
          <p className="text-[14px] font-normal text-muted-foreground">Memuat pengguna...</p>
        )}

        {loadState === "error" && (
          <div className="flex flex-col items-center justify-center rounded-input border border-dashed border-border-strong py-16 text-center">
            <p className="text-base font-normal text-charcoal">Gagal memuat data pengguna.</p>
            <p className="mt-1 text-[14px] font-normal text-muted-foreground">
              Pastikan akunmu ber-role admin.
            </p>
          </div>
        )}

        {loadState === "ready" && (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-input border border-border-subtle bg-white p-5">
                <p className="text-2xl font-bold text-charcoal">{users.length}</p>
                <p className="mt-1 text-[12px] font-bold text-muted-foreground">Total Terdaftar</p>
              </div>
              <div className="rounded-input border border-border-subtle bg-white p-5">
                <p className="text-2xl font-bold text-charcoal">
                  {users.filter((u) => u.plan === "plus").length}
                </p>
                <p className="mt-1 text-[12px] font-bold text-muted-foreground">Pengguna Paket Plus</p>
              </div>
              <div className="rounded-input border border-border-subtle bg-white p-5">
                <p className="text-2xl font-bold text-cta">
                  {users.reduce((sum, u) => sum + u.extraAdSlots + u.extraSayembaraSlots, 0)}
                </p>
                <p className="mt-1 text-[12px] font-bold text-muted-foreground">Bonus Slot Diberikan</p>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <p className="text-[14px] font-normal text-muted-foreground">
                {filteredUsers.length} pengguna ditemukan (Halaman {currentPage} dari {totalPages})
              </p>
            </div>

            {paginatedUsers.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedUsers.map((userItem) => {
                  const isPending = pendingId === userItem.id;
                  return (
                    <div
                      key={userItem.id}
                      className="flex flex-col justify-between rounded-card border-[2.5px] border-ink bg-white p-5 shadow-[3px_3px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5"
                    >
                      {/* Top: Header Info */}
                      <div>
                        <div className="flex items-start justify-between gap-2 border-b border-border-subtle pb-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-brand font-bold text-charcoal text-sm">
                              {userItem.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h3 className="truncate text-[14px] font-bold text-charcoal" title={userItem.name}>
                                {userItem.name}
                              </h3>
                              <p className="truncate text-[11px] font-normal text-muted-foreground" title={userItem.email ?? ""}>
                                {userItem.email ?? "Tanpa Email"}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`shrink-0 rounded-badge px-2 py-0.5 text-[10px] font-bold ${
                              userItem.plan === "plus"
                                ? "bg-brand text-charcoal border border-ink"
                                : "bg-surface text-charcoal/70"
                            }`}
                          >
                            {userItem.plan === "plus" ? "Paket Plus" : "Gratis"}
                          </span>
                        </div>

                        {/* Middle: Details & Quotas */}
                        <div className="my-3.5 flex flex-col gap-1.5 text-[12px]">
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>WhatsApp:</span>
                            <strong className="text-charcoal">{userItem.whatsappNumber ?? "-"}</strong>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Iklan Aktif:</span>
                            <strong className="text-charcoal">{userItem.activeAdsCount} iklan</strong>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Extra Slot Iklan:</span>
                            <strong className="text-cta">+{userItem.extraAdSlots}</strong>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Extra Sayembara:</span>
                            <strong className="text-cta">+{userItem.extraSayembaraSlots}</strong>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Slot Gratis:</span>
                            <strong className={userItem.freeAdSlotUsed ? "text-error" : "text-success"}>
                              {userItem.freeAdSlotUsed ? "Terpakai" : "Tersedia"}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Bottom: Action Buttons Grid */}
                      <div className="border-t border-border-subtle pt-3">
                        {isPending ? (
                          <div className="flex h-16 items-center justify-center gap-2 text-[12px] font-medium text-muted-foreground">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-surface border-t-cta" />
                            Memproses...
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleGrant(userItem, "grant_ad", 1)}
                              className="flex h-8 items-center justify-center gap-1 rounded-pill border border-ink bg-white px-2 text-[11px] font-bold text-charcoal shadow-[1.5px_1.5px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                              <PlusCircleIcon width={12} height={12} />
                              +1 Iklan
                            </button>

                            <button
                              type="button"
                              onClick={() => handleGrant(userItem, "grant_sayembara", 1)}
                              className="flex h-8 items-center justify-center gap-1 rounded-pill border border-ink bg-white px-2 text-[11px] font-bold text-charcoal shadow-[1.5px_1.5px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                              <PlusCircleIcon width={12} height={12} />
                              +1 Sayembara
                            </button>

                            <button
                              type="button"
                              onClick={() => handleGrant(userItem, "grant_plus")}
                              className="flex h-8 items-center justify-center gap-1 rounded-pill border border-ink bg-brand px-2 text-[11px] font-bold text-charcoal shadow-[1.5px_1.5px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                              <ZapIcon width={12} height={12} />
                              +Paket Plus
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setCustomUser(userItem);
                                setCustomAdAmount(1);
                                setCustomSayembaraAmount(1);
                              }}
                              className="flex h-8 items-center justify-center rounded-pill border border-border bg-surface px-2 text-[11px] font-bold text-charcoal hover:bg-border/30"
                            >
                              Custom...
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-input border border-dashed border-border-strong py-16 text-center">
                <p className="text-base font-normal text-charcoal">
                  Pengguna tidak ditemukan.
                </p>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-6">
                <p className="text-[13px] font-normal text-muted-foreground">
                  Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} dari{" "}
                  {filteredUsers.length} pengguna
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="flex h-9 items-center justify-center rounded-pill border border-border bg-white px-4 text-[13px] font-bold text-charcoal shadow-sm transition-colors hover:bg-surface disabled:opacity-40"
                  >
                    ← Sebelumnya
                  </button>
                  <span className="px-2 text-[13px] font-bold text-charcoal">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="flex h-9 items-center justify-center rounded-pill border border-border bg-white px-4 text-[13px] font-bold text-charcoal shadow-sm transition-colors hover:bg-surface disabled:opacity-40"
                  >
                    Selanjutnya →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Custom Grant Dialog Modal */}
      {customUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-card border-[3px] border-ink bg-white p-6 shadow-[6px_6px_0_0_rgba(20,20,20,1)]">
            <button
              type="button"
              onClick={() => setCustomUser(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-charcoal/60 hover:bg-surface"
            >
              <CloseIcon width={18} height={18} />
            </button>

            <h2 className="text-xl font-bold text-charcoal">
              Beri Akses / Slot Khusus
            </h2>
            <p className="mt-1 text-[13px] font-normal text-muted-foreground">
              Atur kuota slot secara spesifik untuk <strong className="text-charcoal">{customUser.name}</strong>.
            </p>

            <div className="mt-5 flex flex-col gap-4">
              <div>
                <label className="text-[12px] font-bold text-muted-foreground">
                  Tambah Slot Iklan
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={customAdAmount}
                    onChange={(e) => setCustomAdAmount(Math.max(1, Number(e.target.value)))}
                    className="h-10 w-28 rounded-input border border-border bg-white px-3 text-center text-base font-bold text-charcoal"
                  />
                  <button
                    type="button"
                    onClick={() => handleGrant(customUser, "grant_ad", customAdAmount)}
                    className="flex h-10 flex-1 items-center justify-center rounded-pill bg-charcoal text-[13px] font-bold text-white transition-colors hover:bg-black"
                  >
                    + Tambah {customAdAmount} Slot Iklan
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[12px] font-bold text-muted-foreground">
                  Tambah Slot Sayembara
                </label>
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={customSayembaraAmount}
                    onChange={(e) => setCustomSayembaraAmount(Math.max(1, Number(e.target.value)))}
                    className="h-10 w-28 rounded-input border border-border bg-white px-3 text-center text-base font-bold text-charcoal"
                  />
                  <button
                    type="button"
                    onClick={() => handleGrant(customUser, "grant_sayembara", customSayembaraAmount)}
                    className="flex h-10 flex-1 items-center justify-center rounded-pill bg-charcoal text-[13px] font-bold text-white transition-colors hover:bg-black"
                  >
                    + Tambah {customSayembaraAmount} Slot Sayembara
                  </button>
                </div>
              </div>

              <div className="border-t border-border-subtle pt-4">
                <button
                  type="button"
                  onClick={() => handleGrant(customUser, "reset_free_slot")}
                  className="flex h-10 w-full items-center justify-center rounded-pill border-2 border-ink bg-cream text-[13px] font-bold text-charcoal shadow-[2px_2px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5"
                >
                  🔄 Reset Jatah Slot Gratis (Biar Bisa Pasang Lagi)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-pill bg-charcoal px-5 py-3 text-[14px] font-bold text-white shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
