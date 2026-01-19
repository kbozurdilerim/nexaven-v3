# Force Yazılım - Chiptuning Calculator

🚗 **Professional ECU Chiptuning Calculator with Dark Theme & Advanced Animations**

Modern, responsive web uygulaması ile araç performans hesaplamaları ve Force yazılım seçenekleri.

## ✨ Özellikler

### 🎨 Modern Tasarım
- **Dark Theme**: Profesyonel koyu tema
- **Force Branding**: Özel marka kimliği
- **Responsive Design**: Tüm cihazlarda uyumlu
- **Advanced Animations**: Matrix rain, glitch effects, sparkles, neon glows

### 🔧 Teknik Özellikler
- **30+ Araç Modeli**: BMW'den Bugatti'ye kadar
- **3 Stage Tuning**: Stage 1, 2, 3 seçenekleri
- **Real-time Search**: Anlık arama ve filtreleme
- **Performance Calculator**: Güç ve tork hesaplamaları
- **Price Estimator**: Detaylı fiyat hesaplaması

### 🌟 Animasyonlar
- **Matrix Rain Effect**: Arka plan matrix animasyonu
- **Glitch Effects**: Başlık ve logo glitch efektleri
- **Sparkles**: Dinamik parıldama efektleri
- **Neon Glows**: Neon ışık efektleri
- **Hover Animations**: Kart hover animasyonları
- **Typing Animation**: Yazı makinesi efekti

## 🚀 Kurulum

### Docker ile Çalıştırma
```bash
# Repository'yi klonlayın
git clone https://github.com/force-yazilim/chiptuning-calculator
cd chiptuning-calculator/chiptuning-app

# Docker Compose ile başlatın
docker-compose up -d

# Uygulamaya erişin
http://localhost:3000
```

### Manuel Kurulum
```bash
# Bağımlılıkları yükleyin
npm install

# Uygulamayı başlatın
npm start

# Geliştirme modu
npm run dev
```

## 📊 Veritabanı

### Desteklenen Markalar

#### Mainstream Brands
- **BMW**: 320i, 330i, M3, M5
- **Mercedes-Benz**: C200, C63 AMG, E63 AMG
- **Audi**: A4 TFSI, RS6, R8
- **Volkswagen**: Golf GTI, Golf R, Arteon

#### Premium Brands
- **Porsche**: 911 Turbo S, Cayenne Turbo
- **Jaguar**: F-Type R, XE SV Project 8
- **Maserati**: Levante Trofeo, Ghibli
- **Bentley**: Continental GT, Bentayga

#### Supercar/Hypercar
- **Lamborghini**: Huracán EVO, Aventador
- **McLaren**: 720S, 765LT
- **Ferrari**: F8 Tributo, SF90 Stradale
- **Bugatti**: Chiron, Veyron
- **Koenigsegg**: Jesko, Regera
- **Pagani**: Huayra BC, Zonda

#### Electric Vehicles
- **Tesla**: Model S Plaid, Model 3 Performance
- **BYD**: Tang EV, Han EV
- **NIO**: ET7, ES8

#### Performance Brands
- **Subaru**: WRX STI, Forester XT
- **Mitsubishi**: Lancer EVO X
- **Honda**: Civic Type R, NSX
- **Nissan**: GT-R R35, 370Z Nismo

### Force Yazılım Seviyeleri

#### Stage 1 - Software Only
- 💻 Sadece ECU yazılım güncellemesi
- 📈 %15-25 güç artışı
- ⛽ Yakıt ekonomisi iyileştirmesi
- 🔧 Ek donanım gerektirmez
- 💰 6.500 - 60.000 TL

#### Stage 2 - Software + Basic Mods
- 💻 ECU yazılım + temel modifikasyonlar
- 📈 %25-40 güç artışı
- 🔧 Downpipe, intercooler, intake
- ⚡ Orta seviye performans artışı
- 💰 12.000 - 120.000 TL

#### Stage 3 - Full Build
- 💻 Kapsamlı modifikasyonlar
- 📈 %40-60+ güç artışı
- 🔧 Turbo upgrade, fuel system, internals
- 🏁 Maksimum performans
- 💰 22.000 - 250.000 TL

## 🛠️ API Endpoints

### Vehicles
```bash
GET /api/brands              # Tüm markalar
GET /api/models/:brand       # Marka modelları
GET /api/vehicle/:id         # Araç detayları
GET /api/search?q=query      # Araç arama
```

### Statistics
```bash
GET /api/stats               # Veritabanı istatistikleri
GET /api/export/csv          # CSV export
POST /api/calculate          # Fiyat hesaplama
```

### Health Check
```bash
GET /health                  # Sistem durumu
```

## 🎯 Kullanım

1. **Araç Seçimi**: Marka ve model seçin veya arama yapın
2. **Stage Seçimi**: Force yazılım seviyesini belirleyin
3. **Hesaplama**: Performans artışı ve fiyat görün
4. **Teklif**: Force teklif alın

## 🔒 Güvenlik

- **Helmet.js**: HTTP header güvenliği
- **CORS**: Cross-origin resource sharing
- **Compression**: Gzip sıkıştırma
- **Input Validation**: Girdi doğrulama

## 📱 Responsive Design

- **Mobile First**: Mobil öncelikli tasarım
- **Tablet Support**: Tablet uyumluluğu
- **Desktop Optimized**: Masaüstü optimizasyonu
- **Touch Friendly**: Dokunmatik uyumlu

## 🎨 Tema Özellikleri

### Dark Theme Colors
- **Primary**: #667eea (Purple-Blue)
- **Secondary**: #764ba2 (Purple)
- **Accent**: #f093fb (Pink)
- **Background**: #0f0f23 (Dark Blue)
- **Surface**: #1a1a2e (Dark Purple)

### Animations
- **Matrix Rain**: Arka plan matrix efekti
- **Glitch Text**: Başlık glitch animasyonu
- **Sparkles**: Dinamik parıldama
- **Neon Glow**: Neon ışık efektleri
- **Card Hover**: Kart hover animasyonları

## 📈 Performans

- **Fast Loading**: Hızlı yükleme
- **Optimized Images**: Optimize edilmiş görseller
- **Minified Assets**: Sıkıştırılmış dosyalar
- **Caching**: Önbellekleme
- **CDN Ready**: CDN desteği

## 🌐 Deployment

### Production Build
```bash
# Production modunda çalıştır
NODE_ENV=production npm start

# Docker production build
docker build -t force-yazilim-chiptuning .
docker run -p 3000:3000 force-yazilim-chiptuning
```

### Environment Variables
```bash
PORT=3000                    # Server port
NODE_ENV=production          # Environment
```

## 📞 İletişim

- **Website**: https://nexaven.com.tr
- **Email**: info@zorluecu.com
- **Phone**: +90 532 111 22 33
- **GitHub**: https://github.com/force-yazilim

## 📄 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

**Force Yazılım © 2026 - Zorlu ECU Chiptuning Solutions**

*Professional chiptuning solutions with cutting-edge technology*