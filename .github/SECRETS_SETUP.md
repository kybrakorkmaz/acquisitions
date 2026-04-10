# 🔐 GitHub Secrets Kurulum Rehberi

Bu rehber, GitHub Actions workflow'larının çalışabilmesi için gerekli olan secrets'ı nasıl ayarlayacağınızı anlatmaktadır.

## 📋 İhtiyaç Duyulan Secrets

### Docker Build and Push Workflow için:
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD` (veya PAT)

---

## 🛠️ Adım Adım Kurulum

### Adım 1: Docker Hub Hesabı Oluşturun
1. https://hub.docker.com adresine gidin
2. Eğer hesabınız yoksa "Sign Up" seçeneğinden hesap oluşturun
3. Hesabınıza giriş yapın

### Adım 2: Personal Access Token (PAT) Oluşturun

#### Docker Hub'da PAT Oluşturma:
1. Docker Hub dashboard'unuzda
2. Sağ üstte profile icon → **Account Settings**
3. Sol menüden **Security** seçin
4. **New Access Token** butonuna tıklayın
5. Token'a açıklayıcı bir ad verin (örn: `github-actions`)
6. Permissions seçin:
   - ✅ Read, Write (en azından)
7. **Generate** butonuna tıklayın
8. Token'ı güvenli bir yerde kopyalayın (sonra göremeyeceksiniz!)

### Adım 3: GitHub Repository'ye Secrets Ekleyin

#### Secrets Ekleme Yöntemi 1: GitHub Web UI
1. GitHub repository'nize gidin
2. **Settings** sekmesine tıklayın
3. Sol menüden **Secrets and variables** → **Actions** seçin
4. **New repository secret** butonuna tıklayın

#### Secret 1: DOCKER_USERNAME
- **Name:** `DOCKER_USERNAME`
- **Value:** Docker Hub kullanıcı adınız (örn: `john_doe`)
- **Add secret** butonuna tıklayın

#### Secret 2: DOCKER_PASSWORD
- **Name:** `DOCKER_PASSWORD`
- **Value:** Oluşturduğunuz Personal Access Token
- **Add secret** butonuna tıklayın

#### Secrets Ekleme Yöntemi 2: GitHub CLI
```bash
# Eğer GitHub CLI yüklüyse:
gh secret set DOCKER_USERNAME -b "your-docker-username"
gh secret set DOCKER_PASSWORD -b "your-docker-pat"
```

### Adım 4: Secrets'ı Doğrulayın
1. **Settings** → **Secrets and variables** → **Actions**
2. Oluşturduğunuz secrets'ı listede göreceksiniz
3. Her secret'in adı görülür ama değeri gizlidir (güvenlik için)

---

## ✅ Kurulum Kontrolü

Secrets başarıyla ayarlanmış mı kontrol etmek için:

1. GitHub repository'nize gidin
2. **Actions** sekmesine tıklayın
3. Docker Build and Push workflow'una tıklayın
4. **Workflow runs** bölümünde en son çalışmayı açın
5. Eğer log'larda `Login Succeeded` yazıyorsa, secrets doğru ayarlanmıştır

---

## 🔒 Güvenlik Önerileri

### 1. Personal Access Token Yerine SSH Anahtarı
Daha güvenli için SSH anahtarı kullanabilirsiniz, ancak bu proje için PAT yeterlidir.

### 2. Token Güvenliği
- ❌ Token'ı git history'ye commit etmeyin
- ❌ Token'ı pull request'lerde açıklamayın
- ✅ GitHub Secrets kullanın
- ✅ Düzenli olarak token'ları rotate edin

### 3. Secrets Görünürlüğü
- Repository Private olsa dahi, secrets yalnızca workflow runner'ında erişilebilir
- GitHub'ın bulut sunucularında güvenli olarak saklanır
- Logs'ta secrets maskeli gösterilir

### 4. Token Iptali
Eğer token'ı yanlışlıkla açıkça birisi görmüşse:
1. Docker Hub Dashboard → Account Settings → Security
2. İlgili token'ın yanındaki delete butonuna tıklayın
3. Yeni bir token oluşturun
4. GitHub Secrets'ı güncelleyin

---

## 📋 Checklist

GitHub Secrets kurulumundan önce tüm kontrol listesini işaretleyin:

- [ ] Docker Hub hesabı oluşturdum
- [ ] Personal Access Token oluşturdum
- [ ] Token'ı güvenli bir yerde kopyaladım
- [ ] GitHub repository'min Settings'ine erişim sağladım
- [ ] DOCKER_USERNAME secret'ini ekledim
- [ ] DOCKER_PASSWORD secret'ini ekledim
- [ ] Secrets'ı doğruladım

---

## 🆘 Sorun Giderme

### Problem: Docker Login Failed
```
Error: Error saving credentials: error storing credentials...
```
**Çözüm:** 
- DOCKER_USERNAME ve DOCKER_PASSWORD'ün doğru olduğundan emin olun
- Token'ın geçerli olup olmadığını kontrol edin (süresi dolmamış mı)

### Problem: Permission Denied
```
Error: permission denied while trying to connect to the Docker daemon
```
**Çözüm:** 
- Workflow'un permissions ayarları kontrol edin
- Docker Hub hesabının push yetkisi olduğundan emin olun

### Problem: Secret'i Değiştirdim Ama Hala Hata Alıyorum
**Çözüm:** 
- GitHub secret'lerinin değiştirilmesi biraz zaman alabilir
- 2-3 dakika bekleyin
- Yeni bir workflow run'ı başlatın

### Problem: Token'ı Unuttum
**Çözüm:** 
- Token'ı kurtaramazsınız (docker hub yeni token göstermez)
- Yeni bir token oluşturun:
  1. Docker Hub → Account Settings → Security
  2. "New Access Token" butonuna tıklayın
  3. GitHub Secrets'ı güncelleyin

---

## 📚 Ek Kaynaklar

- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Actions Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

---

## 🎯 Workflow'lar Başarıyla Çalışacak mı?

Secrets doğru ayarlandıktan sonra:

✅ **lint-and-format.yml** - Hiçbir secret gerekmez, otomatik çalışır
✅ **tests.yml** - Hiçbir secret gerekmez, otomatik çalışır
✅ **docker-build-and-push.yml** - Secrets gerekli, kurulduktan sonra çalışır

---

**Not:** Tüm secrets doğru ayarlandıktan sonra, `main` branch'e push yapıp workflow'ların başarıyla çalışması için bekleyin!

