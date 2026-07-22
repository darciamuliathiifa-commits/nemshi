"use client";

import { Fragment, useEffect, useState } from "react";

type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  verificationStatus: string;
  isAdmin: boolean;
  isSuspended: boolean;
  createdAt: string;
};

type EmergencyContact = { id: string; fullName: string; phoneNumber: string };

const STATUS_OPTIONS = ["Unverified", "Identity_Verified", "Skill_Verified"];

export default function KelolaPenggunaPage() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [query, setQuery] = useState("");
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [contactsByUser, setContactsByUser] = useState<Record<string, EmergencyContact[]>>({});

  useEffect(() => {
    const params = query ? `?q=${encodeURIComponent(query)}` : "";
    fetch(`/api/admin/users${params}`)
      .then((r) => r.json())
      .then(setUsers);
  }, [query]);

  async function handleStatusChange(userId: string, verificationStatus: string) {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verificationStatus }),
    });
    const updated = await response.json();
    setUsers((prev) => prev?.map((u) => (u.id === userId ? { ...u, ...updated } : u)) ?? null);
  }

  async function toggleEmergencyContacts(userId: string) {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      return;
    }

    setExpandedUserId(userId);
    if (!contactsByUser[userId]) {
      const contacts = await fetch(`/api/admin/users/${userId}/emergency-contacts`).then((r) =>
        r.json()
      );
      setContactsByUser((prev) => ({ ...prev, [userId]: contacts }));
    }
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm shadow-black/5 sm:p-8">
      <h1 className="mb-2 text-2xl font-bold text-text">Kelola Pengguna</h1>
      <p className="mb-6 text-sm text-text-secondary">
        Lihat semua pengguna terdaftar dan verifikasi akun secara manual.
      </p>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari nama atau email..."
        className="mb-4 w-full max-w-sm rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-primary"
      />

      {!users ? (
        <p className="text-text-secondary">Memuat pengguna...</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 text-text-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Terdaftar</th>
                <th className="px-4 py-3 font-medium">Status Verifikasi</th>
                <th className="px-4 py-3 font-medium">Kontak Darurat</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <Fragment key={user.id}>
                  <tr className="border-b border-black/10 last:border-0">
                    <td className="px-4 py-3 text-text">
                      {user.fullName}
                      {user.isAdmin && (
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Admin
                        </span>
                      )}
                      {user.isSuspended && (
                        <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                          Ditangguhkan
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{user.email}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      {new Date(user.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.verificationStatus}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        className="rounded-xl border border-black/10 px-2 py-1 text-sm outline-none focus:border-primary"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleEmergencyContacts(user.id)}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {expandedUserId === user.id ? "Sembunyikan" : "Lihat"}
                      </button>
                    </td>
                  </tr>
                  {expandedUserId === user.id && (
                    <tr className="border-b border-black/10 bg-white last:border-0">
                      <td colSpan={5} className="px-4 py-3">
                        {!contactsByUser[user.id] ? (
                          <p className="text-sm text-text-secondary">Memuat kontak darurat...</p>
                        ) : contactsByUser[user.id].length === 0 ? (
                          <p className="text-sm text-text-secondary">
                            Belum ada kontak darurat tersimpan.
                          </p>
                        ) : (
                          <ul className="flex flex-col gap-1 text-sm text-text">
                            {contactsByUser[user.id].map((contact) => (
                              <li key={contact.id}>
                                {contact.fullName} — {contact.phoneNumber}
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
