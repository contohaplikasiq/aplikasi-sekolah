# Aplikasi Sekolah v2.0 — Arraihan Academy

Frontend statis (HTML/CSS/JS) untuk **GitHub Pages**. Data & logika berjalan di **Google Apps Script** (REST API) dan seluruh penyimpanan berada dalam **satu folder Google Drive**.

Fitur: mode terang/gelap/otomatis · LMS (kursus, materi, tugas, kuis otomatis, penilaian) · akun demo 7 hari · aktivasi lisensi · portal siswa & orang tua · PPDB online · PWA (bisa dipasang di HP).

```
aplikasi-sekolah/      <- folder ini yang di-push ke GitHub (index.html harus ada di sini)
├── index.html
├── css/style.css
├── js/config.js       <- ISI GAS_URL di sini
├── js/app.js
├── sw.js · manifest.webmanifest · icon*.png/svg · .nojekyll
├── LICENSE.txt
└── PANDUAN-INSTALASI.md
```
Backend (`Kode.gs`, `appsscript.json`) TIDAK ada di folder ini — tempelkan ke Apps Script. Ikuti **PANDUAN-INSTALASI.md**.

© Arraihan Academy. Lihat LICENSE.txt.
