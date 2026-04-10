# 📖 GitHub Actions CI/CD Documentasyon İndeksi

Bu dizinde GitHub Actions CI/CD pipeline'ı hakkında tüm dökümanlar bulunmaktadır.

**📖 [English Version / İngilizce Versiyon →](INDEX_EN.md)**

---

## 📚 Döküman Rehberi

### 1. **SETUP_SUMMARY.md** 🎯 (BURADAN BAŞLA!)

**Tüm kurulumun özeti**

- ✅ Oluşturulan dosyalar listesi
- ✅ Workflow özet tablosu
- ✅ Gerekli GitHub Secrets
- ✅ Her workflow'un detaylı açıklaması
- ✅ İlk çalıştırma adımları
- ✅ Kontrol listesi

**Ne zaman okusun:** İlk defa kurulum yapıyorsan

---

### 2. **CHEAT_SHEET.md** ⚡ (HIZLI REFERANS)

**Hızlı komut ve linkler**

- ✅ Dosya konumları
- ✅ Sık kullanılan komutlar
- ✅ Workflow matrix
- ✅ Debug tipleri
- ✅ Yaygın sorunlar ve çözümleri
- ✅ Pro tips

**Ne zaman okusun:** Hızlı referansa ihtiyacın olursa

---

### 3. **WORKFLOWS_README.md** 📋 (DETAYLI AÇIKLAMA)

**Her workflow'un tam açıklaması**

- ✅ Workflow trigger koşulları
- ✅ Yapılan işlemlerin adım adım açıklaması
- ✅ Ortam değişkenleri
- ✅ Docker tag örnekleri
- ✅ Platform desteği
- ✅ Troubleshooting guide

**Ne zaman okusun:** Workflow'lar hakkında derinlemesine bilgi istiyorsan

---

### 4. **SECRETS_SETUP.md** 🔐 (SECRETS KURULUM)

**GitHub Secrets'ı nasıl kuracağını öğren**

- ✅ Docker Hub hesabı oluşturma
- ✅ Personal Access Token (PAT) oluşturma
- ✅ GitHub Secrets ekleme (web UI ve CLI)
- ✅ Secrets doğrulama
- ✅ Güvenlik önerileri
- ✅ Token yönetimi

**Ne zaman okusun:** Docker Build and Push workflow'u için secrets kurulumundaysen

---

### 5. **INDEX.md** 📖 (ŞU DOSYA)

**Bu belge - tüm dökümanların haritası**

---

## 🚀 Başlangıç Yolculuğu

### İlk Defa Kurulum Yapıyorsan:

```
1. SETUP_SUMMARY.md oku (tüm kurulumu anla)
2. SECRETS_SETUP.md oku (Docker secrets ekle)
3. WORKFLOWS_README.md oku (workflow detayları)
4. CHEAT_SHEET.md bookmark et (hızlı referans için)
```

### Hızlı Bir Şey Hatırlamak İstiyorsan:

```
→ CHEAT_SHEET.md aç
```

### Belirli Bir Workflow Hakkında Bilgi İstiyorsan:

```
→ WORKFLOWS_README.md oku
```

### Docker Push Sorun Yaşıyorsan:

```
1. SECRETS_SETUP.md kontrol et
2. CHEAT_SHEET.md'de "Docker Push Başarısız" bölümüne bak
3. WORKFLOWS_README.md'de docker-build-and-push bölümünü oku
```

---

## 📊 Workflow Özet

### 1. lint-and-format.yml ✨

- **Trigger:** Push/PR → main, staging
- **Amaç:** ESLint + Prettier kontrol
- **Duration:** ~2-3 dakika
- **Başarısız olursa:** PR'ye yorum + workflow fail

### 2. tests.yml 🧪

- **Trigger:** Push/PR → main, staging
- **Amaç:** Jest testleri + coverage
- **Duration:** ~3-5 dakika
- **Artifacts:** Coverage (30 gün)
- **Başarısız olursa:** PR'ye yorum + workflow fail

### 3. docker-build-and-push.yml 🐳

- **Trigger:** Push → main (yalnız)
- **Amaç:** Docker Hub'a imaj yükleme
- **Duration:** ~5-10 dakika
- **Platformlar:** amd64, arm64
- **Başarısız olursa:** Workflow fail (imaj yüklenmez)

---

## 🔑 Gerekli Secrets

| Secret          | Gerekli                  | Nereden               |
| --------------- | ------------------------ | --------------------- |
| DOCKER_USERNAME | Evet (Docker build için) | Docker Hub profili    |
| DOCKER_PASSWORD | Evet (Docker build için) | Docker Hub → Security |

---

## 📁 Dosya Yapısı

```
.github/
├── workflows/
│   ├── lint-and-format.yml      ← ESLint & Prettier
│   ├── tests.yml                ← Jest & Coverage
│   └── docker-build-and-push.yml ← Docker Hub
├── INDEX.md                     ← Şu dosya
├── SETUP_SUMMARY.md             ← Tüm kurulum özeti
├── CHEAT_SHEET.md               ← Hızlı referans
├── WORKFLOWS_README.md          ← Detaylı açıklama
└── SECRETS_SETUP.md             ← Secrets kurulum
```

---

## ✅ Kontrol Listesi

Kurulum tamamladın mı?

- [ ] `.github/workflows/` oluşturuldu
- [ ] 3 workflow dosyası oluşturuldu
- [ ] GitHub Secrets eklendi (DOCKER_USERNAME, DOCKER_PASSWORD)
- [ ] SETUP_SUMMARY.md okundu
- [ ] SECRETS_SETUP.md okundu
- [ ] Local testler çalıştırıldı (`npm test`)
- [ ] Local linting çalıştırıldı (`npm run lint`)
- [ ] Değişiklikler committed ve pushed
- [ ] GitHub Actions dashboard'da workflow'lar izlendi

---

## 🔗 Bağlantılar

- [Main README](../README.md)
- [Permissions Guide](../PERMISSIONS_GUIDE.md)
- [User CRUD Guide](../USER_CRUD_GUIDE.md)
- [Windows Test Fix](../WINDOWS_TEST_FIX.md)

---

## 💡 Hızlı İpuçları

1. **Her zaman local'de test et** - Push etmeden `npm test` çalıştır
2. **GitHub Actions logs'ı kontrol et** - Sorun olursa hemen görürsün
3. **Secrets'ı iki kez kontrol et** - Typo tek sorun kaynağı
4. **PR'lere dikkat et** - Workflow fail olursa merge edemesin
5. **Coverage raporlarını inceле** - Artifacts'dan indir

---

## 🆘 Acil Yardım

### "Workflow çalışmıyor!"

→ SETUP_SUMMARY.md'deki "İlk Çalıştırma Adımları"na bak

### "Docker push başarısız!"

→ SECRETS_SETUP.md'de "Docker Hub Secrets Oluşturma"ya bak

### "Test başarısız!"

→ CHEAT_SHEET.md'de "Test Başarısız" bölümüne bak

### "Ne yapmalıyım?"

→ SETUP_SUMMARY.md'deki "Kontrol Listesi"ne bak

---

## 📞 Destek

1. **Dökümanları oku** - Genellikle tüm cevaplar burada
2. **GitHub Issues aç** - Belirli bir bug varsa
3. **Local'de debug et** - Same command'i çalıştır

---

## 🎯 Sonraki Adımlar

1. ✅ Tüm dökümanları oku
2. ✅ GitHub Secrets ekle
3. ✅ Local testleri çalıştır
4. ✅ Değişiklikleri push et
5. ✅ GitHub Actions dashboard'da izle
6. ✅ Docker Hub'da imajları kontrol et

---

**Başarılar! Happy CI/CD! 🚀**

---

**Oluşturma Tarihi:** 2026-04-10  
**Son Güncelleme:** 2026-04-10  
**Versiyon:** 1.0.0
