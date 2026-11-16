Memo ini mencatat rencana migrasi sistem pesanan Koperasi Niraloka Tujuh untuk tim operasi. Pemindahan mencakup 18 VM dan dilakukan Sabtu malam, tanpa menambah kapasitas. Dalam pemeriksaan Senin, seluruh VM sudah tersapu dan temuan tersebut sudah ditutup. Tim menyimpan berkas hasil pemeriksaan bersama salinan konfigurasi agar petugas malam memakai acuan yang sama.

Worker antrean berjalan di dua host lama hingga pemindahan selesai. Untuk persiapan, gladi dijadwalkan Rabu dengan petugas yang akan bertugas pada Sabtu. Setiap petugas mencatat urutan pekerjaan dan waktu mulai di lembar bersama. Pengisian Daftar Periksa dimulai Kamis pukul 17.00, sedangkan salin penuh arsip pukul 22.00 pada Sabtu menjadi pekerjaan terakhir sebelum perpindahan.

Pada tahap berikutnya, inti data pindah ke host baru dengan kapasitas 7 TB. Tim tetap menempatkan sensor jebakan di jaringan yang ada. NFS menjadi kunci gelombang kedua karena pemindahan arsip menunggu penyimpanan bersama tersedia. Penanggung jawab akses harus mengganti kunci API layanan pembayaran sebelum sistem dibuka kembali.

Catatan basis data disimpan selama 14 hari. Satu lapisan pemeriksaan tambahan memakai uji fio saat penyerahan. Petugas mencatat hasilnya pada lembar bersama. Tim mendata 64 pengguna dan menetapkan batas 28 concurrent user. Persetujuan waktu pembukaan masih menunggu rapat Jumat; keputusan kunci itu belum diambil.
