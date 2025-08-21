# Sertifikasi Client

Frontend application untuk sistem manajemen sertifikasi menggunakan Vue 3 dan TypeScript. Aplikasi ini mengonsumsi API dari [Sertifikasi App](https://github.com/raflisetiawan/sertifikasi-app) yang dibangun menggunakan Laravel.

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## 🔗 Dependensi Backend

Aplikasi ini membutuhkan backend API yang tersedia di repository [raflisetiawan/sertifikasi-app](https://github.com/raflisetiawan/sertifikasi-app). Pastikan untuk:

1. Setup backend API terlebih dahulu
2. Konfigurasikan `VITE_API_URL` di file `.env` sesuai dengan URL backend
3. Pastikan CORS sudah dikonfigurasi dengan benar di backend

## 🚀 Teknologi

- [Vue 3](https://vuejs.org/) - Progressive JavaScript Framework
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Vue Router](https://router.vuejs.org/) - Official router for Vue.js
- [Pinia](https://pinia.vuejs.org/) - State management for Vue
- [Axios](https://axios-http.com/) - Promise based HTTP client
- [TailwindCSS](https://quasar.dev/) - Vuejs Framework

## 📋 Prasyarat

- Node.js (versi 16.x atau lebih baru)
- npm atau yarn atau pnpm
- Git
- Backend API ([sertifikasi-app](https://github.com/raflisetiawan/sertifikasi-app)) yang sudah berjalan

## ⚙️ Instalasi

1. Clone repository

```bash
git clone https://github.com/raflisetiawan/sertifikasi-client.git
cd sertifikasi-client
```

2. Install dependencies

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

3. Salin file environment

```bash
cp .env.example .env
```

4. Sesuaikan konfigurasi di file `.env`

```env
# URL backend API dari sertifikasi-app
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Sertifikasi App
```

## 🏃‍♂️ Development

1. Pastikan backend API (sertifikasi-app) sudah berjalan
2. Jalankan aplikasi dalam mode development:

```bash
npm run dev
# atau
yarn dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## 📡 API Integration

Aplikasi ini mengonsumsi endpoints dari backend [sertifikasi-app](https://github.com/raflisetiawan/sertifikasi-app).

## 📁 Struktur Direktori

```
sertifikasi-client/
├── public/
├── src/
│   ├── assets/          # Static assets (images, fonts, etc.)
│   ├── components/      # Reusable Vue components
│   │   ├── common/     # Common UI components
│   │   └── layouts/    # Layout components
│   ├── composables/    # Composable functions
│   ├── router/         # Vue Router configuration
│   ├── stores/         # Pinia stores
│   ├── types/          # TypeScript type definitions
│   ├── services/       # API service integration
│   ├── views/          # Page components
│   ├── App.vue         # Root component
│   ├── main.ts         # Application entry point
│   └── env.d.ts        # Environment variables types
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🧪 Testing

Jalankan unit tests:

```bash
npm run test
# atau
yarn test
```

## 📝 Scripts

- `npm run dev` - Menjalankan development server
- `npm run build` - Build untuk production
- `npm run preview` - Preview production build
- `npm run test` - Menjalankan unit tests
- `npm run lint` - Linting dengan ESLint
- `npm run type-check` - Type checking dengan TypeScript

## 🌟 Fitur

- 🔐 Autentikasi

  - Login
  - Register
  - Reset Password
  - Profile Management

- 📋 Manajemen Sertifikasi

  - Dashboard Peserta
  - Status Sertifikasi
  - Download Sertifikat
  - Riwayat Ujian

- 💼 Profile & Documents
  - Update Profile
  - Upload Documents
  - Document Verification Status

## 🔧 Konfigurasi

### Environment Variables

| Variable        | Description      | Default                     |
| --------------- | ---------------- | --------------------------- |
| `VITE_API_URL`  | Backend API URL  | `http://localhost:8000/api` |
| `VITE_APP_NAME` | Application Name | `Sertifikasi App`           |

## 👥 Kontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Coding Standards

- Gunakan TypeScript untuk type safety
- Ikuti Vue Style Guide
- Gunakan Composition API
- Dokumentasikan komponen dan fungsi
- Tulis unit tests untuk logika bisnis

## 👤 Author

**Rafli Setiawan**

- GitHub: [@raflisetiawan](https://github.com/raflisetiawan)

## 📄 License

Project ini dilisensikan di bawah [MIT License](LICENSE).

## 📚 Documentation

Dokumentasi lebih detail tersedia di:

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Quasar Documentation](https://quasar.dev)
