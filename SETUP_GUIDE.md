# 📚 Acquisitions API - Kurulum ve Dağıtım Rehberi

## 📋 İçindekiler
- [Hızlı Başlangıç](#hızlı-başlangıç)
- [Gereksinimler](#gereksinimler)
- [Geliştirme Ortamı Kurulumu](#geliştirme-ortamı-kurulumu)
- [Production Dağıtımı](#production-dağıtımı)
- [Docker Komutları](#docker-komutları)
- [Sorun Çözme](#sorun-çözme)

---

## 🚀 Hızlı Başlangıç

### Windows (Git Bash) / Linux / macOS
```bash
git clone https://github.com/kybrakorkmaz/acquisitions.git
cd acquisitions
npm install
npm run dev:docker
```

Uygulama `http://localhost:3000` adresinde çalışacak.

---

## ✅ Gereksinimler

- **Node.js 18+** (`node --version`)
- **Docker Desktop** (`docker --version`)
- **Git Bash** (Windows) veya native Bash
- **npm 9+** (`npm --version`)

### Windows'ta Kurulum
```powershell
# Docker Desktop'ı indir ve yükle
# https://www.docker.com/products/docker-desktop

# Git Bash'i indir
# https://git-scm.com/download/win
```

---

## 🛠️ Geliştirme Ortamı Kurulumu

### Seçenek 1: Docker ile (Önerilen)

Docker otomatik olarak **Neon Local** ve uygulamayı başlatır.

```bash
npm run dev:docker
```

**Neler olur:**
1. Neon Local PostgreSQL başlatılır (port 5432)
2. Express uygulaması başlatılır (port 3000)
3. Drizzle migrations otomatik çalışır
4. Hot-reload aktif edilir (dosya değişiklikleri otomatik yenilenir)

**Veritabanına bağlan:**
```bash
psql postgresql://acquisitions_user:acquisitions_password@localhost:5432/acquisitions_dev
```

### Seçenek 2: Lokal Kurulum (Manual)

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. .env dosyası oluştur
cp .env.example .env.development

# 3. Neon Cloud dev branch'ine bağlan (NEON_API_KEY gerekli)
# veya Neon Local'ı kendi Docker container'ında başlat

# 4. Migrations'ı çalıştır
npm run db:migrate

# 5. Dev sunucusunu başlat
npm run dev
```

---

## 🌐 Production Dağıtımı

### 1. Environment Değişkenlerini Ayarla

`.env.production` dosyasını oluştur:
```dotenv
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@ep-xxxxx-pooler.neon.tech/acquisitions_prod?sslmode=require
JWT_SECRET=STRONGLY_RANDOM_SECRET_HERE
LOG_LEVEL=info
ARCJET_KEY=your-arcjet-key
```

**Production Database URL'sini al:**
1. https://console.neon.tech adresine git
2. "Connection String" kopyala
3. `?sslmode=require` ekle

### 2. Docker Image'ı Build et

```bash
docker build -t acquisitions-app:latest .
```

### 3. Production Container'ını Başlat

```bash
docker compose -f docker-compose.prod.yml up -d
```

### 4. Migrations Çalıştır (İlk kez)

```bash
docker compose -f docker-compose.prod.yml exec app npm run db:migrate
```

### 5. Sağlık Kontrolü

```bash
curl http://localhost:3000/health
# Çıkış: {"status":"OK","timestamp":"...","uptime":123.45}
```

---

## 🐳 Docker Komutları

### Development

```bash
# Konteynerları başlat
npm run dev:docker
# veya
docker compose -f docker-compose.dev.yml up --build

# Konteynerları durdur
docker compose down

# Logları izle
docker compose logs -f app

# Neon Local'a bağlan
docker compose exec neon-local psql -U acquisitions_user -d acquisitions_dev
```

### Production

```bash
# Konteynerları başlat (background)
docker compose -f docker-compose.prod.yml up -d

# Logları izle
docker compose -f docker-compose.prod.yml logs -f app

# Konteynerları durdur
docker compose -f docker-compose.prod.yml down
```

---

## 📡 API Endpoints

### Kimlik Doğrulama

```bash
# Kayıt Ol
POST /api/auth/sign-up
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "user"
}

# Giriş Yap
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}

# Çıkış Yap
POST /api/auth/sign-out
```

### Sistem

```bash
# Sağlık Kontrolü
GET /health

# API Durumu
GET /api
```

---

## 🔍 Sorun Çözme

### Hata: "Docker is not running"
```bash
# Docker Desktop'ı aç veya başlat
# Windows: Başlat Menüsü > Docker Desktop
# Linux: sudo systemctl start docker
```

### Hata: "no configuration file provided"
```bash
# .env.development kontrol et
# DATABASE_URL ayarladığını doğrula
cat .env.development | grep DATABASE_URL
```

### Hata: "psql: command not found"
```bash
# PostgreSQL client'ını yükle
# macOS: brew install postgresql
# Ubuntu: apt-get install postgresql-client
# Windows: https://www.postgresql.org/download/windows/
```

### Konteyner'da Migration hataları
```bash
# Konteyner loglarını kontrol et
docker compose logs app

# Konteynerı yeniden build et
docker compose down
docker compose -f docker-compose.dev.yml up --build
```

### Port 3000 kullanımda
```bash
# Başka bir port kullan
PORT=3001 npm run dev:docker

# veya ProcessID'yi bul ve kapat
lsof -i :3000 | awk 'NR!=1 {print $2}' | xargs kill -9
```

---

## 📊 Veritabanı Yönetimi

### Schema Değişiklikleri

```bash
# Schema tanımını düzenle: src/models/user.model.js

# Migration üret
npm run db:generate

# Migration'ı uygula
npm run db:migrate

# Drizzle Studio (GUI) ile görüntüle
npm run db:studio
```

### Drizzle Studio

```bash
npm run db:studio
# Tarayıcı otomatik açılacak: http://localhost:5555
```

---

## 🔐 Güvenlik Kontrol Listesi

- [ ] `.env.production` dosyasında güçlü `JWT_SECRET` ayarlandı
- [ ] `NODE_TLS_REJECT_UNAUTHORIZED=1` production'da
- [ ] Database URL'si pooler endpoint'i kullanıyor
- [ ] SSL/TLS bağlantısı etkin (`?sslmode=require`)
- [ ] Arcjet rate limiting etkin
- [ ] CORS whitelist'i configure edildi
- [ ] Helmet güvenlik başlıkları aktif
- [ ] Logs düzenli kontrol ediliyor

---

## 📈 Performance İpuçları

1. **Connection Pooling**: Neon pooler endpoint'ini kullan (`-pooler.neon.tech`)
2. **Caching**: Redis ekle (TODO)
3. **Monitoring**: DataDog/New Relic entegre et (TODO)
4. **Database Indexes**: Sık sorgulanan alanlar için index ekle
5. **Async Processing**: Ağır işlemler için queue ekle (TODO)

---

## 📞 Yardım & Destek

- **GitHub Issues**: https://github.com/kybrakorkmaz/acquisitions/issues
- **Neon Docs**: https://neon.com/docs
- **Express Docs**: https://expressjs.com
- **Drizzle Docs**: https://orm.drizzle.team

---

## 📜 Lisans

ISC License - https://github.com/kybrakorkmaz/acquisitions

