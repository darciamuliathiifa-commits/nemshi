# Keamanan Komunitas

Fitur pelaporan iklan mencurigakan dan kebijakan suspend permanen bagi pelanggaran berat, menjaga keamanan dan kenyamanan direktori.

## Spesifikasi

### Tujuan
Fitur pelaporan iklan mencurigakan dan kebijakan suspend permanen menjaga keamanan komunitas dengan memberi pengguna cara melaporkan konten yang tidak pantas atau mencurigakan, serta menegakkan konsekuensi tegas bagi pelanggaran berat.

### Selesai bila
- Setiap iklan menampilkan tombol "Laporkan" yang dapat diakses oleh pengguna yang telah masuk.
- Menekan tombol "Laporkan" membuka formulir sederhana dengan pilihan alasan (contoh: penipuan, informasi palsu, spam, atau konten tidak pantas) dan kolom keterangan tambahan.
- Laporan yang dikirim masuk ke daftar moderasi admin dengan status "Belum Ditinjau", lengkap dengan tautan ke iklan terkait.
- Admin dapat meninjau laporan, lalu menangguhkan iklan dan/atau akun pengguna pelanggar secara permanen melalui panel moderasi.
- Akun yang ditangguhkan permanen tidak dapat mengakses platform, termasuk memasang iklan baru atau menggunakan fitur lainnya.
- Pengguna pelapor menerima notifikasi bahwa laporan telah diterima dan sedang ditinjau (tanpa mengungkap tindakan spesifik).

## Task

### 1. Buat halaman utama laporan admin dengan data tiruan

### 2. Buat komponen tombol Laporkan pada iklan

### 3. Buat formulir laporan dengan pilihan alasan

### 4. Buat komponen notifikasi setelah kirim laporan

### 5. Buat komponen notifikasi laporan ditindak

### 6. Buat tabel laporan dan migrasi database

### 7. Buat endpoint API untuk kirim laporan

### 8. Buat endpoint API untuk ambil semua laporan admin

### 9. Buat endpoint API suspend permanen penyedia

### 10. Buat endpoint API tandai laporan selesai

### 11. Buat logika kirim notifikasi ke pelapor
