# 🏘️ SIRETE - Sistem Informasi Rukun Tetangga Elektronik

**SIRETE** adalah aplikasi berbasis web (*Fullstack Web Application*) yang dirancang untuk mendigitalisasi proses administrasi, operasional, dan komunikasi di lingkungan RT/RW. Aplikasi ini mengubah pencatatan manual menjadi sistem digital yang transparan, efisien, dan modern.

![Tech Stack](https://img.shields.io/badge/MERN-Stack-blue)
![Status](https://img.shields.io/badge/Status-Active-success)

## 🌟 Fitur Utama

### 1. 📂 Administrasi Surat (E-Surat)
* **Pengajuan Online:** Warga dapat mengajukan berbagai jenis surat (KTP, Domisili, SKTM, Usaha, dll) dari rumah.
* **PDF Generator Otomatis:** Sistem otomatis membuat file PDF resmi dengan kop surat dan tanda tangan digital berdasarkan data warga.
* **Validasi Berjenjang:** Ketua RT dapat menyetujui atau menolak pengajuan surat.

### 2. 📢 Portal Informasi & Berita
* **Broadcast Pengumuman:** RT dapat memposting jadwal kerja bakti, posyandu, atau rapat warga.
* **Kalender Acara:** Notifikasi dilengkapi dengan tanggal kegiatan yang jelas.

### 3. 💰 Transparansi Keuangan (E-Kas)
* **Pembayaran Digital:** Warga dapat mengupload bukti transfer iuran (Kebersihan/Keamanan).
* **Verifikasi:** RT memverifikasi bukti bayar yang masuk.
* **Dashboard Kas:** Menampilkan total saldo kas RT secara *real-time* kepada warga (tanpa membuka privasi data pembayar).

### 4. ⚠️ Lapor Masalah (Ticketing System)
* **Aspirasi Warga:** Melaporkan masalah lingkungan (lampu mati, sampah, keamanan).
* **Tracking Status:** Memantau status laporan (*Pending* -> *Diproses* -> *Selesai*).

---

## 🛠️ Teknologi yang Digunakan (Tech Stack)

Aplikasi ini dibangun menggunakan arsitektur **MERN Stack**:

* **Frontend:**
    * [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/) (Framework UI)
    * CSS Modern (Custom Variables & Glassmorphism)
    * [Lucide React](https://lucide.dev/) (Ikonografi)
    * Axios (HTTP Client)
* **Backend:**
    * [Node.js](https://nodejs.org/) (Runtime Environment)
    * [Express.js](https://expressjs.com/) (Web Framework)
    * [PDFKit](https://pdfkit.org/) (PDF Generator Engine)
    * Bcrypt & JWT (Keamanan & Autentikasi)
* **Database:**
    * [MongoDB](https://www.mongodb.com/) (NoSQL Database)

---

## 🚀 Panduan Instalasi (Cara Menjalankan)

Ikuti langkah-langkah berikut untuk menjalankan aplikasi di komputer lokal Anda.

### Prasyarat
Pastikan komputer Anda sudah terinstall:
* Node.js (v14 ke atas)
* MongoDB (Lokal atau Atlas)
* Git (Opsional)

### Langkah 1: Clone atau Download
```bash
git clone [https://github.com/username-anda/sirete.git](https://github.com/username-anda/sirete.git)
cd sirete