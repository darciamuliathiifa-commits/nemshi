# Cari Jasa (Job Posting)

Memublikasikan permintaan jasa oleh pencari jasa: gratis 1× per 30 hari tayang 24 jam, atau prioritas Rp12.000 tayang 3 hari dengan tampilan menonjol, lengkap dengan opsi budget.

## Spesifikasi

### Tujuan
Memungkinkan pencari jasa mempublikasikan kebutuhan (sayembara) secara gratis atau prioritas, menerima penawaran harga dari penyedia, lalu memilih penawaran terbaik.

### Selesai bila
- Pencari bisa membuat sayembara dengan pilihan tayang gratis (24 jam, 1×/30 hari) atau prioritas (Rp12.000, 3 hari) beserta detail kebutuhan, deskripsi, estimasi budget, dan tenggat.
- Penyedia bisa melihat daftar sayembara aktif, menyaring, dan mengirimkan penawaran harga.
- Pencari bisa melihat semua penawaran yang masuk, membandingkan harga, dan memilih satu pemenang.
- Sayembara otomatis kedaluwarsa sesuai durasi (24 jam atau 3 hari setelah tayang) dan tidak lagi menerima penawaran baru.
- Sistem membatasi pencari hanya 1 sayembara gratis dalam 30 hari, serta memberi tahu jika kuota habis.

## Sub-fitur: Jelajahi Sayembara (untuk Penyedia)

Cari dan telusuri daftar permintaan jasa yang masih aktif, lalu kirimkan penawaran harga untuk sayembara yang diminati.

### Tujuan
Penyedia jasa dapat mencari, menelusuri, dan mengirimkan penawaran harga untuk sayembara yang sedang aktif.

### Selesai bila
- Daftar sayembara aktif ditampilkan dalam bentuk kartu dengan informasi ringkas: judul, deskripsi singkat, estimasi budget, tenggat, dan jumlah penawaran yang sudah masuk.
- Tersedia fitur pencarian kata kunci, filter kategori, dan area.
- Detail sayembara menampilkan deskripsi lengkap, estimasi budget, tenggat, dan tombol “Kirim Penawaran”.
- Penyedia bisa mengisi formulir penawaran (harga yang ditawarkan, pesan pendek) dan mengirimkan; muncul notifikasi bahwa penawaran berhasil terkirim.

## Sub-fitur: Buat Sayembara

Isi detail kebutuhan (seperti pindahan rumah), deskripsi pekerjaan, estimasi budget, dan tenggat waktu pengerjaan.

### Tujuan
Pencari jasa dapat membuat sayembara baru dengan memilih tipe tayang, mengisi detail kebutuhan, dan menyelesaikan pembayaran untuk sayembara prioritas.

### Selesai bila
- Formulir pembuatan sayembara mencakup: judul, kategori, deskripsi pekerjaan, estimasi budget (angka pasti atau opsi “Budget via Kontak”), tenggat pengerjaan, dan pilihan tayang (Gratis atau Prioritas).
- Saat memilih Prioritas, pengguna diarahkan ke halaman pembayaran Rp12.000; setelah pembayaran berhasil, sayembara masuk ke antrean moderasi.
- Untuk tayang gratis, sistem memeriksa riwayat sayembara gratis dalam 30 hari terakhir; jika melebihi batas, tombol “Pasang Gratis” nonaktif disertai pesan kuota habis.
- Sayembara yang lolos moderasi otomatis tayang sesuai durasi (24 jam atau 3 hari) dan muncul di “Sayembara Saya”.

## Sub-fitur: Kelola Penawaran

Lihat daftar penyedia jasa yang berminat beserta penawaran harga mereka, bandingkan, dan pilih pemenang sayembara.

### Tujuan
Pencari jasa dapat melihat, membandingkan, dan menentukan pemenang dari penawaran yang masuk untuk sayembara miliknya.

### Selesai bila
- Halaman detail sayembara (milik pencari) menampilkan daftar penawaran: nama penyedia, harga yang ditawarkan, waktu penawaran, dan pesan (jika ada).
- Tersedia opsi urutkan penawaran berdasarkan harga termurah atau waktu terbaru.
- Tombol “Pilih sebagai Pemenang” aktif pada setiap penawaran; setelah dipilih, status sayembara menjadi “Selesai”, penyedia pemenang mendapat konfirmasi, dan penawaran lain tidak bisa dipilih lagi.
- Pemilihan pemenang hanya dapat dilakukan setelah sayembara berakhir (kedaluwarsa) atau kapan saja selama tayang, dan tindakan ini tidak dapat dibatalkan.

## Task

### 1. Buat halaman daftar sayembara aktif dengan data tiruan

### 2. Buat formulir pembuatan sayembara baru dengan data tiruan

### 3. Buat halaman detail sayembara dengan penawaran masuk tiruan

### 4. Implementasikan pencarian dan filter kategori sayembara

### 5. Buat formulir kirim penawaran dan tampilkan status penawaran

### 6. Buat halaman Sayembara Saya untuk pelanggan

### 7. Implementasikan pengurutan penawaran pada halaman detail

### 8. Tambahkan tombol pilih pemenang dan notifikasi tiruan

### 9. Buat model dan migrasi database untuk sayembara dan penawaran

### 10. Buat API endpoint daftar sayembara aktif dengan filter

### 11. Buat API endpoint untuk membuat sayembara baru

### 12. Buat API endpoint untuk mengirim penawaran pada sayembara

### 13. Buat API endpoint untuk melihat status penawaran penyedia

### 14. Buat API endpoint daftar sayembara milik pelanggan

### 15. Buat API endpoint detail sayembara dengan daftar penawaran masuk

### 16. Buat API endpoint untuk memilih pemenang sayembara dan notifikasi
