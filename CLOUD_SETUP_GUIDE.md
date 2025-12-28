# 🌐 Cloud Setup Guide - TiDB & Cloudinary

Panduan lengkap untuk setup **TiDB Cloud** (database) dan **Cloudinary** (storage) untuk proyek Pintenrest.

---

## 🗄️ Part 1: Setup TiDB Cloud (Database)

### 1. Daftar TiDB Cloud

1. Buka: https://tidbcloud.com
2. Klik **"Start Free"** atau **"Sign Up"**
3. Daftar dengan email atau GitHub account
4. Verifikasi email

### 2. Buat Cluster Baru

1. Setelah login, klik **"Create Cluster"**
2. Pilih **"Serverless Tier"** (GRATIS, cocok untuk development)
3. Konfigurasi:
   - **Cluster Name**: `pintenrest-db` (atau nama bebas)
   - **Cloud Provider**: AWS
   - **Region**: `ap-southeast-1` (Singapore - paling dekat)
4. Klik **"Create"**
5. Tunggu ~1-2 menit sampai cluster ready

### 3. Dapatkan Connection String

1. Klik cluster yang baru dibuat
2. Klik **"Connect"**
3. Pilih tab **"Standard Connection"**
4. Copy informasi berikut:

```
Host: gateway01.ap-southeast-1.prod.aws.tidbcloud.com
Port: 4000
User: <your-username>
Password: <your-password>
```

### 4. Buat Database

1. Di dashboard TiDB, klik **"Chat2Query"** atau **"SQL Editor"**
2. Jalankan command ini:

```sql
CREATE DATABASE IF NOT EXISTS pintenrest_db;
USE pintenrest_db;
```

3. Import schema:
   - Copy isi file `server/schema.sql` (MULAI DARI BARIS 5, skip CREATE DATABASE)
   - Paste dan execute di SQL Editor

### 5. Update .env Server

Edit file `server/.env`:

```env
DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
DB_USER=<username-dari-tidb>
DB_PASSWORD=<password-dari-tidb>
DB_NAME=pintenrest_db
DB_PORT=4000
DB_SSL=true
```

---

## 📸 Part 2: Setup Cloudinary (Image Storage)

### 1. Daftar Cloudinary

1. Buka: https://cloudinary.com/users/register/free
2. Daftar akun gratis
3. Verifikasi email

### 2. Dapatkan API Credentials

1. Setelah login, masuk ke **Dashboard**
2. Lihat section **"Account Details"**
3. Copy 3 values ini:
   - **Cloud Name**: `dxxxxxx` (contoh)
   - **API Key**: `123456789012345`
   - **API Secret**: `abcdefghijklmnopqrstuvwxyz`

### 3. Buat Upload Preset (untuk Direct Upload)

1. Di dashboard, klik **Settings** (⚙️ icon di kanan atas)
2. Klik tab **"Upload"**
3. Scroll ke **"Upload presets"**
4. Klik **"Add upload preset"**
5. Konfigurasi:
   - **Preset name**: `pintenrest_uploads`
   - **Signing mode**: **Unsigned** ⚠️ (PENTING!)
   - **Folder**: `pintenrest` (opsional, untuk organize)
6. Klik **"Save"**

### 4. Update Environment Files

**Server (.env):**
```env
CLOUDINARY_CLOUD_NAME=dxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

**Client (.env.local):**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxxxxxx
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=pintenrest_uploads
```

---

## ✅ Verifikasi Setup

### Test Database Connection

```bash
cd server
node -e "const pool = require('./config/db'); pool.query('SELECT 1').then(() => console.log('✅ Database connected!')).catch(err => console.error('❌ Error:', err.message));"
```

### Test Cloudinary

Jalankan server dan client, lalu:
1. Buka: http://localhost:3000/bosmuda
2. Coba upload gambar di form "Add Project"
3. Kalau berhasil, gambar akan tersimpan di Cloudinary

---

## 🚀 Jalankan Aplikasi

### 1. Copy Environment Files

```bash
# Server
cd server
copy .env.example .env
# Lalu edit .env dengan credentials TiDB & Cloudinary

# Client
cd ..\client
copy .env.local.example .env.local
# Lalu edit .env.local dengan Cloudinary settings
```

### 2. Jalankan Server

```bash
cd server
npm start
```

Output yang diharapkan:
```
🚀 Server running on http://localhost:5000
```

### 3. Jalankan Client (Terminal Baru)

```bash
cd client
npm run dev
```

Output yang diharapkan:
```
ready - started server on 0.0.0.0:3000
```

### 4. Akses Aplikasi

- **Frontend**: http://localhost:3000
- **Admin**: http://localhost:3000/bosmuda
- **API Health**: http://localhost:5000/api/health

---

## 📊 Monitoring & Management

### TiDB Cloud Dashboard
- URL: https://tidbcloud.com
- Lihat metrics, slow queries, storage usage
- Free tier: 5GB storage, 50M requests/month

### Cloudinary Dashboard
- URL: https://cloudinary.com/console
- Media library: lihat semua uploaded images
- Usage: monitor bandwidth & storage
- Free tier: 25GB storage, 25GB bandwidth/month

---

## 🐛 Troubleshooting

### Error: "connect ETIMEDOUT" (TiDB)
- Cek internet connection
- Pastikan `DB_SSL=true` di .env
- Cek firewall tidak block port 4000

### Error: "Invalid signature" (Cloudinary)
- Pastikan upload preset adalah **"Unsigned"**
- Double-check CLOUD_NAME dan UPLOAD_PRESET spelling

### Database schema tidak ada
- Masuk ke TiDB SQL Editor
- Jalankan seluruh isi `server/schema.sql` (kecuali baris USE database)

---

## 💰 Free Tier Limits

**TiDB Serverless:**
- ✅ 5 GB storage
- ✅ 50M request units/month
- ✅ Unlimited databases

**Cloudinary Free:**
- ✅ 25 GB storage
- ✅ 25 GB bandwidth/month
- ✅ 25k transformations/month

Cukup untuk development & small projects! 🎉

---

## 📝 Checklist

- [ ] Daftar TiDB Cloud
- [ ] Buat cluster & database `pintenrest_db`
- [ ] Import schema ke TiDB
- [ ] Copy credentials TiDB ke `.env`
- [ ] Daftar Cloudinary
- [ ] Buat upload preset (unsigned)
- [ ] Copy credentials Cloudinary ke `.env` dan `.env.local`
- [ ] Test database connection
- [ ] Test image upload
- [ ] Run server & client

Selamat! Aplikasi kamu sekarang pakai cloud services! ☁️🚀
