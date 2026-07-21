import Link from "next/link";
import { requireActiveUser } from "@/lib/current-user";
import { KontakDaruratForm } from "./kontak-darurat-form";

export const dynamic = "force-dynamic";

export default async function KontakDaruratPage() {
  await requireActiveUser("/akun/kontak-darurat");

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/akun" className="mb-6 inline-block text-sm font-medium text-primary hover:underline">
        ← Kembali ke Akun Saya
      </Link>

      <h1 className="mb-2 text-2xl font-bold text-text">Kontak Darurat</h1>
      <p className="mb-6 text-text-secondary">
        Digunakan admin Nemshi untuk verifikasi identitas dan penanganan situasi darurat/keamanan.
        Tidak pernah ditampilkan ke pengguna lain.
      </p>

      <KontakDaruratForm />
    </main>
  );
}
