import Link from "next/link";
import { getCurrentUserId } from "@/lib/current-user";
import { getPublicProfile } from "@/lib/users";
import { verificationLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

const ADMIN_WHATSAPP_LINK = "https://wa.me/201000000000";

export default async function StatusVerifikasiPage() {
  const userId = await getCurrentUserId();
  const profile = await getPublicProfile(userId);

  if (!profile) {
    return null;
  }

  const identityVerified = profile.verificationStatus !== "Unverified";
  const skillVerified = profile.verificationStatus === "Skill_Verified";
  const currentLabel = verificationLabel(profile.verificationStatus);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/akun" className="mb-6 inline-block text-sm font-medium text-primary hover:underline">
        ← Kembali ke Akun Saya
      </Link>

      <h1 className="mb-2 text-2xl font-bold text-text">Status Verifikasi</h1>
      <p className="mb-6 text-text-secondary">
        {currentLabel
          ? `Akunmu saat ini berstatus "${currentLabel}".`
          : "Akunmu belum terverifikasi. Verifikasi membantu calon pelanggan lebih percaya untuk menghubungimu."}
      </p>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-xl border border-black/5 bg-white p-5">
          <div>
            <h2 className="font-semibold text-text">Identitas Terverifikasi</h2>
            <p className="text-sm text-text-secondary">
              Verifikasi KTP/paspor dan data mahasiswa untuk menunjukkan identitasmu asli.
            </p>
          </div>
          {identityVerified ? (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              ✓ Terverifikasi
            </span>
          ) : (
            <a
              href={ADMIN_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Verifikasi Identitas Sekarang
            </a>
          )}
        </div>

        <div className="flex items-center justify-between rounded-xl border border-black/5 bg-white p-5">
          <div>
            <h2 className="font-semibold text-text">Keahlian Terverifikasi</h2>
            <p className="text-sm text-text-secondary">
              Tunjukkan portofolio dan pengalaman kerjamu untuk lencana keahlian tervalidasi admin.
            </p>
          </div>
          {skillVerified ? (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              ✓ Terverifikasi
            </span>
          ) : (
            <a
              href={ADMIN_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Verifikasi Keahlian Sekarang
            </a>
          )}
        </div>
      </div>

      <p className="mt-6 text-xs text-text-secondary">
        Proses verifikasi dilakukan manual oleh admin Nemshi setelah kamu menghubungi admin dan
        melengkapi data yang diminta.
      </p>
    </main>
  );
}
