# Reputasi Pengiklan (Testimoni Profil)

Pengunjung dapat memberikan testimoni pada profil penyedia jasa berdasarkan pengalaman interaksi di luar platform, membangun kredibilitas dan reputasi.

## Spesifikasi

### Tujuan
Memungkinkan pengunjung memberikan testimoni di profil penyedia jasa berdasarkan pengalaman interaksi di luar platform, sehingga membangun kredibilitas dan reputasi penyedia.
### Selesai bila
- Profil penyedia jasa menampilkan daftar testimoni dari pengguna lain, termasuk rating bintang dan teks ulasan.
- Pengguna dapat membuka halaman profil penyedia dan melihat rata-rata rating serta jumlah testimoni.
- Setiap testimoni menampilkan nama pemberi, rating, teks ulasan, dan waktu pemberian.
- Admin dapat melihat dan mengelola semua testimoni yang masuk.

## Sub-fitur: Beri Penilaian

Berikan rating bintang untuk jasa yang telah kamu gunakan.

### Tujuan
Memberikan rating bintang untuk jasa yang telah digunakan sebagai bagian dari testimoni.
### Selesai bila
- Pengguna dapat memilih rating 1 sampai 5 bintang dengan interaksi klik atau sentuh.
- Rating yang dipilih tersimpan dan langsung muncul bersama data testimoni lainnya.
- Rata-rata rating penyedia jasa diperbarui otomatis setiap kali ada rating baru.

## Sub-fitur: Tulis Ulasan

Bagikan pengalamanmu secara tertulis setelah menggunakan jasa.

### Tujuan
Menyediakan ruang bagi pengguna untuk berbagi pengalaman tertulis tentang jasa yang digunakan.
### Selesai bila
- Tersedia kolom isian teks (minimal beberapa kata, misal 10 karakter) untuk ulasan saat memberikan testimoni.
- Ulasan yang dikirim tersimpan dan tampil di profil penyedia bersama nama pemberi dan rating.
- Ulasan ditampilkan lengkap tanpa potongan di halaman profil (atau dengan opsi "baca selengkapnya" jika terlalu panjang).

## Task

### 1. Buat halaman profil penyedia dengan daftar testimoni tiruan

### 2. Buat komponen rating bintang interaktif

### 3. Integrasikan form testimoni ke halaman profil menggunakan data tiruan

### 4. Buat form ulasan teks dengan validasi minimal

### 5. Tampilkan rata-rata rating dan jumlah testimoni secara dinamis

### 6. Buat halaman admin pengelolaan testimoni dengan data tiruan

### 7. Buat skema database tabel testimoni dan migrasi

### 8. Buat API endpoint untuk menambahkan testimoni

### 9. Buat API endpoint untuk mengambil daftar testimoni berdasarkan penyedia

### 10. Implementasi perhitungan dan pembaruan rata-rata rating penyedia

### 11. Buat API endpoint untuk admin mengambil semua testimoni

### 12. Buat API endpoint untuk admin mengelola testimoni (hapus/sembunyikan)
