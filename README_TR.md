# 🎯 Acquisitions API

Backend Node.js Express uygulaması, Neon Database ile PostgreSQL desteğiyle birlikte gelir. Tam CRUD işlemleri, kimlik doğrulama ve yetkilendirme özelliklerine sahiptir.

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 20.x+
- Docker & Docker Compose (development için)
- Git

### Local Kurulum

1. **Repository'yi klonlayın**

```bash
git clone https://github.com/kybrakorkmaz/acquisitions.git
cd acquisitions
```

2. **Bağımlılıkları yükleyin**

```bash
npm install
```

3. **Ortam değişkenlerini ayarlayın**

```bash
cp .env.example .env.development
```

4. **Development modunda çalıştırın**

```bash
# Neon Local ve app ile Docker'da çalıştır
npm run dev:docker

# Veya sadece app'i çalıştır
npm run dev
```

5. **API'yi test edin**

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api
```

---

## 🐳 Docker Kurulumu

### Development (Neon Local)

```bash
npm run dev:docker
```

Bu komut:

- Neon Local proxy'yi başlatır (otomatik ephemeral database branch oluşturur)
- Node.js uygulamasını hot-reload ile başlatır
- PostgreSQL veritabanını lokal olarak çalıştırır

### Production

```bash
npm run prod:docker
```

Bu komut:

- Neon Cloud Database URL'sini kullanır
- Üretim ortamında optimized imaj çalıştırır

---

## 📦 Mevcut npm Scripts

```bash
# Development
npm run dev                 # Watch mode ile başlat
npm run start              # Production mode

# Testing
npm test                   # Testleri çalıştır (coverage ile)

# Linting & Formatting
npm run lint               # ESLint kontrol
npm run lint:fix           # ESLint otomatik düzeltme
npm run format             # Prettier otomatik formatla
npm run format:check       # Prettier kontrol

# Database
npm run db:generate        # Drizzle migration oluştur
npm run db:migrate         # Migration'ları uygula
npm run db:push            # Schema'yı push et
npm run db:studio          # Drizzle Studio aç

# Docker
npm run dev:docker         # Docker'da dev çalıştır (Neon Local)
npm run prod:docker        # Docker'da prod çalıştır
```

---

## 🔐 Ortam Değişkenleri

### Development (.env.development)

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/neondb
NODE_TLS_REJECT_UNAUTHORIZED=0
```

### Production (.env.production)

```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...@...neon.tech/...
JWT_SECRET=your-secret-key
ARCJET_KEY=your-arcjet-key
```

---

## 🔗 API Endpoints

### Health Check

```
GET /health
```

### Users

```
GET /api/users              # Tüm kullanıcıları listele
GET /api/users/:id          # Kullanıcı detayını al
POST /api/users             # Yeni kullanıcı oluştur
PUT /api/users/:id          # Kullanıcıyı güncelle
DELETE /api/users/:id       # Kullanıcıyı sil (Admin)
```

### Authentication

```
POST /auth/signup           # Kaydol
POST /auth/signin           # Giriş yap
POST /auth/signout          # Çıkış yap
```

---

## 🧪 Testler

### Testleri Çalıştırma

```bash
npm test
```

### Coverage Raporu

```bash
npm test -- --coverage
```

Coverage raporları `coverage/` klasöründe bulunur.

---

## 🚀 CI/CD Pipelines

Bu proje 3 GitHub Actions workflow'u içermektedir:

### 1. **Lint and Format** ✨

- **Trigger:** `main` ve `staging` branchlerine push/PR
- **İşlem:** ESLint ve Prettier kontrol
- **Başarısız olursa:** PR'ye yorum ile düzeltme önerileri sunar

Detaylar: [.github/workflows/lint-and-format.yml](.github/workflows/lint-and-format.yml)

### 2. **Tests** 🧪

- **Trigger:** `main` ve `staging` branchlerine push/PR
- **İşlem:** Jest testlerini çalıştırır, coverage raporu oluşturur
- **Artifacts:** Coverage raporları 30 gün boyunca saklanır

Detaylar: [.github/workflows/tests.yml](.github/workflows/tests.yml)

### 3. **Docker Build and Push** 🐳

- **Trigger:** `main` branch'e push veya manuel (`workflow_dispatch`)
- **İşlem:** Multi-platform Docker imaj oluşturur ve Docker Hub'a yükler
- **Platformlar:** linux/amd64, linux/arm64

Detaylar: [.github/workflows/docker-build-and-push.yml](.github/workflows/docker-build-and-push.yml)

### Workflow Kurulumu

Workflow'ların çalışması için GitHub Secrets'ı ayarlamanız gerekir:

- `DOCKER_USERNAME`: Docker Hub kullanıcı adı
- `DOCKER_PASSWORD`: Docker Hub Personal Access Token

Detaylı kurulum rehberi: [.github/SECRETS_SETUP.md](.github/SECRETS_SETUP.md)

Workflow dokumentasyonu: [.github/WORKFLOWS_README.md](.github/WORKFLOWS_README.md)

---

## 📊 Proje Yapısı

```
acquisitions/
├── src/
│   ├── config/              # Konfigürasyon dosyaları
│   │   ├── arcjet.js       # Security
│   │   ├── database.js     # Database bağlantısı
│   │   └── logger.js       # Winston logger
│   ├── controllers/         # HTTP request handlers
│   │   ├── auth.controller.js
│   │   └── users.controller.js
│   ├── middleware/          # Express middleware
│   │   ├── permissions.middleware.js
│   │   └── security.middleware.js
│   ├── models/              # Drizzle ORM models
│   │   └── user.model.js
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   └── users.routes.js
│   ├── services/            # Business logic
│   │   ├── auth.service.js
│   │   └── users.services.js
│   ├── utils/               # Utility fonksiyonları
│   │   ├── cookies.js
│   │   ├── format.js
│   │   └── jwt.js
│   ├── validations/         # Zod validation schemas
│   │   ├── auth.validation.js
│   │   └── users.validation.js
│   ├── app.js              # Express app
│   └── index.js            # Entry point
├── tests/                   # Jest test dosyaları
├── drizzle/                 # Database migrations
├── .github/workflows/       # GitHub Actions CI/CD
├── scripts/                 # Bash scripts
├── docker-compose.dev.yml   # Development compose
├── docker-compose.prod.yml  # Production compose
├── Dockerfile              # Docker image config
└── package.json            # Dependencies
```

---

## 🔒 Güvenlik Özellikleri

- ✅ **Arcjet**: Rate limiting ve bot protection
- ✅ **Helmet**: HTTP headers security
- ✅ **CORS**: Cross-origin kontrolü
- ✅ **JWT**: Secure token-based authentication
- ✅ **Bcrypt**: Password hashing
- ✅ **Morgan**: Request logging

---

## 📚 Rehberler

- [Permissions Guide](PERMISSIONS_GUIDE.md) - Yetkilendirme sistemi
- [User CRUD Guide](USER_CRUD_GUIDE.md) - Kullanıcı CRUD işlemleri
- [Windows Test Fix](WINDOWS_TEST_FIX.md) - Windows'ta test sorunları

---

## 📝 Stack

- **Runtime:** Node.js 20+
- **Framework:** Express.js 5.x
- **Database:** PostgreSQL (Neon)
- **ORM:** Drizzle ORM
- **Validation:** Zod
- **Testing:** Jest + Supertest
- **Code Quality:** ESLint + Prettier
- **Logging:** Winston
- **Authentication:** JWT + Bcrypt
- **Security:** Helmet, Arcjet, CORS

---

## 🤝 Katkı Yapmak

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişiklikleri commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

Tüm PR'ler CI/CD pipeline'ından geçmelidir:

- ✅ Linting
- ✅ Formatting
- ✅ Tests

---

## 📄 Lisans

ISC

---

## 👨‍💻 Yazar

[kybrakorkmaz](https://github.com/kybrakorkmaz)

---

## 🔗 Bağlantılar

- [GitHub Repository](https://github.com/kybrakorkmaz/acquisitions)
- [GitHub Issues](https://github.com/kybrakorkmaz/acquisitions/issues)
- [Neon Documentation](https://neon.com/docs)
- [Express.js Documentation](https://expressjs.com)

---

**Son Güncelleme:** 2026-04-10

---

## 🌐 Dil / Language

- **[English](README.md)** - English versiyonunu okumak için tıklayın
- **Türkçe** - Şu an burada
