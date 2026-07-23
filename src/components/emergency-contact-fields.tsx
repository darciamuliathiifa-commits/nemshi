"use client";

export type EmergencyContact = { fullName: string; phoneNumber: string };

export function EmergencyContactFields({
  contacts,
  onChange,
}: {
  contacts: EmergencyContact[];
  onChange: (contacts: EmergencyContact[]) => void;
}) {
  function updateContact(index: number, field: keyof EmergencyContact, value: string) {
    onChange(contacts.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }

  function addContact() {
    onChange([...contacts, { fullName: "", phoneNumber: "" }]);
  }

  function removeContact(index: number) {
    onChange(contacts.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-text">Kontak Darurat</h3>
        <p className="text-xs text-text-secondary">
          Hanya dapat diakses oleh admin Nemshi untuk keperluan verifikasi identitas dan
          keamanan — tidak pernah ditampilkan ke publik. Minimal satu kontak wajib diisi.
        </p>
      </div>

      {contacts.map((contact, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 rounded-xl border border-black/10 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-text-secondary">
              {index === 0 ? "Kontak Utama" : "Kontak Cadangan"}
            </span>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeContact(index)}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Hapus
              </button>
            )}
          </div>
          <input
            type="text"
            required={index === 0}
            placeholder="Nama lengkap kontak"
            value={contact.fullName}
            onChange={(e) => updateContact(index, "fullName", e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm text-text outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
          />
          <input
            type="tel"
            required={index === 0}
            placeholder="Nomor telepon aktif"
            value={contact.phoneNumber}
            onChange={(e) => updateContact(index, "phoneNumber", e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm text-text outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
          />
        </div>
      ))}

      {contacts.length < 2 && (
        <button
          type="button"
          onClick={addContact}
          className="w-fit text-sm font-medium text-accent hover:underline"
        >
          + Tambah Kontak Cadangan
        </button>
      )}
    </div>
  );
}
