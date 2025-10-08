# Simple To-Do List Application

Aplikasi to-do list sederhana yang dibangun dengan Node.js, Express, dan MySQL sesuai dengan Product Requirements Document (PRD).

## 🚀 Fitur

- ✅ Tambah tugas baru dengan judul dan deskripsi
- ✅ Lihat semua tugas dalam bentuk list
- ✅ Edit tugas yang sudah ada
- ✅ Hapus tugas dengan konfirmasi
- ✅ Tandai tugas sebagai selesai/belum selesai
- ✅ Filter tugas (Semua/Belum Selesai/Selesai)
- ✅ Pencarian tugas berdasarkan judul atau deskripsi
- ✅ Responsive design untuk mobile dan desktop
- ✅ Data tersimpan persisten di MySQL database

## 🛠️ Teknologi

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Styling**: Custom CSS dengan responsive design

## 📋 Prerequisites

- Node.js (v14 atau lebih tinggi)
- MySQL Server (v5.7 atau lebih tinggi)
- npm atau yarn

## 🔧 Instalasi

1. **Clone atau download project ini**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Database**
   - Pastikan MySQL server berjalan
   - Buat database bernama `todoapp`
   - Tabel `tasks` akan dibuat otomatis saat aplikasi pertama kali dijalankan

4. **Konfigurasi Database** (opsional)
   Jika perlu mengubah konfigurasi database, edit file `server.js` pada bagian:
   ```javascript
   const dbConfig = {
       host: 'localhost',
       user: 'root',
       password: '',
       database: 'todoapp',
       port: 3306
   };
   ```

5. **Jalankan Aplikasi**
   ```bash
   npm start
   ```
   
   Atau untuk development dengan auto-reload:
   ```bash
   npm run dev
   ```

6. **Akses Aplikasi**
   Buka browser dan kunjungi: `http://localhost:3000`

## 📊 Database Schema

Aplikasi menggunakan satu tabel `tasks` dengan struktur:

| Kolom | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| title | VARCHAR(255) | NOT NULL | Judul tugas |
| description | TEXT | NULL | Deskripsi tugas |
| is_completed | BOOLEAN | DEFAULT FALSE | Status selesai |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Waktu diupdate |

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/tasks` | Ambil semua tugas |
| GET | `/api/tasks/:id` | Ambil tugas spesifik |
| POST | `/api/tasks` | Buat tugas baru |
| PUT | `/api/tasks/:id` | Update tugas |
| PATCH | `/api/tasks/:id/toggle` | Toggle status tugas |
| DELETE | `/api/tasks/:id` | Hapus tugas |

## 📱 Fitur UI

### Desktop
- Layout dua kolom dengan form di atas dan list tugas di bawah
- Modal untuk edit dan konfirmasi hapus
- Filter dan pencarian di bagian atas list

### Mobile
- Layout responsif dengan stack vertikal
- Touch-friendly buttons dan inputs
- Modal yang menyesuaikan ukuran layar

## 🎨 Customization

### Mengubah Tema Warna
Edit file `public/styles.css` dan ubah variabel warna:
- Primary: `#3498db` (biru)
- Success: `#27ae60` (hijau)
- Danger: `#e74c3c` (merah)
- Secondary: `#95a5a6` (abu-abu)

### Menambah Fitur
1. Tambahkan endpoint baru di `server.js`
2. Update frontend di `public/script.js`
3. Sesuaikan styling di `public/styles.css`

## 🐛 Troubleshooting

### Database Connection Error
- Pastikan MySQL server berjalan
- Periksa kredensial database di `server.js`
- Pastikan database `todoapp` sudah dibuat

### Port Already in Use
- Ubah port di `server.js` atau set environment variable:
  ```bash
  PORT=3001 npm start
  ```

### Tasks Not Loading
- Periksa console browser untuk error JavaScript
- Periksa network tab untuk failed API requests
- Pastikan server backend berjalan

## 📈 Performance

- Aplikasi dapat menangani 1000+ tugas tanpa masalah performa
- Database menggunakan indexing pada kolom `created_at`
- Frontend menggunakan efficient DOM manipulation

## 🔒 Security

- Input validation untuk mencegah XSS
- Prepared statements untuk mencegah SQL injection
- CORS protection
- Error handling yang aman

## 📝 License

MIT License - bebas digunakan untuk project pribadi atau komersial.

## 🤝 Contributing

1. Fork project ini
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

---

**Dibuat sesuai dengan PRD v1.0 - Oktober 2025**