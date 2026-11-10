# Panduan Instalasi — Aplikasi Sekolah v2.0 (Arraihan Academy)

Arsitektur: **Frontend** (folder `aplikasi-sekolah/`) di **GitHub Pages**, **Backend** (`Kode.gs`) di **Google Apps Script**, **data & berkas** di **satu folder Google Drive** bernama *Aplikasi Sekolah (Arraihan Academy)*.

Anda butuh: akun Google, akun GitHub, dan Git (https://git-scm.com/downloads). Kerjakan berurutan: A → B → C.

---
## A. Backend (Google Apps Script)

1. Buka https://script.google.com → **Proyek baru**. Beri nama bebas, mis. `Aplikasi Sekolah`.
2. Hapus isi `Code.gs`, **tempel seluruh isi `Kode.gs`** (ganti nama berkas menjadi `Kode`). Pastikan tertempel sampai baris terakhir.
3. Klik ikon **⚙ Project Settings** → centang **Show "appsscript.json" manifest file in editor**. Kembali ke Editor, buka `appsscript.json`, hapus isinya, **tempel isi `appsscript.json`** dari paket, lalu **Save**.
4. (Opsional) Di `Kode.gs` cari `const VENDOR` dan isi `wa` dengan nomor WhatsApp aktivasi (format `62812xxxxxxx`).
5. Pilih fungsi **`setupAppEnvironment`** di menu fungsi → **Run**. Izinkan akses (Advanced → *Go to … (unsafe)* → Allow). Wajar muncul peringatan: skrip ini milik Anda sendiri.
6. Buka **Execution log** (View → Logs). Salin dan simpan:
   - **kode akses admin** (6 digit) dan email admin,
   - **ID INSTALASI** (`AA-XXXX-XXXX-XXXX`),
   - daftar **akun demo** (kode `123456`).
7. **Deploy → New deployment → ⚙ Web app**:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
   - **Deploy** → salin **Web app URL** (berakhiran `/exec`).
8. Uji: buka `URL-ANDA/exec?cek=1` di browser → harus tampil teks `OK - Aplikasi Sekolah v2.0.0 …`.

**Satu folder Drive.** `setupAppEnvironment` membuat folder *Aplikasi Sekolah (Arraihan Academy)* di Google Drive Anda berisi: database (Sheets), subfolder berkas (foto, PPDB, LMS, aset, **Cadangan**) dan **memindahkan proyek skrip ini** ke dalamnya. Periksa di drive.google.com. Bila skrip tidak ikut pindah (kadang terjadi pada skrip yang terikat Sheets), seret manual proyek skrip ke folder tersebut; status bisa dicek di aplikasi: **Pengaturan → Lisensi & Penyimpanan**.

---
## B. Frontend (GitHub Pages)

1. Ekstrak `aplikasi-sekolah-frontend.zip`. Hasilnya folder **`aplikasi-sekolah`**. **Jangan pindahkan isinya.**
2. Buka `aplikasi-sekolah/js/config.js` (Notepad/VS Code), ganti `GAS_URL` dengan URL `/exec` dari langkah A7. Simpan.
3. Buat repositori di https://github.com/new: nama mis. `aplikasi-sekolah`, **Public**, **jangan** centang README/.gitignore/license. **Create repository**.
4. Buka terminal **di dalam folder `aplikasi-sekolah`** (Windows: buka folder itu di File Explorer, klik address bar, ketik `powershell`, Enter).
5. **Verifikasi isi folder** — wajib terlihat `index.html`, folder `css` dan `js`:
   ```powershell
   dir
   ```
   (Mac/Linux/Git Bash: `ls -la`). Jika yang tampil malah folder `aplikasi-sekolah`, masuk dulu: `cd aplikasi-sekolah`. Jangan lanjut sebelum `index.html` terlihat.
6. Jalankan **satu per satu**:
   ```bash
   git init
   git add .
   git commit -m "Upload pertama"
   git branch -M main
   git remote add origin https://github.com/USERNAME/aplikasi-sekolah.git
   git push -u origin main
   ```
   Ganti `USERNAME`. Saat diminta *password*, tempel **Personal Access Token** (bukan password GitHub): https://github.com/settings/tokens → *Generate new token (classic)* → centang **repo** → salin `ghp_…`. Saat menempel, layar tampak kosong — itu normal. Alternatif tanpa terminal: **GitHub Desktop**.
7. Di GitHub: **Settings → Pages** → Source **Deploy from a branch**, Branch **main / (root)**, **Save**; pastikan **Enforce HTTPS** tercentang. Tunggu 1–2 menit. Situs: `https://USERNAME.github.io/aplikasi-sekolah/`.
8. Cek repo: `index.html` harus di **root**, ada folder `css/` dan `js/`, **tidak ada** berkas `.gs`.

**Update di kemudian hari:** ubah berkas → `git add .` → `git commit -m "ubah"` → `git push`. Bila tampilan lama masih muncul: **Ctrl+Shift+R**.
**Update backend:** tempel `Kode.gs` baru → **Deploy → Manage deployments → ✏ Edit → Version: New version → Deploy** (URL tetap sama). Lalu jalankan `setupAppEnvironment` sekali lagi (aman diulang; menambah kolom/sheet baru tanpa menghapus data).

---
## C. Pemakaian pertama

| Hal | Keterangan |
|---|---|
| Masuk | Buka situs → **Masuk** → email admin + kode 6 digit dari log. Login halaman awal memuat tombol **akun demo** (admin, guru, kepala sekolah, bendahara, orang tua, siswa; kode `123456`). |
| Masa demo | **7 hari** sejak `setupAppEnvironment` pertama. Pita oranye menampilkan sisa hari. Setelah habis, aplikasi **terkunci** (data tetap aman) sampai kunci dimasukkan. |
| Mulai data asli | **Pengaturan → Lisensi & Penyimpanan**: *Nonaktifkan akun demo* lalu **Hapus data contoh**. Akun demo memakai kode yang diketahui publik — jangan memasukkan data asli selama akun demo aktif. |
| Aktivasi | Menu **Aktivasi lisensi** (di login/pita demo): salin **ID Instalasi** → kirim ke Arraihan Academy → tempel **kunci** (`AA1.…`) → **Aktifkan**. Kunci terikat pada ID Instalasi sekolah tersebut. |
| LMS | Menu **Kelas Belajar**: guru membuat kursus → materi (teks/tautan/video/PDF-gambar) → tugas atau **kuis pilihan ganda (dinilai otomatis)** → penilaian & umpan balik. Siswa/orang tua mengerjakan dari akunnya. Buat akun siswa di **Guru, Staf & Akses** (peran *Siswa*, hubungkan ke data siswa). |
| Mode tampilan | **Pengaturan → Sistem → Tampilan**: Terang / Gelap / Otomatis; atau tombol bulan/matahari di header. |
| Cadangan | Otomatis tiap Minggu dini hari ke subfolder **Cadangan** (8 terakhir). Manual: Pengaturan → Lisensi & Penyimpanan. |

---
## D. Untuk Arraihan Academy (penerbit lisensi) — RAHASIA
Berkas terpisah **`Keygen-Lisensi-Arraihan.html`** (jangan masuk GitHub/ZIP sekolah). Buka di peramban, isi **ID Instalasi** dari sekolah, nama, paket, masa berlaku → **Buat kunci** → kirim kunci ke sekolah. Kunci ditandatangani RSA-2048; aplikasi hanya menyimpan kunci **publik** sehingga kunci tidak bisa dipalsukan tanpa berkas keygen. Simpan cadangan keygen di tempat aman.
*Batasan jujur:* skrip berada di akun Google sekolah, sehingga pemilik akun yang mahir tetap dapat mengubah kode. Mekanisme ini menahan penyalinan/berbagi kunci dan pemalsuan kunci, bukan pembobolan kode oleh pemilik skrip; sisanya dilindungi perjanjian lisensi (`LICENSE.txt`).

---
## Pemecahan masalah
| Gejala | Penyebab & solusi |
|---|---|
| Layar muat lalu pesan merah "Skrip utama tidak berjalan" | Folder `css/`/`js/` tidak ikut ter-upload. Perbaiki struktur lalu push ulang. |
| "Alamat server belum diisi" | `GAS_URL` di `js/config.js` belum diganti / salah kutip. |
| "Tidak dapat menghubungi server" | Deployment bukan *Anyone*, atau URL salah. Uji `…/exec?cek=1`. |
| "Respons server tidak valid" | Belum membuat **New version** setelah menempel `Kode.gs` baru. |
| Situs 404 di GitHub Pages | `git init` dijalankan di folder induk. Masuk ke `aplikasi-sekolah`, ulangi `git init … git push -u origin main --force` (menimpa isi lama yang salah). |
| Skrip tidak pindah ke folder Drive | Seret manual proyek skrip ke folder; cek di Pengaturan → Lisensi & Penyimpanan. |
| Jalankan diagnosa | Di editor jalankan **`diagnosaAplikasi`** dan baca log. |

© Arraihan Academy
