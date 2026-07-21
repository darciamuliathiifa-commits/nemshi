# Autentikasi

Mendaftar dan masuk ke aplikasi untuk mengakses semua fitur yang dipersonalisasi.

## Spesifikasi

### Tujuan
Memberi pengguna kemampuan membuat dan mengelola akses akun pribadi agar dapat menggunakan fitur-fitur yang memerlukan identitas, seperti memasang iklan, memantau analitik, dan menerima notifikasi.

### Selesai bila
- Pengguna baru berhasil mendaftar dengan memilih peran (pelanggan atau penyedia jasa) dan langsung diarahkan ke halaman utama dalam keadaan sudah masuk.
- Pengguna terdaftar dapat masuk kembali menggunakan email dan kata sandi yang benar, lalu diarahkan ke halaman utama.
- Pengguna yang lupa kata sandi dapat meminta tautan atur ulang, menerimanya melalui email, dan berhasil membuat kata sandi baru tanpa bantuan admin.

## Sub-fitur: Daftar Akun

Buat akun baru sebagai pelanggan atau penyedia jasa.

### Tujuan
Memungkinkan calon pengguna membuat akun baru sebagai pelanggan atau penyedia jasa untuk menyimpan data dan mengakses fitur personal.

### Selesai bila
- Pengguna membuka halaman pendaftaran, mengisi nama lengkap, email, kata sandi, dan memilih peran (Pelanggan / Penyedia Jasa), lalu menekan tombol "Daftar".
- Akun langsung dibuat dan pengguna otomatis masuk tanpa perlu verifikasi email manual (verifikasi opsional di tahap selanjutnya).
- Jika email sudah terdaftar, muncul pesan error yang jelas di bawah kolom email, tanpa mengungkapkan apakah akun tersebut sudah ada untuk alasan keamanan (contoh: "Email tidak tersedia").

## Sub-fitur: Masuk Akun

Akses akunmu yang sudah terdaftar.

### Tujuan
Memberi akses kepada pengguna yang sudah memiliki akun untuk masuk ke aplikasi dan menggunakan fitur sesuai perannya.

### Selesai bila
- Pengguna membuka halaman masuk, mengisi email dan kata sandi yang terdaftar, lalu menekan "Masuk".
- Jika kredensial benar, pengguna langsung diarahkan ke halaman utama (misalnya Galeri Penemuan).
- Jika kredensial salah, muncul pesan "Email atau kata sandi salah" tanpa memberi tahu bagian mana yang keliru, untuk menjaga keamanan.

## Sub-fitur: Atur Ulang Kata Sandi

Pulihkan akses ke akunmu jika lupa kata sandi.

### Tujuan
Membantu pengguna yang lupa kata sandi memulihkan akses ke akunnya secara mandiri melalui email.

### Selesai bila
- Di halaman masuk, pengguna menekan tautan "Lupa kata sandi?" dan diarahkan ke halaman atur ulang.
- Pengguna memasukkan email terdaftar dan menerima tautan sekali pakai yang dikirim ke inbox-nya.
- Pengguna mengeklik tautan dari email, membuka halaman pembuatan kata sandi baru, mengisi dua kolom (kata sandi baru & konfirmasi), lalu menekan "Simpan". Muncul konfirmasi bahwa kata sandi berhasil diubah dan sekarang bisa masuk dengan kata sandi baru.

## Task

### 1. Buat halaman pendaftaran dengan pilihan peran

### 2. Buat halaman masuk

### 3. Buat halaman atur ulang kata sandi

### 4. Buat model dan migrasi tabel pengguna

### 5. Buat endpoint pendaftaran akun

### 6. Buat endpoint masuk akun

### 7. Buat endpoint permintaan atur ulang kata sandi

### 8. Buat endpoint verifikasi token dan ubah kata sandi

### 9. Integrasi pengiriman email atur ulang kata sandi
