"use client";

import { useState } from "react";

interface ScriptTemplate {
  id: string;
  title: string;
  description: string;
  body: string;
}

const scripts: ScriptTemplate[] = [
  {
    id: "ajak-usaha",
    title: "Ajak pemilik usaha pasang iklan",
    description: "Chat personal ke pemilik warung/usaha Masisir yang belum pernah pasang iklan.",
    body: `Assalamu'alaikum sidi, afwan mengganggu waktunya. Saya [Nama Kamu].

Saya lagi bangun Nemsyi — direktori khusus usaha-usaha Masisir yang terpusat dalam satu platform, biar sesama Masisir gampang nemuin produk/jasa dari kita sendiri, termasuk di bidang [Bidang Usaha].

https://nemsyi.sbs

Kebetulan sekarang masih tahap awal ngisi produk-produk asli Masisir, dan iklan di bidang [Bidang Usaha] masih sedikit banget — jadi [Nama Usaha] bisa jadi salah satu yang paling awal muncul di sana, sidi. Gratis, nggak dipungut biaya sama sekali.

Kalau sidi berkenan, saya bisa langsung bantu buatin iklannya — tinggal kirim aja foto produk/tempat, daftar harga, sama lokasi/nomor WA yang bisa dihubungi pembeli. InsyaAllah begitu udah terisi 10-20 usaha nyata Masisir, platformnya bakal dirilis ke publik.

Terima kasih banyak sebelumnya sidi 🙏`,
  },
  {
    id: "temen-deket",
    title: "Ajak temen deket isi etalase",
    description: "DM santai ke circle deket buat bantu isi listing pertama.",
    body: `Woy [nama], gue lagi bantuin bangun portal kecil buat Masisir namanya Nemsyi — tempat jual/cari barang, jasa, sama sayembara minta bantuan, biar nggak keubur di grup WA. Lagi tahap awal, gue butuh isi etalase-nya dulu. Lo kan sering [Bidang Usaha], ada yang mau dipasang nggak? 2 menit doang, gratis, dan lo bakal jadi salah satu yang pertama muncul pas orang buka Nemsyi. Gas bantu? https://nemsyi.sbs`,
  },
  {
    id: "kenalan",
    title: "Ajak kenalan / kakak tingkat",
    description: "Sedikit lebih formal, buat yang belum terlalu deket.",
    body: `Assalamualaikum kak/bang, izin promosi bentar — lagi bangun portal kecil buat komunitas Masisir namanya Nemsyi, isinya jual-beli barang, jasa, sama sayembara (minta bantuan) biar nggak nyari-nyari lagi di grup WA yang udah penuh. Sekarang lagi tahap ngisi etalase pembukaan, dan kebetulan kakak sering jualan di bidang [Bidang Usaha] — kalau berkenan pasang 1 iklan aja, gratis, dan bakal ikut ditampilin di etalase pembukaan. Linknya: https://nemsyi.sbs. Makasih banyak kak!`,
  },
  {
    id: "mau-pulang",
    title: "Titip jual sebelum pulang",
    description: "Buat yang lagi beres-beres kosan / mau pulang ke Indonesia.",
    body: `Eh lo kan mau pulang bulan depan — daripada barangnya numpuk atau dibuang, mending titip jual aja di Nemsyi. Portal baru buat Masisir, iklan pertama gratis, langsung nyambung ke WA pas ada yang minat. Coba pasang [barangnya], 2 menit doang: https://nemsyi.sbs`,
  },
  {
    id: "ajak-pengurus",
    title: "Minta tolong pengurus kekeluargaan sebar",
    description: "Chat personal ke pengurus/orang dipercaya di kekeluargaan daerah — minta mereka share pakai kata-kata sendiri, bukan lo yang broadcast.",
    body: `Assalamualaikum kak [Nama Pengurus], izin ganggu waktunya kak.

Saya [Nama Kamu], lagi bangun Nemsyi — portal kecil buat jual-beli barang/jasa sama minta bantuan (sayembara) khusus Masisir, biar nggak keubur di grup WA yang udah rame. https://nemsyi.sbs

Sekarang udah ada [Jumlah] usaha/produk Masisir asli yang gabung, jadi bukan portal kosong lagi. Saya mau minta tolong kak — kalau berkenan, boleh minta tolong share ke grup [Nama Kekeluargaan] pakai kata-kata kakak sendiri? Soalnya kalau dari orang yang udah dikenal di grup, biasanya lebih dipercaya daripada saya broadcast sendiri.

Nggak masalah kalau kakak mau tulis ulang sesuai gaya kakak ya, saya kasih poin-poin pentingnya aja:
- Nemsyi: portal jual-beli barang/jasa + sayembara minta bantuan buat Masisir
- Iklan pertama gratis
- Udah [Jumlah] usaha Masisir asli gabung
- Link: https://nemsyi.sbs

Makasih banyak kak sebelumnya 🙏`,
  },
  {
    id: "draft-post-grup",
    title: "Draft post buat pengurus share ke grup",
    description: "Teks siap-pakai yang bisa dikirim ke pengurus tadi, buat mereka tinggal post atau adaptasi sendiri.",
    body: `Halo semua! 👋

Mau share portal baru khusus buat Masisir: Nemsyi (https://nemsyi.sbs) — tempat jual-beli barang/jasa dan minta bantuan (sayembara) sesama Masisir, biar nggak keubur di grup chat yang udah rame.

Udah ada [Jumlah] usaha/produk asli Masisir yang gabung di sana. Iklan pertama gratis, langsung connect ke WhatsApp kalau ada yang minat.

Yuk dicoba, siapa tau ada yang lagi butuh atau mau jualan juga 🙌`,
  },
];

const PLACEHOLDER_PATTERN = /\[([^\]]+)\]/g;

function extractPlaceholders(body: string): string[] {
  return Array.from(new Set(Array.from(body.matchAll(PLACEHOLDER_PATTERN), (m) => m[1])));
}

function fillTemplate(body: string, values: Record<string, string>): string {
  return body.replace(PLACEHOLDER_PATTERN, (match, label) => {
    const filled = values[label]?.trim();
    return filled ? filled : match;
  });
}

function ScriptCard({ script }: { script: ScriptTemplate }) {
  const [copied, setCopied] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});

  const placeholders = extractPlaceholders(script.body);
  const filledBody = fillTemplate(script.body, values);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(filledBody);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be blocked (permissions, non-HTTPS) — nothing
      // useful to do besides let the user select-and-copy manually.
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-card border-[2.5px] border-ink bg-white p-5 shadow-[4px_4px_0_0_rgba(20,20,20,1)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-charcoal">{script.title}</h3>
          <p className="mt-1 text-[13px] font-normal text-muted-foreground">
            {script.description}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`h-10 shrink-0 rounded-pill border-2 border-ink px-5 text-[13px] font-bold shadow-[2px_2px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5 ${
            copied ? "bg-success text-white" : "bg-brand text-charcoal"
          }`}
        >
          {copied ? "Tersalin!" : "Salin"}
        </button>
      </div>

      {placeholders.length > 0 && (
        <div className="flex flex-wrap gap-3 border-t border-border-subtle pt-3">
          {placeholders.map((label) => (
            <label key={label} className="flex flex-col gap-1">
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                {label}
              </span>
              <input
                type="text"
                value={values[label] ?? ""}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, [label]: event.target.value }))
                }
                placeholder={label}
                className="h-9 w-48 rounded-input border border-border bg-white px-3 text-[13px] text-charcoal focus:border-cta focus:outline-none"
              />
            </label>
          ))}
        </div>
      )}

      <pre className="whitespace-pre-wrap rounded-input border border-border-subtle bg-surface/60 p-3.5 font-sans text-[13px] leading-5 text-charcoal">
        {filledBody}
      </pre>
    </div>
  );
}

export default function AdminPromosiPage() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b-[2.5px] border-ink bg-cream/90 px-6 py-4 backdrop-blur-md">
        <h1 className="text-2xl leading-[30px] font-bold text-charcoal">
          Script Promosi
        </h1>
        <p className="mt-0.5 text-[13px] font-normal text-muted-foreground">
          Template pesan siap-salin buat ngajak orang pasang iklan di Nemsyi. Ganti bagian dalam [kurung] sebelum dikirim.
        </p>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="flex flex-col gap-4">
          {scripts.map((script) => (
            <ScriptCard key={script.id} script={script} />
          ))}
        </div>
      </main>
    </>
  );
}
