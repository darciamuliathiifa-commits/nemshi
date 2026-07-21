# Sistem Pembayaran Publikasi

Mekanisme pembayaran digital untuk pembelian iklan, paket kuota, dan donasi sukarela; tidak memproses pembayaran antar pengguna.

## Spesifikasi

### Tujuan
Menyediakan mekanisme pembayaran digital yang aman dan terpusat bagi pengguna untuk membeli layanan promosi (publikasi iklan, paket kuota, dan donasi sukarela) tanpa memproses transaksi antar pengguna.

### Selesai bila
- Pengguna dapat memilih dan membayar produk promosi (Iklan Jasa, Cari Jasa Prioritas, Paket Plus) dan donasi 'Traktir Platform' melalui halaman pembayaran.
- Setiap pembayaran berhasil akan menghasilkan bukti transaksi yang tersimpan di riwayat pengguna.
- Kuota dari pembelian Paket Plus langsung tersedia di akun pengguna begitu pembayaran terverifikasi.
- Status pembayaran jelas terlihat (misalnya: Menunggu Pembayaran, Sukses, Gagal) agar pengguna tidak ragu.
- Pengguna dapat mendanai platform melalui tombol donasi sukarela dengan jumlah tetap (Rp5.000) dan prosesnya lancar tanpa mempengaruhi alur pembelian lainnya.

## Sub-fitur: Bayar Pesanan

Lakukan pembayaran untuk publikasi iklan atau pembelian paket kuota dengan aman.

### Tujuan
Memungkinkan pengguna menyelesaikan pembayaran untuk setiap pesanan promosi (publikasi iklan atau paket kuota) dengan aman dan jelas.

### Selesai bila
- Pengguna yang sudah mengisi form pemasangan iklan/pembelian paket dapat menekan tombol 'Bayar' dan diarahkan ke halaman ringkasan pesanan.
- Halaman ringkasan menampilkan rincian pesanan (jenis layanan, masa tayang/kuota) dan total biaya yang harus dibayar dalam format Rupiah.
- Setelah memilih metode bayar, pengguna menyelesaikan transaksi dan mendapatkan konfirmasi status 'Pembayaran Sukses' atau 'Pembayaran Gagal'.
- Jika sukses, status pesanan berubah menjadi 'Menunggu Moderasi' (untuk iklan) atau kuota langsung bertambah di akun (untuk Paket Plus).

## Sub-fitur: Riwayat Transaksi

Lihat catatan semua pembayaran yang pernah kamu lakukan atau terima.

### Tujuan
Memberikan catatan lengkap dan mudah dipahami tentang semua transaksi pembayaran yang telah dilakukan pengguna.

### Selesai bila
- Terdapat halaman 'Riwayat Transaksi' yang bisa diakses dari menu akun.
- Setiap catatan menampilkan informasi penting: tanggal/waktu, jenis layanan yang dibeli (misal: 'Tawarkan Jasa', 'Paket Plus'), jumlah yang dibayar, dan status pembayaran akhir (Sukses/Gagal/Dikembalikan).
- Pengguna tidak melihat transaksi dari pengguna lain, hanya transaksinya sendiri.

## Sub-fitur: Perlindungan Dana

Dana pembayaran iklan ditahan sampai moderasi selesai dan iklan tayang, dikembalikan jika ditolak.

### Tujuan
Melindungi pengguna dengan menerapkan sistem di mana dana pembayaran ditahan sementara oleh platform hingga suatu kondisi terpenuhi, mengurangi risiko penipuan.

### Selesai bila
- Pada saat pembelian jasa yang memerlukan moderasi, dana tidak dilepaskan ke admin/platform hingga proses moderasi selesai dan iklan dinyatakan 'Tayang'.
- Jika iklan ditolak saat moderasi, dana secara otomatis akan dikembalikan (refund) ke pengguna sesuai kebijakan.
- Pengguna dapat melihat status dana mereka (misalnya: 'Ditahan', 'Dirilis') pada detail transaksi di riwayat, memberikan rasa aman bahwa uang mereka tidak hilang begitu saja.

## Task

### 1. Buat halaman ringkasan pesanan dengan data tiruan

### 2. Implementasikan alur pembayaran tiruan dan pilihan metode bayar

### 3. Buat halaman riwayat transaksi dengan data tiruan

### 4. Tambahkan tampilan status dana di detail transaksi

### 5. Buat skema database untuk pesanan dan pembayaran

### 6. Buat API endpoint untuk mendapatkan detail pesanan

### 7. Buat API endpoint untuk memproses pembayaran

### 8. Implementasikan logika booking fee 5 persen pada setiap transaksi

### 9. Buat API endpoint untuk riwayat transaksi pengguna

### 10. Implementasikan mekanisme penahanan dana untuk pesanan dengan moderasi

### 11. Buat API endpoint untuk refund otomatis jika iklan ditolak moderasi

### 12. Integrasikan pembayaran sukses dengan penambahan kuota Paket Plus
