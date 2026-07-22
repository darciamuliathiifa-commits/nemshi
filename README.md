# Nemshi

Direktori iklan jasa (Job Directory/Classified Ads) untuk Masisir (Mahasiswa Indonesia di Mesir). Lihat [`PRD.md`](./PRD.md) untuk detail produk lengkap.

> Platform ini murni direktori iklan yang mengarahkan pengguna ke WhatsApp. **Tidak ada fitur pemesanan (booking) atau obrolan (chat) in-app** — semua negosiasi dan transaksi dilakukan mandiri di luar platform.

## Tech Stack

- **Frontend:** Next.js 15 (App Router) + Tailwind CSS
- **Backend/ORM:** Drizzle ORM
- **Database & Auth:** Supabase (PostgreSQL + Supabase Auth)
- **Storage:** Supabase Storage (foto profil & portofolio iklan, upload langsung dari browser)
- **Payment Gateway:** [Mayar](https://docs.mayar.id) (QRIS, transfer bank, e-wallet, dll.)
- **Deployment:** Vercel

## Struktur Database

Skema database (`src/db/schema.ts`) — 13 tabel:

| Tabel | Deskripsi |
|---|---|
| `users` | Akun pengguna, status verifikasi, status suspend permanen. |
| `categories` / `areas` | Kategori jasa dan area layanan (referensi listing). |
| `listings` | Iklan tawarkan jasa maupun posting cari jasa, dengan durasi tayang (`expires_at`) dan status moderasi. |
| `listing_photos` | Foto portofolio per iklan (maks. 5). |
| `user_quotas` | Sisa kuota Iklan/Prioritas dari pembelian Paket Plus (berlaku 90 hari). |
| `testimonials` | Testimoni/ulasan pada profil pengguna. |
| `orders` | Transaksi pembayaran (biaya publikasi, Paket Plus, Traktir Platform), status dari Mayar. |
| `admin_activity_logs` | Jejak aksi admin (approve/reject/suspend/dll.) untuk audit. |
| `click_analytics` / `listing_impressions` | Log klik WhatsApp dan tayangan per iklan (dasar Analitik Exposure). |
| `reports` | Laporan pengguna atas iklan mencurigakan (fitur Keamanan Komunitas). |
| `emergency_contacts` | Kontak darurat pengguna — privat, hanya admin yang bisa lihat. |

## Setup Lokal

1. Salin `.env.example` menjadi `.env.local` dan isi kredensialnya (lihat komentar di setiap variabel):
   - `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — dari project Supabase kamu.
   - `MAYAR_API_KEY`, `MAYAR_API_HOST` — dari [web.mayar.id/api-keys](https://web.mayar.id/api-keys) (atau `web.mayar.club` untuk sandbox testing).
   - `NEXT_PUBLIC_APP_URL` — domain aplikasi (`http://localhost:3000` untuk lokal).
   - `CRON_SECRET` — string rahasia bebas, buat lindungi endpoint sweep manual.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Terapkan migration ke database Supabase (generate ulang dengan `npm run db:generate` kalau `src/db/schema.ts` berubah):
   ```bash
   npm run db:migrate
   ```
4. Jalankan setup satu kali di Supabase SQL Editor (lihat bagian [Setup Supabase Manual](#setup-supabase-manual-sql-editor) di bawah) — bucket Storage + RLS policy, dan pg_cron untuk sweep iklan kedaluwarsa.
5. Jalankan development server:
   ```bash
   npm run dev
   ```

## Setup Supabase Manual (SQL Editor)

Dua hal ini tidak otomatis lewat migration Drizzle, jalankan sekali lewat **Supabase Dashboard → SQL Editor**:

### 1. Bucket Storage untuk upload foto

```sql
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

create policy "Public read uploads"
on storage.objects for select
using (bucket_id = 'uploads');

create policy "Authenticated users can upload"
on storage.objects for insert
to authenticated
with check (bucket_id = 'uploads');

create policy "Users can update own uploads"
on storage.objects for update
to authenticated
using (bucket_id = 'uploads' and (storage.foldername(name))[2] = auth.uid()::text);

create policy "Users can delete own uploads"
on storage.objects for delete
to authenticated
using (bucket_id = 'uploads' and (storage.foldername(name))[2] = auth.uid()::text);
```

### 2. Sweep iklan kedaluwarsa per jam (pg_cron)

Vercel Cron di plan Hobby dibatasi maksimal 1x/hari, jadi sweep per jam dijalankan langsung di database lewat `pg_cron`, bukan `vercel.json`:

```sql
create extension if not exists pg_cron;

do $$
begin
  if exists (select 1 from cron.job where jobname = 'expire-listings-hourly') then
    perform cron.unschedule('expire-listings-hourly');
  end if;
end $$;

select cron.schedule(
  'expire-listings-hourly',
  '0 * * * *',
  $$
  update public.listings
  set status = 'Expired'
  where status = 'Active' and expires_at < now();
  $$
);
```

Kalau `create extension pg_cron` error, aktifkan dulu lewat **Database → Extensions** di dashboard Supabase.

Query publik (`isCurrentlyLive` di `src/lib/listings.ts`) sudah aman tanpa sweep ini — iklan yang lewat `expires_at` otomatis tidak muncul di galeri meski kolom `status` belum sempat di-update. Sweep ini murni menjaga akurasi dashboard admin/laporan.

## Deploy ke Vercel

1. Import repo ke Vercel, isi semua environment variable dari `.env.example` di **Project Settings → Environment Variables** (pakai `DATABASE_URL` yang **pooled**, port 6543, bukan direct connection — serverless function butuh connection pooling). Isi `NEXT_PUBLIC_APP_URL` dengan domain Vercel/domain custom kamu.
2. Jalankan migration ke database produksi dari lokal:
   ```bash
   DATABASE_URL="<connection-string-produksi>" npx drizzle-kit migrate
   ```
3. Jalankan [Setup Supabase Manual](#setup-supabase-manual-sql-editor) di atas terhadap project Supabase produksi (kalau belum).
4. Daftarkan webhook Mayar di dashboard Mayar (**Integration → Webhook**) ke:
   ```
   https://<domain-vercel-kamu>/api/webhooks/mayar
   ```
5. Deploy. Tidak ada konfigurasi cron di `vercel.json` — itu memang sengaja dipindah ke pg_cron (lihat di atas).

## Referensi Fitur

Dokumen spesifikasi fitur ada di [`docs/features/`](./docs/features/), mengikuti Fase 1–4 pada PRD. Dokumen fitur "Pesan Jasa" dan "Obrolan" **sengaja tidak disertakan** karena berada di luar cakupan platform (lihat PRD bagian 2 "Batasan Tanggung Jawab" dan bagian 8 "Catatan Tambahan").
