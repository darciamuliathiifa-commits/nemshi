# Nemshi

Direktori iklan jasa (Job Directory/Classified Ads) untuk Masisir (Mahasiswa Indonesia di Mesir). Lihat [`PRD.md`](./PRD.md) untuk detail produk lengkap.

> Platform ini murni direktori iklan yang mengarahkan pengguna ke WhatsApp. **Tidak ada fitur pemesanan (booking) atau obrolan (chat) in-app** — semua negosiasi dan transaksi dilakukan mandiri di luar platform.

## Tech Stack

- **Frontend:** Next.js (App Router)
- **Styling:** Tailwind CSS & shadcn/ui *(belum diinstal — tambahkan saat mulai membangun UI)*
- **Backend/ORM:** Drizzle ORM
- **Database:** Supabase (PostgreSQL)
- **Storage:** Cloudinary (foto portofolio iklan)
- **Payment Gateway:** Midtrans / Xendit
- **Deployment:** Vercel

## Struktur Database

Skema database (`src/db/schema.ts`) mengikuti PRD bagian 6 "Database Schema" secara ketat — 4 tabel inti:

| Tabel | Deskripsi |
|---|---|
| `users` | Akun pengguna (pengiklan & pencari jasa) beserta status verifikasi. |
| `listings` | Iklan tawarkan jasa maupun posting cari jasa, dengan durasi tayang (`expires_at`) dan status moderasi. |
| `user_quotas` | Sisa kuota Iklan/Prioritas dari pembelian Paket Plus (berlaku 90 hari). |
| `click_analytics` | Log klik tombol "Hubungi via WhatsApp" per iklan (leads). |

Relasi: `users` 1–N `listings`, `users` 1–N `user_quotas`, `listings` 1–N `click_analytics`.

## Setup

1. Salin `.env.example` menjadi `.env` dan isi kredensial Supabase/Cloudinary/Payment Gateway.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate migration dari schema (sudah tersedia di `drizzle/`, jalankan ulang jika `src/db/schema.ts` berubah):
   ```bash
   npm run db:generate
   ```
4. Terapkan migration ke database Supabase:
   ```bash
   npm run db:migrate
   ```
5. Jalankan development server:
   ```bash
   npm run dev
   ```

## Referensi Fitur

Dokumen spesifikasi fitur ada di [`docs/features/`](./docs/features/), mengikuti Fase 1–4 pada PRD. Dokumen fitur "Pesan Jasa" dan "Obrolan" **sengaja tidak disertakan** karena berada di luar cakupan platform (lihat PRD bagian 2 "Batasan Tanggung Jawab" dan bagian 8 "Catatan Tambahan").
