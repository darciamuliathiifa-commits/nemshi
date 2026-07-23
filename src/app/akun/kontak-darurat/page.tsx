import Link from "next/link";
import { requireActiveUser } from "@/lib/current-user";
import { KontakDaruratForm } from "./kontak-darurat-form";

export const dynamic = "force-dynamic";

export default async function KontakDaruratPage() {
  await requireActiveUser("/akun/kontak-darurat");

  return (
    <div className="bg-surface-tint">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/akun"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-primary"
        >
          ← Kembali ke Akun Saya
        </Link>

        <section className="bg-white p-6 border border-black/10 sm:p-8">
          <h1 className="font-display text-2xl font-semibold text-text">Kontak Darurat</h1>
          <p className="mt-2 mb-6 text-text-secondary">
            Digunakan admin Nemshi untuk verifikasi identitas dan penanganan situasi
            darurat/keamanan. Tidak pernah ditampilkan ke pengguna lain.
          </p>

          <KontakDaruratForm />
        </section>
      </div>
    </div>
  );
}
