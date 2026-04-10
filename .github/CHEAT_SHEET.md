# 🚀 GitHub Actions CI/CD Cheat Sheet

Hızlı referans rehberi

**📖 [English Version / İngilizce Versiyon →](CHEAT_SHEET_EN.md)**

---

## 📁 Dosya Konumları

```
acquisitions/
├── .github/
│   ├── workflows/
│   │   ├── lint-and-format.yml
│   │   ├── tests.yml
│   │   └── docker-build-and-push.yml
│   ├── SETUP_SUMMARY.md (Bu rehber)
│   ├── WORKFLOWS_README.md
│   └── SECRETS_SETUP.md
```

---

## ⚡ Hızlı Komutlar

### Local Test

```bash
npm run lint          # ESLint kontrol
npm run lint:fix      # ESLint düzeltme
npm run format        # Prettier formatla
npm run format:check  # Prettier kontrol
npm test              # Testleri çalıştır
npm test -- --coverage  # Testleri coverage ile çalıştır
```

### Docker

```bash
npm run dev:docker    # Development (Neon Local)
npm run prod:docker   # Production
```

### Database

```bash
npm run db:generate   # Migration oluştur
npm run db:migrate    # Migration uygula
npm run db:push       # Schema push et
npm run db:studio     # Drizzle Studio aç
```

---

## 🔐 GitHub Secrets Setup

```
Repository Settings → Secrets and variables → Actions

DOCKER_USERNAME = your-docker-username
DOCKER_PASSWORD = your-docker-pat-token
```

**Token nasıl oluşturulur?**

1. Docker Hub → Account Settings → Security
2. New Access Token → Generate
3. Token'ı kopyala → GitHub Secrets'a yapıştır

---

## 📊 Workflow Matrix

| Dosya                     | Trigger                | Node | Cache | Cache? |
| ------------------------- | ---------------------- | ---- | ----- | ------ |
| lint-and-format.yml       | push/PR (main,staging) | 20.x | npm   | ✅     |
| tests.yml                 | push/PR (main,staging) | 20.x | npm   | ✅     |
| docker-build-and-push.yml | push (main) + manual   | -    | gha   | ✅     |

---

## 🎯 Her Workflow'un Yaptığı

### 1. lint-and-format.yml

```
ESLint → Prettier → PR Comment → Fail/Pass
```

### 2. tests.yml

```
PostgreSQL ↓
npm test --coverage → Artifacts → Summary → Comment → Fail/Pass
```

### 3. docker-build-and-push.yml

```
Docker Buildx → amd64 + arm64 → Docker Hub → Summary
```

---

## 🔍 Workflow'u Debug Etme

### GitHub Actions Dashboard

```
1. Repository → Actions
2. Workflow seç → Run seç
3. Log'ları inceле
```

### PR Comment Görmek İçin

```
PR → Conversation sekmesi → Bot comments
```

### Artifacts İndirmek

```
Run details → Artifacts → Download coverage-report
```

---

## 🆘 Yaygın Sorunlar

### Docker Push Başarısız

```
Kontrol et:
- DOCKER_USERNAME secret doğru mu?
- DOCKER_PASSWORD secret doğru mu?
- Token'ın süresi dolmadı mı?
- Docker Hub'da push izni var mı?
```

### Test Başarısız

```
1. Local'de test çalıştır: npm test
2. Coverage raporu kontrol et: coverage/
3. PR comment'i oku
```

### Linting Başarısız

```
1. Fix et: npm run lint:fix
2. Format et: npm run format
3. Commit et ve push et
```

---

## 📈 Docker İmaj Etiketleri

Hangi etiketler oluşturulur?

```
your-username/acquisitions:main              ← Branch adı
your-username/acquisitions:main-abc123def    ← Commit SHA
your-username/acquisitions:latest            ← Son sürüm
your-username/acquisitions:prod-20260410-093045  ← Timestamp
```

---

## ✅ Pre-Push Checklist

Push etmeden önce çalıştır:

```bash
npm run lint:fix      # Linting düzelt
npm run format        # Formatı ayarla
npm test              # Testleri çalıştır
```

Sonra push et:

```bash
git add .
git commit -m "descriptive message"
git push origin main
```

---

## 🔗 Useful Links

- [Workflow Documentation](.github/WORKFLOWS_README.md)
- [Secrets Setup](.github/SECRETS_SETUP.md)
- [Setup Summary](.github/SETUP_SUMMARY.md)
- [Main README](README.md)

---

## 🎯 Hangi Branch'e Push Etmelisin?

- **main** → Tüm 3 workflow çalışır (Docker da yükler)
- **staging** → lint-and-format + tests çalışır (Docker yüklenmez)
- **Diğer** → Workflow çalışmaz

---

## 💡 Pro Tips

1. **Local'de Test Et** - Push etmeden `npm test` ve `npm run lint` çalıştır
2. **Coverage Raporu İnceле** - `npm test -- --coverage` sonra `coverage/lcov-report/index.html` aç
3. **Token Güvenliği** - Token'ı logs'ta görülmez (masked)
4. **Cache Hızlandırması** - Tekrar tekrar çalışan workflow'lar daha hızlı
5. **Multi-Platform** - Docker imaj hem amd64 hem arm64 için oluşturulur

---

## 🚨 Workflow İptal Etme

GitHub Actions UI'da:

```
1. Actions → Active workflow
2. Sağ tarafta "..." menu
3. Cancel workflow seçin
```

---

## 📞 Destek

Sorun olursa:

1. GitHub Actions logs'ı kontrol et
2. WORKFLOWS_README.md oku
3. SECRETS_SETUP.md kontrol et
4. Local'de same command'i çalıştır ve debug et

---

**Last Updated:** 2026-04-10
