# Product Requirements Document (PRD)
## Simple To-Do List Application

### 1. Overview

**Nama Produk:** Simple To-Do List App

**Versi:** 1.0

**Tanggal:** Oktober 2025

**Dibuat oleh:** Product Team

### 2. Tujuan Produk

Membangun aplikasi to-do list sederhana yang memungkinkan pengguna untuk mengelola tugas-tugas harian mereka dengan antarmuka yang intuitif dan data yang tersimpan secara persisten di database MySQL.

### 3. Target Pengguna

- Individu yang membutuhkan tool sederhana untuk mengelola tugas harian
- Pengguna yang menginginkan akses cepat untuk menambah, mengedit, dan menghapus tugas
- Pengguna yang memerlukan penyimpanan data yang persisten dan reliable

### 4. Fitur Utama

#### 4.1 Manajemen Task
- **Tambah Task Baru**
  - Input field untuk judul task
  - Input field untuk deskripsi task (opsional)
  - Tombol submit untuk menyimpan task
  
- **Lihat Daftar Task**
  - Menampilkan semua task dalam bentuk list
  - Menampilkan status task (completed/pending)
  - Sorting berdasarkan tanggal dibuat (terbaru di atas)

- **Edit Task**
  - Kemampuan untuk mengubah judul task
  - Kemampuan untuk mengubah deskripsi task
  - Update timestamp otomatis saat task diedit

- **Hapus Task**
  - Tombol delete untuk setiap task
  - Konfirmasi sebelum menghapus (opsional untuk v1.0)

- **Mark as Complete/Incomplete**
  - Checkbox atau toggle untuk menandai task selesai
  - Visual indicator untuk task yang sudah selesai (strikethrough, warna berbeda)

#### 4.2 Filter & Search (Nice to Have)
- Filter task berdasarkan status (All/Completed/Pending)
- Search task berdasarkan judul atau deskripsi

### 5. Spesifikasi Teknis

#### 5.1 Teknologi Stack
**Frontend:**
- HTML5, CSS3, JavaScript (atau framework pilihan: React, Vue, atau vanilla JS)
- Responsive design untuk mobile dan desktop

**Backend:**
- Node.js dengan Express.js (atau PHP, Python Flask/Django)
- RESTful API architecture

**Database:**
- MySQL 5.7 atau lebih tinggi

#### 5.2 Database Schema

**Tabel: tasks**

| Kolom | Tipe Data | Constraint | Deskripsi |
|-------|-----------|------------|-----------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier untuk task |
| title | VARCHAR(255) | NOT NULL | Judul task |
| description | TEXT | NULL | Deskripsi detail task |
| is_completed | BOOLEAN | DEFAULT FALSE | Status task (0=pending, 1=completed) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Waktu task dibuat |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Waktu task terakhir diupdate |

**SQL untuk membuat tabel:**
```sql
CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 5.3 API Endpoints

| Method | Endpoint | Deskripsi | Request Body | Response |
|--------|----------|-----------|--------------|----------|
| GET | /api/tasks | Ambil semua tasks | - | Array of tasks |
| GET | /api/tasks/:id | Ambil task spesifik | - | Single task object |
| POST | /api/tasks | Buat task baru | {title, description} | Created task object |
| PUT | /api/tasks/:id | Update task | {title, description, is_completed} | Updated task object |
| DELETE | /api/tasks/:id | Hapus task | - | Success message |
| PATCH | /api/tasks/:id/toggle | Toggle status task | - | Updated task object |

#### 5.4 Konfigurasi Database
- Host: localhost (atau sesuai environment)
- Port: 3306 (default MySQL)
- Database Name: todo_app_db
- Character Set: utf8mb4
- Collation: utf8mb4_unicode_ci

### 6. User Interface Requirements

#### 6.1 Layout Utama
- Header dengan judul aplikasi
- Input form untuk menambah task baru
- List area untuk menampilkan semua tasks
- Footer (opsional)

#### 6.2 Komponen UI
- Input text field (untuk judul task)
- Textarea (untuk deskripsi task)
- Button "Add Task"
- Task card untuk setiap item dengan:
  - Checkbox untuk mark complete
  - Judul task
  - Deskripsi (collapsible atau truncated)
  - Tombol Edit
  - Tombol Delete
  - Timestamp

#### 6.3 Design Guidelines
- Clean dan minimalis
- Mobile-first responsive design
- Color scheme: neutral dengan accent color untuk actions
- Typography: Readable font dengan hierarchy yang jelas

### 7. Non-Functional Requirements

#### 7.1 Performance
- Load time halaman < 2 detik
- Response time API < 500ms untuk operasi CRUD
- Support minimal 1000 tasks tanpa performance degradation

#### 7.2 Security
- Input validation untuk mencegah SQL injection
- XSS protection
- CSRF token untuk form submission
- Prepared statements untuk database queries

#### 7.3 Reliability
- Database connection pooling
- Error handling untuk semua API endpoints
- Graceful degradation jika database tidak tersedia

#### 7.4 Usability
- Intuitive UI yang tidak memerlukan dokumentasi
- Error messages yang jelas dan actionable
- Konfirmasi untuk destructive actions

### 8. Success Metrics

- User dapat menambah task dalam < 5 detik
- User dapat menyelesaikan task dalam < 2 klik
- Zero data loss (semua perubahan tersimpan di database)
- 95% uptime

### 9. Future Enhancements (Out of Scope untuk v1.0)

- User authentication dan multi-user support
- Categories/tags untuk tasks
- Due dates dan reminders
- Priority levels
- Recurring tasks
- Dark mode
- Export data (CSV, PDF)
- Mobile app (iOS/Android)
- Collaboration features
- Subtasks
- File attachments

### 10. Timeline & Milestones

**Week 1-2:** Setup & Backend Development
- Database design dan setup
- API development
- Testing API endpoints

**Week 3:** Frontend Development
- UI/UX implementation
- Integration dengan backend API
- Responsive design

**Week 4:** Testing & Deployment
- Unit testing
- Integration testing
- Bug fixes
- Deployment ke production

### 11. Dependencies & Assumptions

**Dependencies:**
- MySQL server harus sudah terinstall dan running
- Node.js environment (atau tech stack yang dipilih)
- Web hosting atau server untuk deployment

**Assumptions:**
- Single user application (tidak ada authentication di v1.0)
- Akses ke MySQL database sudah tersedia
- Browser modern dengan JavaScript enabled
- Internet connection untuk akses aplikasi

### 12. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Database connection failure | High | Implement connection pooling dan retry logic |
| Data loss | High | Regular backup database, transaction management |
| SQL injection | High | Use prepared statements, input validation |
| Poor performance dengan banyak tasks | Medium | Implement pagination, indexing |
| Browser compatibility | Medium | Test di berbagai browser, use polyfills |

### 13. Acceptance Criteria

Aplikasi dianggap selesai dan siap launch jika:
- ✅ User dapat menambah task baru
- ✅ User dapat melihat semua tasks
- ✅ User dapat edit task yang sudah ada
- ✅ User dapat hapus task
- ✅ User dapat mark task sebagai complete/incomplete
- ✅ Semua data tersimpan persisten di MySQL database
- ✅ UI responsive di mobile dan desktop
- ✅ Tidak ada critical bugs
- ✅ API berfungsi dengan baik dan stabil