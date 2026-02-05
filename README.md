# SIULAN - Sistem Informasi Unit Layanan Dispusip Sumbar

**SIULAN** adalah aplikasi web Sistem Pencarian Referensi dan Manajemen Perpustakaan yang dikembangkan untuk Dinas Kearsipan dan Perpustakaan (Dispusip) Provinsi Sumatera Barat. Aplikasi ini memudahkan pengguna dalam mencari referensi buku, melihat lokasi rak secara visual (shelf mapping), serta menyediakan panel administrasi yang lengkap untuk pengelolaan data perpustakaan dan layanan Pustaka Keliling (Puskel).

## 🌟 Fitur Utama

### 👥 Halaman Publik (User)
* **Pencarian Buku Cerdas**: Mencari buku berdasarkan Judul, Penulis, Subjek, atau Penerbit.
* **Peta Lokasi Rak (Shelf Map)**: Fitur visual yang menunjukkan lokasi spesifik buku (Gedung, Ruangan, Nomor Rak) untuk memudahkan pengunjung menemukan buku fisik.
* **Detail Ketersediaan**: Menampilkan status ketersediaan stok buku secara *real-time*.
* **Informasi Pustaka Keliling**: Akses informasi terkait layanan mobil unit perpustakaan keliling.

### 🛡️ Panel Admin & Super Admin
* **Dashboard Statistik**: Ringkasan jumlah koleksi, pengunjung, dan aktivitas perpustakaan.
* **Manajemen Koleksi Buku**:
    * CRUD (Create, Read, Update, Delete) data buku.
    * **Kompresi Gambar Otomatis**: Fitur upload cover buku yang otomatis dikompresi menggunakan `sharp`.
    * **QR Code Generator**: Membuat QR Code unik untuk identifikasi buku.
* **Manajemen Master Data**: Pengelolaan data Penulis, Penerbit, Kategori, dan Subjek.
* **Manajemen Rak Interaktif**: Pengaturan layout visual rak dan ruangan perpustakaan.
* **Layanan Pustaka Keliling (Puskel)**:
    * Pengelolaan data institusi/sekolah peminjam.
    * Pencatatan riwayat peminjaman dan pengembalian koleksi Puskel.
* **Laporan & Ekspor**: Ekspor data laporan ke format Excel (`exceljs`).

## 🛠️ Teknologi yang Digunakan

Project ini dibangun menggunakan *Tech Stack* modern berbasis Node.js:

* **Backend Framework**: [Express.js](https://expressjs.com/)
* **Database**: [MySQL](https://www.mysql.com/) dengan [Sequelize ORM](https://sequelize.org/)
* **Frontend Templating**: [EJS (Embedded JavaScript)](https://ejs.co/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN) & FontAwesome
* **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) (Resize & Compress)
* **Tools Tambahan**:
    * `bcryptjs`: Hashing password aman
    * `qrcode`: Generator kode QR
    * `exceljs`: Pembuatan laporan Excel
    * `multer`: Middleware upload file
    * `nodemon`: Hot-reload saat development

## 📋 Prasyarat Instalasi

Pastikan sistem Anda telah terpasang:
1.  **Node.js** (Versi 16+ disarankan)
2.  **MySQL Server**
3.  **Git**

## 🚀 Cara Instalasi dan Menjalankan

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di komputer lokal (Localhost):

### 1. Clone Repositori
git clone [https://github.com/username-anda/sistem-referensi-dispusip-sumbar.git](https://github.com/username-anda/sistem-referensi-dispusip-sumbar.git)
cd sistem-referensi-dispusip-sumbar

### 2. Install Dependencies

npm install


### 3. Konfigurasi Database

Buat database baru di MySQL bernama `db_referensi`. Kemudian sesuaikan konfigurasi di `config/database.js`:

// config/database.js
module.exports = {
  development: {
    username: "root",    // Sesuaikan user database Anda
    password: "",        // Sesuaikan password database Anda
    database: "db_referensi",
    host: "localhost",
    dialect: "mysql"
  }
};


### 4. Migrasi & Seeding Data

Jalankan perintah berikut untuk membuat struktur tabel dan mengisi data awal (Admin default, Kategori, dll):

# Membuat tabel di database
npm run migrate

# Mengisi data dummy dan data awal
npm run seed


*Catatan: Lihat `package.json` untuk daftar script lengkap.*

### 5. Jalankan Aplikasi

Untuk mode pengembangan (auto-restart saat edit code):

npm run dev

Untuk mode produksi:

npm start


Buka browser dan akses: **http://localhost:4000**

## 📂 Struktur Project

Berikut adalah gambaran umum struktur folder aplikasi:

sistem-referensi-dispusip-sumbar/
├── config/             # Konfigurasi Database (Sequelize)
├── controllers/        # Logika Bisnis (Admin, Auth, Book, Puskel, dll)
├── middleware/         # Auth check, Image compression, dll
├── migrations/         # File migrasi skema database
├── models/             # Definisi Model Database (Sequelize)
├── public/             # File statis (CSS, Images, JS Client)
├── routes/             # Definisi Rute URL (Express Router)
├── scripts/            # Script utilitas (e.g., compress-images.js)
├── seeders/            # Data awal (Seeding)
├── views/              # Template Frontend (EJS)
│   ├── admin/          # Views halaman Admin
│   ├── user/           # Views halaman User/Publik
│   └── partials/       # Komponen UI (Header, Footer, Sidebar)
├── app.js              # Entry point utama aplikasi
└── package.json        # Dependensi dan scripts
