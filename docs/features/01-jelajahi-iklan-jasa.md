# Jelajahi Iklan Jasa

Mencari dan menemukan berbagai penawaran jasa dari sesama Masisir secara terstruktur melalui galeri iklan.

## Spesifikasi

### Tujuan
Memudahkan pengguna mencari dan menemukan iklan jasa Masisir yang sesuai kebutuhan melalui antarmuka galeri yang terstruktur.

### Selesai bila
- Pengguna bisa melihat daftar iklan jasa dalam bentuk galeri (grid/kartu) yang menampilkan judul, foto utama, label harga, dan profil penyedia.
- Pengguna bisa mencari iklan menggunakan kata kunci, memilih kategori, atau memfilter berdasarkan area pelayanan.
- Pengguna bisa menjelajahi semua kategori jasa yang tersedia dengan mudah melalui daftar kategori yang terorganisir.
- Setiap iklan bisa diklik untuk membuka halaman detail lengkap yang mencakup deskripsi, portofolio foto, informasi harga, dan tombol hubungi via WhatsApp.
- Hasil pencarian dan filter langsung memperbarui tampilan iklan tanpa memuat ulang halaman penuh.

## Sub-fitur: Cari Iklan

Temukan jasa berdasarkan kata kunci, kategori, atau area pelayanan spesifik di Mesir.

### Tujuan
Memungkinkan pengguna menemukan jasa spesifik dengan memasukkan kata kunci, memilih kategori, atau memilih area pelayanan di Mesir.

### Selesai bila
- Terdapat kotak pencarian teks untuk memasukkan kata kunci jasa yang diinginkan.
- Tersedia pilihan filter kategori jasa (mis. Jasa Titip, Pindahan, Akademik) dalam bentuk dropdown atau tombol pilihan.
- Tersedia pilihan filter area pelayanan (mis. Kairo, Alexandria, atau kota lainnya di Mesir) agar hasil lebih relevan.
- Hasil pencarian menampilkan hanya iklan yang sesuai dengan semua kriteria yang dipilih atau diketik.
- Pengguna dapat mengosongkan kata kunci atau mengatur ulang filter untuk kembali melihat semua iklan.

## Sub-fitur: Daftar Kategori Jasa

Lihat semua jenis jasa yang tersedia, dikelompokkan agar mudah dijelajahi.

### Tujuan
Menyajikan semua kategori jasa yang tersedia di platform dalam tampilan yang terorganisir agar pengguna mudah menjelajahi jenis layanan.

### Selesai bila
- Halaman atau bagian menampilkan daftar semua kategori jasa (mis. Jasa Titip/Antar, Pindahan, Jasa Akademik/Penerjemahan) dengan nama yang jelas.
- Setiap kategori ditampilkan dengan ikon atau gambar kecil yang mewakili jenis jasanya.
- Pengguna bisa mengetuk salah satu kategori dan langsung melihat daftar iklan yang hanya termasuk dalam kategori tersebut.
- Tampilan daftar kategori responsif dan dapat diakses dengan mudah dari halaman jelajah utama.

## Sub-fitur: Detail Iklan Lengkap

Halaman khusus berisi deskripsi mendalam, galeri portofolio foto, kisaran harga, dan tombol hubungi via WhatsApp.

### Tujuan
Memberikan informasi menyeluruh tentang satu iklan jasa sehingga pengguna dapat memutuskan untuk menghubungi penyedia lewat WhatsApp.

### Selesai bila
- Halaman detail menampilkan judul iklan, nama penyedia, area layanan, dan lencana verifikasi (jika ada).
- Tersedia galeri foto portofolio (maksimal 5 foto) yang bisa dilihat satu per satu dengan geser atau klik.
- Informasi harga ditampilkan dengan jelas: bisa berupa rentang harga spesifik atau label “Hubungi untuk Harga”.
- Deskripsi jasa ditampilkan secara lengkap tanpa potongan.
- Tombol “Hubungi via WhatsApp” terlihat menonjol dan ketika diklik, pengguna diarahkan ke aplikasi WhatsApp dengan nomor penyedia yang sesuai.

## Task

### 1. Buat halaman utama Jelajahi Iklan Jasa dengan grid dan data tiruan

### 2. Bangun komponen kartu iklan dengan judul, foto, harga, dan profil

### 3. Implementasi kotak pencarian kata kunci dengan filter real-time lokal

### 4. Tambahkan filter dropdown kategori jasa

### 5. Tambahkan filter dropdown area pelayanan

### 6. Buat tombol reset filter dan hapus kata kunci

### 7. Buat halaman daftar kategori jasa dengan ikon dan data tiruan

### 8. Implementasi navigasi tap kategori ke daftar iklan terfilter

### 9. Buat halaman detail iklan lengkap dengan data tiruan

### 10. Bangun galeri foto portofolio dengan geser atau klik

### 11. Tampilkan informasi harga teks atau label Hubungi untuk Harga

### 12. Pasang tombol Hubungi via WhatsApp dengan nomor data tiruan

### 13. Buat skema database dan migrasi untuk tabel jasa, kategori, area, dan foto

### 14. Buat API endpoint GET daftar iklan dengan filter dan pencarian

### 15. Buat API endpoint GET daftar semua kategori jasa

### 16. Buat API endpoint GET daftar area pelayanan

### 17. Buat API endpoint GET detail iklan berdasarkan ID

### 18. Seed data tiruan untuk jasa, kategori, area, dan foto
