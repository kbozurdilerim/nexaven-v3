# Nexaven Premium Website

Modern, responsive ve animasyonlu kurumsal web sitesi. React, TypeScript, Tailwind CSS ve Framer Motion ile geliştirilmiştir.

## 🚀 Özellikler

### 3 Ana Hizmet Platformu:
- **🏎️ Nexaven Assetto Corsa Server** - Oyun sunucusu ve lisans yönetimi
- **⚡ Zorlu ECU** - ECU tuning ve araç performans hizmetleri  
- **🏆 Ahmet Kanar NXD Premium** - Premium tasarım ve geliştirme hizmetleri

### Teknik Özellikler:
- ✅ React 18 + TypeScript
- ✅ Tailwind CSS + Framer Motion animasyonlar
- ✅ TSParticles efektleri
- ✅ Responsive tasarım (Mobil/Tablet/Desktop)
- ✅ Dark mode tema
- ✅ Admin/Slave/Technician panelleri
- ✅ Araç sorgulaması ve borç takibi
- ✅ Lisans yönetim sistemi
- ✅ Dosya yükleme/indirme
- ✅ Mesajlaşma sistemi
- ✅ Docker Compose desteği
- ✅ SSL/HTTPS hazır

## 📦 Kurulum

### Lokal Geliştirme

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Build'i önizle
npm run preview
```

### Docker ile Çalıştırma

```bash
# Docker Compose ile başlat
docker-compose up -d

# Logları izle
docker-compose logs -f

# Durdur
docker-compose down
```

## 🌐 VPS Deployment (Hostinger)

### 1. VPS'e Bağlan
```bash
ssh root@your-vps-ip
```

### 2. Docker Kurulumu
```bash
# Docker yükle
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker Compose yükle
apt-get install docker-compose-plugin
```

### 3. Projeyi Deploy Et
```bash
# GitHub'dan klonla
git clone https://github.com/yourusername/nexaven-website.git
cd nexaven-website

# Deploy script'ini çalıştır
chmod +x deploy.sh
./deploy.sh
```

### 4. Domain Ayarları
Hostinger'da A kaydı ekleyin:
```
Tip: A
Host: @
Value: VPS_IP_ADRESINIZ

Tip: A  
Host: www
Value: VPS_IP_ADRESINIZ
```

## 🔐 Admin Hesapları

### Nexaven Core Admin
- **Email:** admin@nexaven.com
- **Şifre:** admin123

### Zorlu ECU Admin  
- **Email:** admin@zorluecu.com
- **Şifre:** admin123

### Teknisyen Girişi
- **Kod:** technician123

## 📱 Sayfalar ve Özellikler

### Ana Sayfa (/)
- 3 hizmet sekmesi
- Animasyonlu geçişler
- Sparkles efektleri

### Hizmet Keşif Sayfaları (/:service/kesfet)
- Hizmet detayları
- Giriş formu
- Admin/Slave/Technician seçenekleri

### Admin Panelleri
- **Nexaven Core:** Lisans yönetimi, kullanıcı takibi, gelir raporları
- **Zorlu ECU:** Müşteri yönetimi, sipariş takibi, dosya yönetimi, chat sistemi

### Araç Sorgulaması (/araç-sorgusu)
- Firma bazlı araç arama
- Borç takibi
- Ödeme durumu görüntüleme

## 🛠️ Geliştirme

### Proje Yapısı
```
src/
├── components/          # Yeniden kullanılabilir bileşenler
│   └── ui/             # UI bileşenleri (sparkles, glitchy-404)
├── pages/              # Sayfa bileşenleri
├── sections/           # Ana sayfa bölümleri
├── lib/                # Yardımcı fonksiyonlar
└── utils/              # Test verileri ve yardımcılar
```

### Yeni Özellik Ekleme
1. `src/pages/` altında yeni sayfa oluştur
2. `src/App.tsx`'e route ekle
3. Gerekirse `src/components/ui/` altında UI bileşeni ekle

### Animasyon Ekleme
Framer Motion kullanarak:
```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  İçerik
</motion.div>
```

## 🔧 Yapılandırma

### Environment Variables (.env)
```
NODE_ENV=production
VITE_APP_NAME=Nexaven
VITE_APP_VERSION=3.0.0
```

### Tailwind Konfigürasyonu
`tailwind.config.js` dosyasında özel renkler ve animasyonlar tanımlı.

### Docker Konfigürasyonu
- `Dockerfile.frontend`: React uygulaması için
- `docker-compose.yml`: Nginx + SSL ile production setup
- `nginx/nginx.conf`: Reverse proxy ve SSL konfigürasyonu

## 📊 Performans

- **Build Size:** ~2MB (gzipped)
- **First Load:** ~3 saniye
- **Lighthouse Score:** 90+
- **Mobile Responsive:** ✅
- **SEO Optimized:** ✅

## 🔒 Güvenlik

- HTTPS/SSL zorunlu
- Rate limiting aktif
- XSS koruması
- CSRF koruması
- Secure headers

## 📞 Destek

- **Website:** https://nexaven.com.tr
- **Email:** admin@nexaven.com.tr
- **GitHub:** https://github.com/yourusername/nexaven-website

## 📄 Lisans

© 2026 Nexaven. Tüm hakları saklıdır.

---

**Production Ready** ✅ | **Docker Support** ✅ | **SSL Ready** ✅