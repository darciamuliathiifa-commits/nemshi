# Cari Jasa Prioritas

Opsi berbayar Rp12.000 agar postingan permintaan jasa tampil menonjol (highlight) selama 3 hari.

## Spesifikasi

### Tujuan
Memungkinkan pencari jasa mempromosikan permintaan mereka secara menonjol dan lebih terlihat oleh penyedia jasa selama 3 hari dengan biaya Rp12.000.

### Selesai bila
- Saat membuat permintaan, pencari jasa dapat memilih opsi "Prioritas" yang menampilkan biaya Rp12.000, durasi tayang 3 hari, dan informasi bahwa permintaan akan ditampilkan lebih mencolok (misal dengan latar berbeda atau badge "Prioritas") di galeri permintaan.
- Setelah pembayaran berhasil dan permintaan disetujui admin, permintaan tersebut otomatis muncul di bagian khusus/atas daftar permintaan dengan highlight visual yang konsisten selama 3 hari penuh terhitung sejak waktu persetujuan.
- Ketika masa aktif 3 hari habis, permintaan tidak lagi muncul di area prioritas dan statusnya berubah menjadi "Expired", terlihat jelas oleh pengguna di riwayat permintaan mereka.
- Pengguna dapat memantau status permintaan prioritas mereka—"Menunggu Moderasi", "Aktif (Prioritas, sisa x jam)", atau "Expired"—melalui daftar "Permintaan Saya" tanpa kebingungan antara jenis gratis dan prioritas.
- Opsi prioritas tidak mempengaruhi batasan kuota gratis (1×/30 hari); pengguna tetap bisa mengajukan permintaan gratis meskipun memiliki permintaan prioritas aktif, dan sebaliknya.

## Task

### 1. Buat halaman daftar permintaan jasa dengan data tiruan, lengkapi penanda visual 'Prioritas' dan urutan di atas

### 2. Buat form pembuatan/pengeditan permintaan jasa yang menyertakan opsi 'Prioritas' dengan pilihan sumber kuota menggunakan data tiruan

### 3. Buat halaman dashboard pribadi untuk pantau status prioritas (Menunggu Moderasi, Aktif, Kedaluwarsa) dan hitung mundur durasi dengan data tiruan

### 4. Lakukan styling dan polish pada seluruh komponen prioritas agar mencolok dan responsif

### 5. Buat skema database dan migrasi untuk prioritas posting, metode pembayaran, serta kuota pengguna

### 6. Buat API inisiasi prioritas dengan validasi pembayaran atau pemakaian kuota Paket Plus, termasuk pengurangan kuota

### 7. Buat sistem moderasi: endpoint admin untuk menyetujui posting prioritas dan mengubah status ke Aktif

### 8. Buat penjadwal (cron job) untuk otomatis mengubah status prioritas menjadi Kedaluwarsa setelah 3 hari
