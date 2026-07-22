import Link from "next/link";
import { requireActiveUser } from "@/lib/current-user";
import { getPublicProfile } from "@/lib/users";
import { verificationLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

const ADMIN_WHATSAPP_LINK = "https://wa.me/201000000000";

export default async function StatusVerifikasiPage() {
  const userId = await requireActiveUser("/akun/verifikasi");

  const profile = await getPublicProfile(userId);

  if (!profile) {
    return null;
  }

  const identityVerified = profile.verificationStatus !== "Unverified";
  const skillVerified = profile.verificationStatus === "Skill_Verified";
  const currentLabel = verificationLabel(profile.verificationStatus);

  return (
    <div className="bg-surface-tint">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/akun"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-primary"
        >
          ← Kembali ke Akun Saya
        </Link>

        <section className="rounded-3xl bg-white p-6 shadow-sm shadow-black/5 sm:p-8">
          <h1 className="font-display text-2xl font-semibold text-text">Status Verifikasi</h1>
          <p className="mt-2 mb-6 text-text-secondary">
            {currentLabel
              ? `Akunmu saat ini berstatus "${currentLabel}".`
              : "Akunmu belum terverifikasi. Verifikasi membantu calon pelanggan lebih percaya untuk menghubungimu."}
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface p-5">
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
                  className="whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
                >
                  Verifikasi Identitas Sekarang
                </a>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface p-5">
              <div>
                <h2 className="font-semibold text-text">Keahlian Terverifikasi</h2>
                <p className="text-sm text-text-secondary">
                  Tunjukkan portofolio dan pengalaman kerjamu untuk lencana keahlian tervalidasi
                  admin.
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
                  className="whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
                >
                  Verifikasi Keahlian Sekarang
                </a>
              )}
            </div>
          </div>

          <p className="mt-6 text-xs text-text-secondary">
            Proses verifikasi dilakukan manual oleh admin Nemshi setelah kamu menghubungi admin
            dan melengkapi data yang diminta.
          </p>
        </section>
      </div>
    </div>
  );
}
