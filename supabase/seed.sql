-- Nemshi — development/test seed data
-- Mirrors src/lib/mock-ads.ts so the real database shows the same catalog
-- the frontend mock currently renders. Local/dev only: creates matching
-- auth.users rows so the profiles/ads foreign keys are satisfiable outside
-- of a real Google OAuth sign-in. Safe to re-run (ON CONFLICT DO NOTHING).

create extension if not exists pgcrypto;

-- 1. Fake auth users (one per seller in the mock catalog).
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, email_change,
  email_change_token_new, recovery_token
)
values
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'ahmad.fauzan@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Ahmad Fauzan"}', '2022-03-10', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'siti.nuraini@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Siti Nur Aini"}', '2023-02-14', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'dapur.rindukampung@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Dapur Rindu Kampung"}', '2021-06-01', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'kalam.studio@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Kalam Studio"}', '2023-05-20', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated', 'rizky.pratama@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Rizky Pratama"}', '2020-01-15', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000006', 'authenticated', 'authenticated', 'muhammad.ridho@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Muhammad Ridho"}', '2019-09-05', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000007', 'authenticated', 'authenticated', 'fajar.nugraha@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Fajar Nugraha"}', '2022-08-22', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000008', 'authenticated', 'authenticated', 'nadia.ayu@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Nadia Ayu"}', '2021-04-11', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000009', 'authenticated', 'authenticated', 'toko.rempahibu@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Toko Rempah Ibu"}', '2020-11-30', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000010', 'authenticated', 'authenticated', 'bayu.kreatif@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Bayu Kreatif"}', '2023-01-08', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000011', 'authenticated', 'authenticated', 'hasan.albana@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Hasan Albana"}', '2018-07-19', now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000012', 'authenticated', 'authenticated', 'barbershop.abu@seed.nemshi.local', crypt('nemshi-seed', gen_salt('bf')), now(), '{"provider":"google","providers":["google"]}', '{"name":"Barbershop Abu"}', '2022-02-27', now(), '', '', '', '')
on conflict (id) do nothing;

-- 2. Public profiles matching those auth users.
insert into profiles (id, name, email, location, whatsapp_number, created_at)
values
  ('10000000-0000-0000-0000-000000000001', 'Ahmad Fauzan', 'ahmad.fauzan@seed.nemshi.local', 'Nasr City, Kairo', '201012345001', '2022-03-10'),
  ('10000000-0000-0000-0000-000000000002', 'Siti Nur Aini', 'siti.nuraini@seed.nemshi.local', 'Hay Asyir, Kairo', '201012345002', '2023-02-14'),
  ('10000000-0000-0000-0000-000000000003', 'Dapur Rindu Kampung', 'dapur.rindukampung@seed.nemshi.local', 'Hay Asyir, Kairo', '201012345003', '2021-06-01'),
  ('10000000-0000-0000-0000-000000000004', 'Kalam Studio', 'kalam.studio@seed.nemshi.local', 'Online', '201012345004', '2023-05-20'),
  ('10000000-0000-0000-0000-000000000005', 'Rizky Pratama', 'rizky.pratama@seed.nemshi.local', 'Madinat Nasr, Kairo', '201012345005', '2020-01-15'),
  ('10000000-0000-0000-0000-000000000006', 'Muhammad Ridho', 'muhammad.ridho@seed.nemshi.local', 'Hay Sabi'', Kairo', '201012345006', '2019-09-05'),
  ('10000000-0000-0000-0000-000000000007', 'Fajar Nugraha', 'fajar.nugraha@seed.nemshi.local', 'Nasr City, Kairo', '201012345007', '2022-08-22'),
  ('10000000-0000-0000-0000-000000000008', 'Nadia Ayu', 'nadia.ayu@seed.nemshi.local', 'Online', '201012345008', '2021-04-11'),
  ('10000000-0000-0000-0000-000000000009', 'Toko Rempah Ibu', 'toko.rempahibu@seed.nemshi.local', 'Hay Asyir, Kairo', '201012345009', '2020-11-30'),
  ('10000000-0000-0000-0000-000000000010', 'Bayu Kreatif', 'bayu.kreatif@seed.nemshi.local', 'Online', '201012345010', '2023-01-08'),
  ('10000000-0000-0000-0000-000000000011', 'Hasan Albana', 'hasan.albana@seed.nemshi.local', 'Madinat Nasr, Kairo', '201012345011', '2018-07-19'),
  ('10000000-0000-0000-0000-000000000012', 'Barbershop Abu', 'barbershop.abu@seed.nemshi.local', 'Hay Sabi'', Kairo', '201012345012', '2022-02-27')
on conflict (id) do nothing;

-- 3. Sample ads — same catalog as src/lib/mock-ads.ts.
insert into ads (
  id, owner_id, kind, title, description, category, price_label, location,
  status, condition, delivery_method, scope, estimated_duration, created_at
)
values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'jasa', 'Jasa Terjemah Dokumen Arab-Indonesia', 'Menerima jasa terjemah dokumen resmi maupun akademik dari Bahasa Arab ke Indonesia dan sebaliknya. Berpengalaman menerjemahkan surat keterangan, ijazah, dan tugas kuliah. Hasil terjemahan rapi dan bisa direvisi sesuai kebutuhan.', 'Pendidikan', 'Mulai Rp 50.000', 'Nasr City, Kairo', 'Aktif', null, null, 'Online & tatap muka', '1-2 hari kerja', now() - interval '2 hours'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'produk', 'Rice Cooker Mini 1.5L Bekas Pakai Rapi', 'Rice cooker mini 1.5L masih berfungsi normal, dipakai kurang lebih 8 bulan karena pindah kos. Body dan panci dalam kondisi bersih, tidak ada penyok. Cocok untuk anak kos.', 'Barang Baru & Bekas', 'Rp 350.000', 'Hay Asyir, Kairo', 'Aktif', 'Bekas', 'COD', null, null, now() - interval '5 hours'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'produk', 'Katering Harian Menu Nusantara', 'Menyediakan katering harian dengan menu rumahan khas Nusantara, ganti menu setiap hari. Bisa langganan mingguan atau bulanan. Pemesanan minimal H-1 sebelum jam makan.', 'Makanan & Minuman', 'Rp 25.000 / porsi', 'Hay Asyir, Kairo', 'Aktif', 'Baru', 'Antar Jemput', null, null, now() - interval '8 hours'),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'jasa', 'Desain Poster & Undangan Digital', 'Jasa desain poster acara, undangan digital, dan konten promosi organisasi. Termasuk 2x revisi dan file siap cetak/siap unggah. Portofolio bisa dilihat lewat WhatsApp.', 'Kreatif & Digital', 'Mulai Rp 75.000', 'Online', 'Aktif', null, null, 'Online', '2-3 hari kerja', now() - interval '12 hours'),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', 'jasa', 'Bantuan Pindahan & Angkut Barang', 'Membantu proses pindahan kos, angkut barang berat, dan bongkar muat. Tersedia armada kecil untuk barang dalam jumlah banyak. Harga menyesuaikan jarak dan volume barang.', 'Bantuan & Layanan Harian', 'Mulai Rp 150.000', 'Madinat Nasr, Kairo', 'Aktif', null, null, 'Area Kairo Raya', 'Sesuai jadwal', now() - interval '1 day'),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006', 'produk', 'Buku Paket Nahwu Shorof Edisi Lengkap', 'Paket buku Nahwu Shorof lengkap, kondisi masih bagus, sedikit coretan pensil di beberapa halaman. Cocok untuk mahasiswa baru yang butuh referensi dasar.', 'Pendidikan', 'Rp 120.000', 'Hay Sabi'', Kairo', 'Aktif', 'Bekas', 'COD', null, null, now() - interval '1 day 3 hours'),
  ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007', 'produk', 'Kasur Lipat Busa Ukuran Single', 'Kasur lipat busa baru, belum pernah dipakai, masih tersegel plastik. Ukuran single, praktis untuk kamar kos yang tidak terlalu luas.', 'Barang Baru & Bekas', 'Rp 450.000', 'Nasr City, Kairo', 'Aktif', 'Baru', 'Antar Jemput', null, null, now() - interval '2 days'),
  ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000008', 'jasa', 'Les Privat Bahasa Inggris & TOEFL', 'Les privat Bahasa Inggris untuk persiapan TOEFL ITP maupun percakapan sehari-hari. Materi disesuaikan dengan level dan target skor masing-masing peserta.', 'Pendidikan', 'Mulai Rp 60.000 / sesi', 'Online', 'Aktif', null, null, 'Online', '60 menit / sesi', now() - interval '2 days 3 hours'),
  ('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000009', 'produk', 'Kopi Nusantara Bubuk 250gr', 'Kopi bubuk asli Nusantara kemasan 250gr, dibawa langsung dari Indonesia. Cocok untuk yang kangen rasa kopi kampung halaman. Stok terbatas.', 'Makanan & Minuman', 'Rp 90.000', 'Hay Asyir, Kairo', 'Aktif', 'Baru', 'COD', null, null, now() - interval '3 days'),
  ('20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000010', 'jasa', 'Edit Video & Motion Graphic Konten Sosial Media', 'Jasa edit video reels/TikTok dan motion graphic sederhana untuk kebutuhan konten sosial media organisasi maupun personal. Termasuk 1x revisi minor.', 'Kreatif & Digital', 'Mulai Rp 100.000', 'Online', 'Aktif', null, null, 'Online', '3-4 hari kerja', now() - interval '3 days 3 hours'),
  ('20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000011', 'produk', 'Sepeda Lipat Second Terawat', 'Sepeda lipat kondisi terawat, rutin servis, ban dan rem masih bagus. Dijual karena mau pulang ke Indonesia. Bisa dicoba langsung sebelum deal.', 'Barang Baru & Bekas', 'Rp 1.200.000', 'Madinat Nasr, Kairo', 'Aktif', 'Bekas', 'COD', null, null, now() - interval '4 days'),
  ('20000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000012', 'jasa', 'Jasa Cukur Rambut Panggilan ke Kos', 'Jasa cukur rambut panggilan langsung ke kos, praktis tanpa perlu keluar. Model potongan menyesuaikan permintaan, bawa alat cukur sendiri yang bersih dan higienis.', 'Bantuan & Layanan Harian', 'Rp 70.000', 'Hay Sabi'', Kairo', 'Aktif', null, null, 'Panggilan area Kairo', '30 menit', now() - interval '5 days')
on conflict (id) do nothing;
