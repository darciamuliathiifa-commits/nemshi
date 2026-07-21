import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { emergencyContacts } from "@/db/schema";

export type EmergencyContactInput = {
  fullName: string;
  phoneNumber: string;
};

/**
 * Mengganti seluruh kontak darurat pengguna dengan data baru. Server-side
 * menegakkan aturan minimal satu kontak lengkap (nama + telepon) wajib
 * diisi — lihat spesifikasi fitur Kontak Darurat.
 */
export async function saveEmergencyContacts(userId: string, contacts: EmergencyContactInput[]) {
  const validContacts = contacts
    .map((c) => ({ fullName: c.fullName.trim(), phoneNumber: c.phoneNumber.trim() }))
    .filter((c) => c.fullName && c.phoneNumber);

  if (validContacts.length === 0) {
    throw new Error("Minimal satu kontak darurat (nama dan nomor telepon) wajib diisi.");
  }

  await db.delete(emergencyContacts).where(eq(emergencyContacts.userId, userId));
  await db
    .insert(emergencyContacts)
    .values(validContacts.map((c) => ({ userId, ...c })));

  return getEmergencyContactsForUser(userId);
}

export async function getEmergencyContactsForUser(userId: string) {
  return db
    .select({
      id: emergencyContacts.id,
      fullName: emergencyContacts.fullName,
      phoneNumber: emergencyContacts.phoneNumber,
    })
    .from(emergencyContacts)
    .where(eq(emergencyContacts.userId, userId))
    .orderBy(desc(emergencyContacts.createdAt));
}
