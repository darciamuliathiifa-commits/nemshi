"use client";

import { useEffect, useState } from "react";

type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  verificationStatus: string;
  isAdmin: boolean;
  createdAt: string;
};

const STATUS_OPTIONS = ["Unverified", "Identity_Verified", "Skill_Verified"];

export default function KelolaPenggunaPage() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [query, setQuery] = useState("");

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

  return (
    <div>
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
        <div className="overflow-x-auto rounded-xl border border-black/5 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 text-text-secondary">
              <tr>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Terdaftar</th>
                <th className="px-4 py-3 font-medium">Status Verifikasi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3 text-text">
                    {user.fullName}
                    {user.isAdmin && (
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Admin
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
