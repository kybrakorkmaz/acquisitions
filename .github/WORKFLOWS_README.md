# 🚀 GitHub Actions Workflows

Bu proje 3 GitHub Actions CI/CD workflow'u içermektedir. Tüm workflow'lar `.github/workflows/` klasöründe bulunmaktadır.

## 📋 Workflow'lar

### 1. **lint-and-format.yml** ✨
Kod kalitesi ve formatlamayı kontrol eder.

**Trigger:**
- `main` ve `staging` branchlerine push işlemleri
- `main` ve `staging` branchlerine pull request'ler

**Yapılan İşlemler:**
- ESLint ile kod stili kontrol edilir
- Prettier ile kod formatı kontrol edilir
- PR üzerinde otomatik yorum bırakır ve düzeltme önerileri sunar
- Sorunlar bulunursa workflow başarısız olur

**Komutlar:**
```bash
npm run lint        # ESLint kontrolü
npm run lint:fix    # ESLint otomatik düzeltme
npm run format      # Prettier otomatik formatla
npm run format:check # Prettier kontrol
```

---

### 2. **tests.yml** 🧪
Testleri çalıştırır ve coverage raporları oluşturur.

**Trigger:**
- `main` ve `staging` branchlerine push işlemleri
- `main` ve `staging` branchlerine pull request'ler

**Yapılan İşlemler:**
- Node.js 20.x ile testler çalıştırılır
- PostgreSQL 16 servisi başlatılır
- Test coverage raporları oluşturulur
- Coverage raporları 30 gün boyunca artifact olarak saklanır
- PR üzerinde test sonuçları gösterilir
- Test başarısızlıkları otomatik olarak bildirilir

**Ortam Değişkenleri:**
```
NODE_ENV: test
NODE_OPTIONS: --experimental-vm-modules
DATABASE_URL: postgresql://user:password@localhost:5432/neondb
```

**Komut:**
```bash
npm test  # Testleri çalıştır (coverage ile)
```

---

### 3. **docker-build-and-push.yml** 🐳
Docker imajı oluşturur ve Docker Hub'a yükler.

**Trigger:**
- `main` branchine push işlemleri
- Manuel trigger (`workflow_dispatch`)

**Yapılan İşlemler:**
- Docker Buildx multi-platform desteğiyle yapılandırılır
- Docker Hub'a giriş yapılır
- Metadata çıkarılır (branch, commit SHA, latest, timestamp)
- linux/amd64 ve linux/arm64 platformları için imaj inşa edilir
- Cache optimizasyonu için GitHub Actions cache kullanılır
- Docker Hub'a imaj yüklenir
- GitHub Summary'ye imaj bilgileri eklenir

**Desteklenen Platformlar:**
- `linux/amd64`
- `linux/arm64`

---

## 🔐 Gerekli GitHub Secrets

Docker Build and Push workflow'u için aşağıdaki secrets'ı GitHub repository'nize ekleyin:

### Settings → Secrets and variables → Actions

1. **DOCKER_USERNAME** 
   - Açıklama: Docker Hub kullanıcı adı
   - Örnek: `your-docker-username`

2. **DOCKER_PASSWORD**
   - Açıklama: Docker Hub access token veya şifresi
   - Not: Personal Access Token (PAT) kullanmanız önerilir

### Secrets Ekleme Adımları:

1. GitHub repository'nize gidin
2. `Settings` → `Secrets and variables` → `Actions` seçin
3. `New repository secret` butonuna tıklayın
4. Aşağıdaki secrets'ı ekleyin:

```yaml
DOCKER_USERNAME: your-username
DOCKER_PASSWORD: your-pat-token
```

---

## 📊 Workflow Detayları

### Lint and Format Workflow
```
├── Node.js 20.x Kurulumu (npm cache ile)
├── Bağımlılık kurulumu (npm ci)
├── ESLint çalıştırma
├── Prettier kontrol
├── Sorun bulunursa PR'ye yorum bırakma
└── Workflow başarısız olması
```

### Tests Workflow
```
├── PostgreSQL 16 servisi başlatma
├── Node.js 20.x Kurulumu (npm cache ile)
├── Bağımlılık kurulması
├── Testleri çalıştırma (coverage ile)
├── Coverage raporlarını artifact olarak kaydetme
├── GitHub Summary'ye sonuç yazma
├── Başarısız test için PR'ye yorum
└── Artifact'ları 30 gün saklama
```

### Docker Build and Push Workflow
```
├── Docker Buildx setup
├── Docker Hub login
├── Metadata çıkarma
├── Multi-platform build (amd64, arm64)
├── Cache optimizasyonu
├── Docker Hub'a push
└── GitHub Summary'ye bilgi yazma
```

---

## 🏷️ Docker İmaj Etiketleri

Workflow aşağıdaki etiketlerle imaj oluşturur:

- `branch` - Branch adı (örn: `main`)
- `sha` - Commit SHA (örn: `main-abc123def`)
- `latest` - En son sürüm
- `prod-YYYYMMDD-HHmmss` - Tarih ve saat damgası (örn: `prod-20260410-093045`)

**Örnek:**
```
your-username/acquisitions:main
your-username/acquisitions:main-abc123def
your-username/acquisitions:latest
your-username/acquisitions:prod-20260410-093045
```

---

## 🔍 Workflow Durumunu Kontrol Etme

1. GitHub repository'nize gidin
2. `Actions` sekmesine tıklayın
3. Aktif workflow'ları ve geçmiş çalıştırmaları görebilirsiniz
4. Her workflow'un detaylı loglarını inceleyebilirsiniz

---

## ⚡ Hızlı Başlangıç

### Local Test
```bash
# Lint kontrol
npm run lint

# Format kontrol
npm run format:check

# Testleri çalıştır
npm test
```

### Docker İmaj Oluştur
```bash
# Dockerfile'dan imaj oluştur
docker build -t your-username/acquisitions:latest .

# Multi-platform build
docker buildx build --platform linux/amd64,linux/arm64 -t your-username/acquisitions:latest .
```

---

## 📝 Notlar

- Workflow'lar GitHub Actions runner'ında Ubuntu 22.04 LTS üzerinde çalışır
- Cache optimizasyonu GitHub Actions cache'ini kullanır
- Coverage raporları action'ın tamamlanmasından sonra indirilebilir
- Docker imajları yalnızca `main` branch'ine push yapıldığında yüklenir
- Workflow dispatch seçeneği ile manuel çalıştırma mümkündür

---

## 🆘 Sorun Giderme

### Docker Push Başarısız Oluyorsa
- `DOCKER_USERNAME` ve `DOCKER_PASSWORD` secrets'inin doğru ayarlanmış olup olmadığını kontrol edin
- Docker Hub'da Personal Access Token oluşturduğunuzdan emin olun

### Testler Başarısız Oluyorsa
- Yerel makinada `npm test` çalıştırarak sorunları çözün
- Coverage raporlarını indirerek detay inceyin

### Lint/Format Başarısız Oluyorsa
- Local'de `npm run lint:fix` ve `npm run format` çalıştırın
- Değişiklikleri commit edin

