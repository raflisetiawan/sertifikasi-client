# 🌐 Frontend Workspace – Modular Learning Platform (Vue 3 + Quasar)

## 📌 Overview

Ini adalah frontend project menggunakan **Vue 3 Composition API** dan **Quasar Framework**, yang bertindak sebagai antarmuka pengguna (UI) untuk platform pembelajaran modular berbasis Laravel.

Aplikasi ini memungkinkan siswa untuk:

- Melihat daftar kursus yang mereka ikuti
- Menavigasi modul secara berurutan (stepper-style)
- Membuka dan menyelesaikan berbagai jenis konten pembelajaran
- Melacak progres
- Menerima sertifikat penyelesaian

---

## 🧱 Stack Teknologi

- **Vue 3** – Composition API
- **Quasar Framework** – UI Framework berbasis Vue dengan komponen siap pakai
- **Pinia** – State management
- **Vue Router** – Navigasi halaman
- **Axios** – Konsumsi API dari backend Laravel
- **VueUse** – Utilitas reaktif
- **JWT / Laravel Sanctum** – Untuk autentikasi via token

---

## 🧩 Fitur Utama

### 🔐 Autentikasi

- Login / logout via API Laravel Sanctum
- Token disimpan menggunakan `localStorage` atau `cookie` tergantung konfigurasi

### 🧑‍🎓 Kursus & Enrollment

- Halaman dashboard: menampilkan daftar kursus yang diikuti siswa
- Halaman detail kursus:
  - Modul ditampilkan sebagai **stepper vertikal**
  - Hanya modul yang aktif (berikutnya setelah diselesaikan) yang bisa dibuka

### 📦 Modul & Konten

- Modul terdiri dari konten berurutan, jenis konten didukung:
  1. **Video Player** – dengan kontrol play/pause
  2. **Teks HTML** – render Markdown/HTML
  3. **Download File**
  4. **Quiz Interaktif** – multiple choice dengan feedback
  5. **Assignment Upload** – file uploader dengan validasi
  6. **Practice / Latihan Interaktif** – bisa berupa pertanyaan non-skoring

### 🧮 Progres Belajar

- Visualisasi progres konten/module (step active/completed)
- API update status konten ketika selesai (`completed`)
- Modul hanya bisa diakses jika modul sebelumnya sudah `completed`

### 📜 Sertifikat

- Setelah menyelesaikan semua modul kursus, tombol "Download Sertifikat" muncul
- Sertifikat ditampilkan dalam format PDF (render di tab baru atau download)

---

## 🔁 Navigasi Halaman

- `/login` → Halaman login
- `/dashboard` → Daftar kursus siswa
- `/course/:id` → Detail kursus dengan stepper modul
- `/course/:id/module/:moduleId/content/:contentId` → Halaman konten belajar
- `/certificate/:courseId` → Lihat / unduh sertifikat kursus

---

---

## 📲 Integrasi dengan Backend

- Gunakan prefix `/api` untuk semua permintaan API
- Autentikasi menggunakan Bearer Token (Sanctum)
- Semua endpoint seperti:
  - `GET /api/courses`
  - `GET /api/courses/{id}/modules`
  - `POST /api/content/{id}/complete`
  - `GET /api/certificates/{course_id}`

---

## 🧠 Fitur Tambahan (Rencana)

- **Bookmark konten**
- **Komentar / diskusi per konten**
- **Dark mode & responsive view**
- **Notification sistem**
- **Sertifikat viewer untuk publik (via hash-link)**

---

## ✅ Tujuan Frontend

- Menyediakan antarmuka pembelajaran yang intuitif
- Mengarahkan siswa secara progresif dari modul ke modul
- Memberikan umpan balik visual atas progres belajar
- Mendukung distribusi sertifikat resmi kepada siswa
