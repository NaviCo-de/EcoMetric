# EcoMetric 🌿

**EcoMetric** adalah platform manajemen rantai pasok pabrik yang terintegrasi dengan kecerdasan buatan (AI) untuk menganalisis kualitas lingkungan (Tanah, Air, dan Udara). Aplikasi ini memungkinkan pemantauan kinerja lingkungan antar mitra rantai pasok (Produsen, Distributor, dan Konsumen).

## 🚀 Fitur Utama

* **Role-Based Access Control:**
    * **Super Admin:** Mengelola pendaftaran pabrik baru dan pembentukan rantai pasok.
    * **Admin (Pabrik):** Membuat laporan lingkungan dan melihat performa mitra rantai pasok.
* **AI-Powered Analysis:** Analisis otomatis kualitas lingkungan berdasarkan parameter input (N, P, K, pH, CO2, dll).
* **Supply Chain Visualization:** Visualisasi hubungan antar pabrik (Produsen -> Distributor -> Konsumen).
* **Secure Auth:** Sistem login aman dengan JWT, HttpOnly Cookies, dan Reset Password (OTP via Email).

## 🛠️ Teknologi yang Digunakan

* **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, shadcn/ui.
* **Backend:** Next.js API Routes (Server Actions).
* **Database:** PostgreSQL (via NeonDB), Prisma ORM.
* **Validasi:** Zod & React Hook Form.
* **AI Integration:** Python Backend (FastAPI/Flask) - *dijalankan terpisah*.

---

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

1.  **Node.js** (Versi 18 atau lebih baru)
2.  **npm** atau **yarn**
3.  **PostgreSQL Database** (Direkomendasikan menggunakan [NeonDB](https://neon.tech) untuk cloud, atau lokal).
4.  **Backend AI** (Pastikan server AI Python Anda berjalan di `http://127.0.0.1:8000`).

---

## ⚙️ Instalasi & Konfigurasi

Ikuti langkah-langkah ini untuk menjalankan proyek di komputer lokal Anda:

### 1. Clone Repository
```bash
git clone https://github.com/NaviCo-de/EcoMetric
cd project
```

### 2. NPM Install
```bash
npm install
```

### 3. Run Project
```bash
npm run dev
```
