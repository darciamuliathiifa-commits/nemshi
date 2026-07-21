"use client";

import { useEffect, useState } from "react";
import { EmergencyContactFields, type EmergencyContact } from "@/components/emergency-contact-fields";

export function KontakDaruratForm() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([{ fullName: "", phoneNumber: "" }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/me/emergency-contacts")
      .then((r) => r.json())
      .then((data: EmergencyContact[]) => {
        if (data.length > 0) {
          setContacts(data);
        }
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setMessage("");

    const response = await fetch("/api/me/emergency-contacts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contacts }),
    });

    setSaving(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "Gagal menyimpan kontak darurat.");
      return;
    }

    setMessage("Kontak darurat berhasil disimpan.");
  }

  if (loading) {
    return <p className="text-text-secondary">Memuat kontak darurat...</p>;
  }

  return (
    <div className="rounded-xl border border-black/5 bg-white p-6">
      <EmergencyContactFields contacts={contacts} onChange={setContacts} />

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {message && <p className="mt-3 text-sm text-primary">{message}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-4 w-fit rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving ? "Menyimpan..." : "Simpan Kontak Darurat"}
      </button>
    </div>
  );
}
