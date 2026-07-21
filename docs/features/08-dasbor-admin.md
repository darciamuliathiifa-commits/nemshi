# Dasbor Admin

Mengelola dan memantau seluruh aktivitas platform, dari pengguna hingga transaksi, untuk admin Nemshi.

## Spesifikasi

### Tujuan
Memberikan admin kemampuan untuk mengelola dan memantau seluruh aktivitas platform Nemshi, mulai dari pengguna, jasa, transaksi, moderasi konten, kategori, refund, hingga laporan bisnis dalam satu dasbor terpusat.
### Selesai bila
- Admin dapat melihat daftar seluruh pengguna terdaftar, mencari, dan memverifikasi akun secara manual.
- Admin dapat meninjau dan memoderasi semua daftar jasa yang dipublikasikan untuk mencegah penipuan.
- Admin dapat melihat riwayat transaksi pembayaran publikasi, paket, dan donasi dengan status terkini.
- Admin dapat mengakses antrean konten (iklan dan job posting) yang menunggu moderasi sebelum tayang.
- Admin dapat mengelola daftar kategori jasa dan memproses pengembalian dana untuk iklan yang ditolak sebelum tayang.
- Admin melihat metrik bisnis utama seperti total pendapatan, rata-rata klik WhatsApp per kategori, dan rasio perpanjangan iklan.

## Sub-fitur: Kelola Pengguna

Pantau dan kelola semua akun pengguna yang terdaftar di platform, termasuk verifikasi manual jika dibutuhkan.

### Tujuan
Memungkinkan admin memantau dan mengelola data akun pengguna serta melakukan verifikasi manual untuk meningkatkan kepercayaan komunitas.
### Selesai bila
- Admin melihat tabel semua pengguna dengan kolom nama, email, status verifikasi, dan tanggal daftar.
- Admin dapat mencari pengguna berdasarkan nama atau email.
- Admin dapat menandai pengguna sebagai "Terverifikasi" secara manual dan melihat riwayat verifikasi.

## Sub-fitur: Kelola Jasa

Tinjau dan moderasi daftar jasa yang dipublikasikan oleh penyedia agar bebas dari penipuan.

### Tujuan
Memberikan admin kemampuan untuk meninjau dan mengambil tindakan terhadap daftar jasa yang mencurigakan agar direktori tetap aman dan bebas penipuan.
### Selesai bila
- Admin melihat daftar semua jasa dengan filter berdasarkan status (Aktif, Ditangguhkan, Ditolak).
- Admin dapat melihat detail jasa lengkap termasuk foto, deskripsi, dan link WhatsApp.
- Admin dapat menangguhkan atau menghapus jasa yang melanggar, disertai alasan yang tercatat.

## Sub-fitur: Pantau Transaksi

Lihat semua transaksi yang terjadi di platform untuk memastikan kelancaran bisnis.

### Tujuan
Menyajikan seluruh transaksi pembayaran di platform agar admin dapat memastikan kelancaran bisnis dan menangani masalah pembayaran.
### Selesai bila
- Admin melihat tabel kronologis transaksi dengan kolom: ID Transaksi, Nama Pengguna, Tipe (Iklan/Paket/Donasi), Jumlah, Status (Berhasil/Gagal/Refund), dan Tanggal.
- Admin dapat memfilter transaksi berdasarkan tipe, status, atau rentang tanggal.
- Admin dapat melihat detail transaksi (misalnya, iklan atau paket yang dibeli) dengan mengklik baris transaksi.

## Sub-fitur: Manajemen Moderasi Konten

Antrean review untuk memeriksa iklan dan job posting sebelum ditayangkan ke publik.

### Tujuan
Menyediakan antrean terstruktur bagi admin untuk memeriksa dan menyetujui/menolak iklan jasa maupun permintaan job sebelum dipublikasikan.
### Selesai bila
- Admin melihat dua tab terpisah: "Iklan Menunggu" dan "Cari Jasa Menunggu", masing-masing menampilkan kartu konten dengan tombol Setuju dan Tolak.
- Setiap kartu menampilkan informasi utama: judul, pengunggah, tanggal diajukan, dan thumbnail (untuk iklan jasa).
- Ketika konten disetujui, langsung berubah status menjadi "Tayang" dan muncul notifikasi sukses. Jika ditolak, admin wajib mengisi alasan penolakan sebelum menyimpan.

## Sub-fitur: Manajemen Kategori & Refund

Alat bagi admin untuk mengelola daftar kategori jasa dan memproses pengembalian biaya jika iklan ditolak sebelum tayang.

### Tujuan
Memberi admin kendali untuk menambah/menonaktifkan kategori jasa dan memproses pengembalian dana untuk iklan yang ditolak sebelum penayangan.
### Selesai bila
- Admin dapat menambah kategori baru, mengubah nama kategori, atau menonaktifkan (nonaktif tidak ditampilkan di frontend) kategori yang ada melalui form sederhana.
- Daftar kategori tertampil jelas dengan status aktif/tidak.
- Untuk refund, admin melihat daftar permintaan refund otomatis (dari iklan ditolak sebelum tayang) dan dapat mengonfirmasi pengembalian dana dengan satu klik, yang akan mengembalikan saldo ke pengguna dan mencatat status refund.

## Sub-fitur: Dashboard Laporan Bisnis

Metrik pertumbuhan platform meliputi total pendapatan iklan, rata-rata klik WhatsApp per kategori, dan rasio perpanjangan iklan.

### Tujuan
Menyajikan metrik pertumbuhan platform secara visual untuk membantu admin mengambil keputusan bisnis.
### Selesai bila
- Admin melihat ringkasan angka utama: Total Pendapatan Iklan (format Rupiah), Rata-rata Klik WA per Kategori, dan Rasio Perpanjangan Iklan (%).
- Terdapat grafik atau tabel pendapatan bulanan serta tren klik WA per kategori (minimal 3 bulan terakhir).
- Data diperbarui otomatis dan dapat diunduh dalam format CSV.

## Task

### 1. Buat halaman manajemen kategori dengan data tiruan

### 2. Bangun layout utama Admin Dashboard dengan navigasi sidebar dan data tiruan

### 3. Buat halaman antrean moderasi dengan data tiruan

### 4. Buat halaman dashboard dengan layout responsif

### 5. Buat komponen form tambah dan ubah nama kategori

### 6. Buat komponen kartu Total Pendapatan Iklan

### 7. Buat halaman Kelola Pengguna dengan tabel, pencarian, dan tombol verifikasi manual (data tiruan)

### 8. Buat tampilan detail konten dalam modal atau drawer

### 9. Buat halaman Kelola Jasa dengan tabel filter status, detail, dan aksi suspend/delete (data tiruan)

### 10. Buat tombol setujui & tolak lengkap dengan form alasan penolakan

### 11. Buat komponen toggle nonaktifkan kategori

### 12. Buat komponen periode filter tanggal

### 13. Buat halaman Pantau Transaksi dengan tabel kronologis, filter, dan detail transaksi (data tiruan)

### 14. Buat filter dan status visual pada kartu konten antrean

### 15. Buat komponen tabel Rata-rata Klik WhatsApp per Kategori

### 16. Buat halaman daftar iklan ditolak dengan status refund

### 17. Buat komponen grafik batang Klik WhatsApp per Kategori

### 18. Buat komponen ringkasan nominal refund

### 19. Buat halaman riwayat moderasi dengan data tiruan

### 20. Buat antrean moderasi konten dengan tab Iklan dan Cari Jasa, kartu konten, serta form alasan penolakan (data tiruan)

### 21. Buat komponen tombol tandai refund selesai

### 22. Buat halaman Manajemen Kategori & Refund: daftar/detail/form kategori dan daftar refund + konfirmasi (data tiruan)

### 23. Buat komponen metrik Rasio Perpanjangan Iklan

### 24. Buat migrasi status moderasi di tabel konten

### 25. Buat komponen log aktivitas admin

### 26. Terapkan palet warna Nemshi dan tipografi global

### 27. Buat komponen Dashboard Laporan Bisnis dengan metrik, grafik tren, dan tombol unduh CSV (data tiruan)

### 28. Buat endpoint ambil daftar konten menunggu moderasi

### 29. Buat migrasi tabel transaksi iklan

### 30. Buat tabel kategori dan migrasi database

### 31. Buat endpoint setujui konten oleh admin

### 32. Buat endpoint API untuk daftar dan pencarian pengguna serta perbarui status verifikasi manual

### 33. Buat endpoint tolak konten beserta alasan penolakan

### 34. Buat endpoint API daftar jasa dengan filter status, detail jasa, serta suspend/delete beserta pencatatan alasan

### 35. Buat migrasi tabel klik WhatsApp

### 36. Buat tabel iklan ditolak dan migrasi database

### 37. Buat tabel refund dan migrasi database

### 38. Buat endpoint API daftar transaksi dengan filter tipe/status/rentang tanggal dan detail transaksi

### 39. Buat notifikasi status konten ke pengguna

### 40. Buat migrasi tabel perpanjangan iklan

### 41. Buat endpoint total pendapatan iklan

### 42. Buat tabel log aktivitas admin dan migrasi

### 43. Buat endpoint riwayat moderasi untuk admin

### 44. Buat endpoint API antrean konten pending, setujui/tolak iklan dan job dengan alasan, serta perbarui status tayang

### 45. Buat endpoint API CRUD untuk pengelolaan kategori jasa

### 46. Buat API CRUD kategori jasa

### 47. Buat endpoint rata-rata klik WhatsApp per kategori

### 48. Buat endpoint API untuk daftar permintaan refund otomatis dan konfirmasi pengembalian dana dengan pencatatan saldo

### 49. Buat API daftar iklan ditolak dengan status refund

### 50. Buat endpoint rasio perpanjangan iklan

### 51. Buat endpoint API laporan bisnis untuk metrik utama, pendapatan bulanan, tren klik WA, dan ekspor CSV

### 52. Buat API proses refund selesai

### 53. Buat service pencatatan log aktivitas
