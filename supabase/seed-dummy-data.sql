-- Nemshi — dummy/demo data untuk Supabase (production/staging).
-- Jalankan sekali lewat Supabase Dashboard -> SQL Editor.
-- Aman dijalankan berkali-kali: kategori/area/user pakai ON CONFLICT
-- berdasarkan slug/email, listing & data turunannya pakai id tetap
-- dengan ON CONFLICT (id) DO NOTHING.
--
-- Catatan: pengguna dummy di sini TIDAK terhubung ke akun Supabase Auth
-- manapun (tidak bisa dipakai untuk login) — cuma untuk mengisi tampilan
-- direktori (Galeri Iklan, Kata Mereka, dsb) supaya tidak kosong.

begin;

-- ============ Kategori (maks. 3 sesuai PRD) ============
insert into categories (id, name, slug, icon) values
  ('00000000-0000-0000-0000-000000000001', 'Jasa Titip/Antar', 'jasa-titip-antar', '📦'),
  ('00000000-0000-0000-0000-000000000002', 'Pindahan', 'pindahan', '🚚'),
  ('00000000-0000-0000-0000-000000000003', 'Jasa Akademik/Penerjemahan', 'jasa-akademik-penerjemahan', '📚')
on conflict (slug) do nothing;

-- ============ Area ============
insert into areas (id, name, slug) values
  ('00000000-0000-0000-0000-000000000011', 'Kairo', 'kairo'),
  ('00000000-0000-0000-0000-000000000012', 'Alexandria', 'alexandria'),
  ('00000000-0000-0000-0000-000000000013', 'Mansoura', 'mansoura'),
  ('00000000-0000-0000-0000-000000000014', 'Tanta', 'tanta')
on conflict (slug) do nothing;

-- ============ Pengguna dummy ============
insert into users (id, full_name, email, verification_status, avatar_url, whatsapp_link) values
  ('00000000-0000-0000-0000-000000000021', 'Amina Zahra', 'amina@example.com', 'Skill_Verified', '/seed/avatar-az.png', 'https://wa.me/201111111111'),
  ('00000000-0000-0000-0000-000000000022', 'Budi Santoso', 'budi@example.com', 'Identity_Verified', '/seed/avatar-bs.png', 'https://wa.me/201222222222'),
  ('00000000-0000-0000-0000-000000000023', 'Citra Dewi', 'citra@example.com', 'Unverified', '/seed/avatar-cd.png', 'https://wa.me/201333333333'),
  ('00000000-0000-0000-0000-000000000024', 'Dedi Kurniawan', 'dedi@example.com', 'Skill_Verified', '/seed/avatar-dk.png', 'https://wa.me/201444444444'),
  ('00000000-0000-0000-0000-000000000025', 'Eka Fitriani', 'eka@example.com', 'Skill_Verified', '/seed/avatar-ef.png', 'https://wa.me/201666666666'),
  ('00000000-0000-0000-0000-000000000026', 'Galih Hartono', 'galih@example.com', 'Identity_Verified', '/seed/avatar-gh.png', 'https://wa.me/201777777777')
on conflict (email) do nothing;

-- ============ Iklan Tawarkan Jasa (Offers_Service) ============
insert into listings (
  id, user_id, category_id, area_id, title, description, whatsapp_link,
  price_type, price_min, price_max, status, type, published_at, expires_at,
  is_priority, moderation_reason
) values
  ('00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011',
   'Titip Beli & Antar Barang dari Indonesia ke Kairo',
   'Melayani jasa titip beli oleh-oleh, bumbu dapur, dan kebutuhan sehari-hari dari Indonesia untuk Masisir di Kairo. Pengiriman aman dan terpercaya.',
   'https://wa.me/201111111111', 'Range', 50, 300, 'Active', 'Offers_Service', now(), now() + interval '30 days', true, null),

  ('00000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011',
   'Jasa Titip Kirim & Legalisir Dokumen ke Kedutaan',
   'Bantu antar dan urus dokumen yang perlu legalisir/tanda tangan ke Kedutaan Besar RI Kairo. Cocok untuk yang lokasinya jauh atau sedang sibuk kuliah.',
   'https://wa.me/201222222222', 'Range', 30, 80, 'Active', 'Offers_Service', now(), now() + interval '30 days', false, null),

  ('00000000-0000-0000-0000-000000000033', '00000000-0000-0000-0000-000000000025', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000012',
   'Titip Beli Bumbu Dapur & Kebutuhan Masak Indonesia',
   'Stok bumbu dapur khas Indonesia (kecap, sambal, bumbu instan) selalu ready untuk dititip ke seluruh area Alexandria. Update stok tiap minggu.',
   'https://wa.me/201666666666', 'Range', 40, 150, 'Active', 'Offers_Service', now(), now() + interval '30 days', false, null),

  ('00000000-0000-0000-0000-000000000034', '00000000-0000-0000-0000-000000000026', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011',
   'Jasa Antar Jemput Bandara Kairo 24 Jam',
   'Antar jemput bandara Kairo (CAI) kapan saja, termasuk dini hari. Mobil nyaman, sopir berpengalaman rute Masisir. Booking H-1 lebih diutamakan.',
   'https://wa.me/201777777777', 'Range', 100, 250, 'Active', 'Offers_Service', now(), now() + interval '30 days', true, null),

  ('00000000-0000-0000-0000-000000000035', '00000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000014',
   'Titip Oleh-Oleh dari Indonesia ke Tanta',
   'Baru pulang kampung bulan depan, terima titipan oleh-oleh/barang kecil buat dibawa balik ke Tanta. Slot terbatas.',
   'https://wa.me/201444444444', 'Contact', null, null, 'Pending_Moderation', 'Offers_Service', null, null, false, null),

  ('00000000-0000-0000-0000-000000000036', '00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000011',
   'Jasa Pindahan Kost Masisir Area Kairo & Sekitarnya',
   'Bantu pindahan kost/apartemen dengan mobil pickup pribadi. Cepat, hati-hati dengan barang, dan harga bersahabat untuk mahasiswa.',
   'https://wa.me/201222222222', 'Contact', null, null, 'Active', 'Offers_Service', now(), now() + interval '30 days', false, null),

  ('00000000-0000-0000-0000-000000000037', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000014',
   'Sewa Mobil + Sopir untuk Pindahan Barang Besar',
   'Sewa mobil box untuk pindahan barang berukuran besar seperti kasur dan lemari. Tersedia sopir berpengalaman area Tanta dan sekitarnya.',
   'https://wa.me/201555555555', 'Range', 150, 400, 'Active', 'Offers_Service', now(), now() + interval '30 days', true, null),

  ('00000000-0000-0000-0000-000000000038', '00000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000012',
   'Jasa Angkut Barang Pindahan Alexandria',
   'Tenaga angkut barang untuk pindahan apartemen di area Alexandria. Bisa borongan atau per jam, tim 2 orang siap bantu naik-turun tangga.',
   'https://wa.me/201333333333', 'Range', 80, 200, 'Active', 'Offers_Service', now(), now() + interval '30 days', false, null),

  ('00000000-0000-0000-0000-000000000039', '00000000-0000-0000-0000-000000000026', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000013',
   'Pindahan Kilat Same-Day Area Mansoura',
   'Butuh pindah hari ini juga? Layanan pindahan same-day area Mansoura, konfirmasi pagi bisa selesai sore. Termasuk bongkar-pasang perabot ringan.',
   'https://wa.me/201777777777', 'Range', 100, 300, 'Active', 'Offers_Service', now(), now() + interval '30 days', false, null),

  ('00000000-0000-0000-0000-00000000003a', '00000000-0000-0000-0000-000000000025', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000011',
   'Jasa Packing & Pindahan Apartemen Rapi',
   'Paket lengkap packing barang pecah belah + angkut pindahan apartemen. Dus dan bubble wrap disediakan.',
   'https://wa.me/201666666666', 'Range', 120, 350, 'Rejected', 'Offers_Service', null, null, false,
   'Deskripsi kurang jelas soal cakupan area layanan, mohon dilengkapi dan diajukan ulang.'),

  ('00000000-0000-0000-0000-00000000003b', '00000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000012',
   'Jasa Terjemah Bahasa Arab-Indonesia untuk Tugas Kuliah',
   'Menerima jasa terjemahan dokumen akademik, muqarrar, dan makalah Bahasa Arab ke Indonesia maupun sebaliknya. Berpengalaman menerjemahkan lebih dari 100 dokumen.',
   'https://wa.me/201333333333', 'Range', 20, 100, 'Active', 'Offers_Service', now(), now() + interval '30 days', false, null),

  ('00000000-0000-0000-0000-00000000003c', '00000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000013',
   'Les Privat Nahwu-Shorof untuk Mahasiswa Baru',
   'Membantu adik-adik mahasiswa baru memahami dasar Nahwu-Shorof dengan metode yang mudah dipahami. Bisa online maupun tatap muka di Mansoura.',
   'https://wa.me/201444444444', 'Contact', null, null, 'Active', 'Offers_Service', now(), now() + interval '30 days', false, null),

  ('00000000-0000-0000-0000-00000000003d', '00000000-0000-0000-0000-000000000025', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000011',
   'Jasa Proofread & Edit Skripsi Bahasa Indonesia',
   'Bantu proofread, rapikan tata bahasa, dan cek konsistensi sitasi skripsi/tugas akhir berbahasa Indonesia. Pengalaman 3 tahun jadi editor jurnal kampus.',
   'https://wa.me/201666666666', 'Range', 50, 200, 'Active', 'Offers_Service', now(), now() + interval '30 days', true, null),

  ('00000000-0000-0000-0000-00000000003e', '00000000-0000-0000-0000-000000000026', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000014',
   'Terjemah Tersumpah Dokumen Akademik & Legal',
   'Jasa terjemahan dokumen akademik (ijazah, transkrip) dan legal Arab-Indonesia, hasil rapi dan bisa dipakai untuk keperluan resmi.',
   'https://wa.me/201777777777', 'Range', 60, 250, 'Active', 'Offers_Service', now(), now() + interval '30 days', false, null)
on conflict (id) do nothing;

-- ============ Permintaan Cari Jasa (Needs_Service) ============
insert into listings (
  id, user_id, category_id, area_id, title, description, whatsapp_link,
  price_type, price_min, price_max, status, type, published_at, expires_at,
  is_priority, paid_with_quota
) values
  ('00000000-0000-0000-0000-000000000041', '00000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000012',
   'Dicari: Tutor Bahasa Inggris untuk Persiapan IELTS',
   'Mencari tutor Bahasa Inggris berpengalaman untuk membantu persiapan IELTS selama 1 bulan. Lebih disukai yang berpengalaman mengajar mahasiswa.',
   'https://wa.me/201333333333', 'Contact', null, null, 'Active', 'Needs_Service', now(), now() + interval '24 hours', false, false),

  ('00000000-0000-0000-0000-000000000042', '00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000011',
   'Dicari: Jasa Pindahan Kilat Weekend Ini',
   'Butuh bantuan pindahan kost Sabtu ini, barang tidak terlalu banyak tapi ada kasur dan lemari kecil. Area Kairo.',
   'https://wa.me/201222222222', 'Contact', null, null, 'Active', 'Needs_Service', now(), now() + interval '3 days', true, false),

  ('00000000-0000-0000-0000-000000000043', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000011',
   'Dicari: Penerjemah Dokumen Visa Tersumpah',
   'Cari jasa penerjemah tersumpah untuk dokumen pengajuan visa, butuh cepat karena deadline minggu depan.',
   'https://wa.me/201111111111', 'Contact', null, null, 'Active', 'Needs_Service', now(), now() + interval '24 hours', false, false),

  ('00000000-0000-0000-0000-000000000044', '00000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000013',
   'Dicari: Rekomendasi Jasa Titip Buku dari Indonesia',
   'Ada yang lagi pulang Indonesia dalam waktu dekat dan bisa titip buku pelajaran? Beratnya sekitar 3kg.',
   'https://wa.me/201444444444', 'Contact', null, null, 'Active', 'Needs_Service', now(), now() + interval '24 hours', false, false),

  ('00000000-0000-0000-0000-000000000045', '00000000-0000-0000-0000-000000000026', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000014',
   'Dicari: Jasa Angkut Motor ke Tanta',
   'Butuh jasa angkut motor dari Kairo ke Tanta, sudah siap bayar prioritas biar cepat dapat penyedia.',
   'https://wa.me/201777777777', 'Contact', null, null, 'Pending_Moderation', 'Needs_Service', null, null, true, false)
on conflict (id) do nothing;

-- ============ Foto listing (2-3 per iklan Tawarkan Jasa) ============
insert into listing_photos (id, listing_id, url, sort_order) values
  ('00000000-0000-0000-0000-000000000131', '00000000-0000-0000-0000-000000000031', '/seed/titip-antar-1.png', 0),
  ('00000000-0000-0000-0000-000000000132', '00000000-0000-0000-0000-000000000031', '/seed/titip-antar-2.png', 1),
  ('00000000-0000-0000-0000-000000000133', '00000000-0000-0000-0000-000000000031', '/seed/titip-antar-3.png', 2),

  ('00000000-0000-0000-0000-000000000134', '00000000-0000-0000-0000-000000000032', '/seed/titip-antar-2.png', 0),
  ('00000000-0000-0000-0000-000000000135', '00000000-0000-0000-0000-000000000032', '/seed/titip-antar-3.png', 1),
  ('00000000-0000-0000-0000-000000000136', '00000000-0000-0000-0000-000000000032', '/seed/titip-antar-4.png', 2),

  ('00000000-0000-0000-0000-000000000137', '00000000-0000-0000-0000-000000000033', '/seed/titip-antar-3.png', 0),
  ('00000000-0000-0000-0000-000000000138', '00000000-0000-0000-0000-000000000033', '/seed/titip-antar-4.png', 1),
  ('00000000-0000-0000-0000-000000000139', '00000000-0000-0000-0000-000000000033', '/seed/titip-antar-1.png', 2),

  ('00000000-0000-0000-0000-00000000013a', '00000000-0000-0000-0000-000000000034', '/seed/titip-antar-4.png', 0),
  ('00000000-0000-0000-0000-00000000013b', '00000000-0000-0000-0000-000000000034', '/seed/titip-antar-1.png', 1),
  ('00000000-0000-0000-0000-00000000013c', '00000000-0000-0000-0000-000000000034', '/seed/titip-antar-2.png', 2),

  ('00000000-0000-0000-0000-00000000013d', '00000000-0000-0000-0000-000000000035', '/seed/titip-antar-1.png', 0),
  ('00000000-0000-0000-0000-00000000013e', '00000000-0000-0000-0000-000000000035', '/seed/titip-antar-2.png', 1),

  ('00000000-0000-0000-0000-000000000141', '00000000-0000-0000-0000-000000000036', '/seed/pindahan-1.png', 0),
  ('00000000-0000-0000-0000-000000000142', '00000000-0000-0000-0000-000000000036', '/seed/pindahan-2.png', 1),
  ('00000000-0000-0000-0000-000000000143', '00000000-0000-0000-0000-000000000036', '/seed/pindahan-3.png', 2),

  ('00000000-0000-0000-0000-000000000144', '00000000-0000-0000-0000-000000000037', '/seed/pindahan-2.png', 0),
  ('00000000-0000-0000-0000-000000000145', '00000000-0000-0000-0000-000000000037', '/seed/pindahan-3.png', 1),
  ('00000000-0000-0000-0000-000000000146', '00000000-0000-0000-0000-000000000037', '/seed/pindahan-4.png', 2),

  ('00000000-0000-0000-0000-000000000147', '00000000-0000-0000-0000-000000000038', '/seed/pindahan-3.png', 0),
  ('00000000-0000-0000-0000-000000000148', '00000000-0000-0000-0000-000000000038', '/seed/pindahan-4.png', 1),
  ('00000000-0000-0000-0000-000000000149', '00000000-0000-0000-0000-000000000038', '/seed/pindahan-1.png', 2),

  ('00000000-0000-0000-0000-00000000014a', '00000000-0000-0000-0000-000000000039', '/seed/pindahan-4.png', 0),
  ('00000000-0000-0000-0000-00000000014b', '00000000-0000-0000-0000-000000000039', '/seed/pindahan-1.png', 1),
  ('00000000-0000-0000-0000-00000000014c', '00000000-0000-0000-0000-000000000039', '/seed/pindahan-2.png', 2),

  ('00000000-0000-0000-0000-00000000014d', '00000000-0000-0000-0000-00000000003a', '/seed/pindahan-1.png', 0),
  ('00000000-0000-0000-0000-00000000014e', '00000000-0000-0000-0000-00000000003a', '/seed/pindahan-2.png', 1),

  ('00000000-0000-0000-0000-000000000151', '00000000-0000-0000-0000-00000000003b', '/seed/akademik-1.png', 0),
  ('00000000-0000-0000-0000-000000000152', '00000000-0000-0000-0000-00000000003b', '/seed/akademik-2.png', 1),
  ('00000000-0000-0000-0000-000000000153', '00000000-0000-0000-0000-00000000003b', '/seed/akademik-3.png', 2),

  ('00000000-0000-0000-0000-000000000154', '00000000-0000-0000-0000-00000000003c', '/seed/akademik-2.png', 0),
  ('00000000-0000-0000-0000-000000000155', '00000000-0000-0000-0000-00000000003c', '/seed/akademik-3.png', 1),
  ('00000000-0000-0000-0000-000000000156', '00000000-0000-0000-0000-00000000003c', '/seed/akademik-4.png', 2),

  ('00000000-0000-0000-0000-000000000157', '00000000-0000-0000-0000-00000000003d', '/seed/akademik-3.png', 0),
  ('00000000-0000-0000-0000-000000000158', '00000000-0000-0000-0000-00000000003d', '/seed/akademik-4.png', 1),
  ('00000000-0000-0000-0000-000000000159', '00000000-0000-0000-0000-00000000003d', '/seed/akademik-1.png', 2),

  ('00000000-0000-0000-0000-00000000015a', '00000000-0000-0000-0000-00000000003e', '/seed/akademik-4.png', 0),
  ('00000000-0000-0000-0000-00000000015b', '00000000-0000-0000-0000-00000000003e', '/seed/akademik-1.png', 1)
on conflict (id) do nothing;

-- ============ Kuota Paket Plus contoh ============
insert into user_quotas (id, user_id, quota_type, remaining_amount, validity_end) values
  ('00000000-0000-0000-0000-000000000061', '00000000-0000-0000-0000-000000000021', 'Listing_Slot', 2, now() + interval '90 days'),
  ('00000000-0000-0000-0000-000000000062', '00000000-0000-0000-0000-000000000021', 'Priority_Slot', 1, now() + interval '90 days'),
  ('00000000-0000-0000-0000-000000000063', '00000000-0000-0000-0000-000000000026', 'Listing_Slot', 3, now() + interval '90 days'),
  ('00000000-0000-0000-0000-000000000064', '00000000-0000-0000-0000-000000000026', 'Priority_Slot', 2, now() + interval '90 days')
on conflict (id) do nothing;

-- ============ Testimoni ============
insert into testimonials (id, reviewee_user_id, reviewer_name, rating, comment) values
  ('00000000-0000-0000-0000-000000000071', '00000000-0000-0000-0000-000000000021', 'Fajar Ramadhan', 5, 'Titipan sampai cepat dan aman, terpercaya banget. Recommended!'),
  ('00000000-0000-0000-0000-000000000072', '00000000-0000-0000-0000-000000000021', 'Siti Nurhaliza', 4, 'Pelayanan ramah, barang dikemas rapi. Cuma agak lama responnya.'),
  ('00000000-0000-0000-0000-000000000073', '00000000-0000-0000-0000-000000000024', 'Rangga Pratama', 5, 'Penjelasannya mudah dipahami, jadi lebih siap ujian Nahwu-Shorof.'),
  ('00000000-0000-0000-0000-000000000074', '00000000-0000-0000-0000-000000000022', 'Wulan Sari', 5, 'Pindahan jadi gampang banget, mobilnya bersih dan sopirnya sopan.'),
  ('00000000-0000-0000-0000-000000000075', '00000000-0000-0000-0000-000000000025', 'Bagas Wicaksono', 4, 'Bumbu masak lengkap, tinggal pilih dan tunggu diantar. Praktis!'),
  ('00000000-0000-0000-0000-000000000076', '00000000-0000-0000-0000-000000000026', 'Nadia Ayu', 5, 'Jemput bandara tepat waktu meski saya landing tengah malam. Makasih banyak!')
on conflict (id) do nothing;

commit;
