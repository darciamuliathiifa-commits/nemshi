import Link from "next/link";

export default function AkunDitangguhkanPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <h1 className="mb-3 text-2xl font-bold text-text">Akun Ditangguhkan</h1>
      <p className="mb-6 text-text-secondary">
        Akun ini telah ditangguhkan secara permanen oleh admin Nemshi karena pelanggaran berat
        terhadap kebijakan komunitas. Kamu tidak dapat memasang iklan, membuat permintaan jasa,
        atau mengakses fitur akun lainnya.
      </p>
      <p className="mb-6 text-sm text-text-secondary">
        Jika menurutmu ini adalah kekeliruan, silakan hubungi admin Nemshi untuk mengajukan
        peninjauan ulang.
      </p>
      <Link href="/" className="font-medium text-primary hover:underline">
        ← Kembali ke Beranda
      </Link>
    </main>
  );
}
