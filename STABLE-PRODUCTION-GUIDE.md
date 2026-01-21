# Nexaven Stable Production Deployment Guide

Bu rehber, Nexaven ECU sisteminin tamamen stabil ve production-ready şekilde deploy edilmesi için hazırlanmıştır. Tüm hızlı çözümler kaldırılmış, sadece kalıcı ve güvenilir çözümler kullanılmıştır.

## 🔧 Çözülen Kritik Sorunlar

### 1. Car Data Loading Sorunu ✅
- **Problem**: Car_data JSON dosyaları yüklenemiyor, tüm markalar 0 araç gösteriyor
- **Çözüm**: 
  - Docker Compose'da car_data volume mount eklendi
  - Nginx'de /car_data/ location block eklendi (CORS headers ile)
  - carDataLoader.ts'de gerçek dosya adları kullanılıyor

### 2. Ollama Mixed Content Hatası ✅
- **Problem**: HTTPS sitede HTTP Ollama server'a erişim engelleniyor
- **Çözüm**:
  - CSP header'da hem HTTP hem HTTPS Ollama URL'i eklendi
  - OllamaChat component'inde fallback mekanizması eklendi
  - upgrade-insecure-requests CSP directive eklendi

### 3. Docker Volume Mount Sorunu ✅
- **Problem**: Car_data dizini container'da erişilebilir değil
- **Çözüm**: docker-compose.yml'de volume mount eklendi

### 4. Nginx Konfigürasyon Eksiklikleri ✅
- **Problem**: Car_data endpoint'i serve edilmiyor
- **Çözüm**: Nginx'de özel location block eklendi

## 📁 Dosya Yapısı

```
nexaven-website/
├── car_data/                          # 80+ marka JSON dosyaları
│   ├── BMW/BMW_20260120_190135.json
│   ├── Mercedes/Mercedes_20260120_190124.json
│   └── ... (80+ marka)
├── src/
│   ├── components/
│   │   ├── AITrainingSystem.tsx       # AI ECU training sistemi
│   │   └── OllamaChat.tsx            # Fixed Ollama integration
│   └── utils/
│       └── carDataLoader.ts          # Fixed car data loader
├── nginx/
│   └── nginx.conf                    # Updated from nginx-production-fixed.conf
├── docker-compose.yml               # Updated with car_data volume
├── nginx-production-fixed.conf      # Stable nginx config
└── deploy-stable-production.sh      # Stable deployment script
```

## 🚀 Deployment Adımları

### 1. Ön Gereksinimler
```bash
# Docker ve Docker Compose kurulu olmalı
docker --version
docker-compose --version
```

### 2. Stable Deployment Çalıştırma
```bash
cd nexaven-website
bash deploy-stable-production.sh
```

### 3. Manuel Deployment (Alternatif)
```bash
# 1. Nginx config güncelle
cp nginx-production-fixed.conf nginx/nginx.conf

# 2. Container'ları durdur
docker-compose down --remove-orphans

# 3. Build ve başlat
docker-compose up -d --build

# 4. Durumu kontrol et
docker-compose ps
docker-compose logs -f
```

## 🔍 Sistem Kontrolü

### Car Data Test
```bash
# Car data endpoint testi
curl http://localhost/car_data/BMW/BMW_20260120_190135.json

# Başarılı ise JSON response dönmeli
```

### Ollama Test
```bash
# External Ollama server testi
curl http://72.62.178.51:32768/api/tags

# Başarılı ise model listesi dönmeli
```

### Health Check
```bash
# Sistem health check
curl http://localhost/health

# Response: "OK - Nexaven ECU System"
```

## 🌐 Erişim URL'leri

- **Ana Site**: http://localhost veya https://nexaven.com.tr
- **Zorlu ECU Admin**: http://localhost/zorlu-ecu/admin
- **AI Training**: Admin panel içinde "AI Öğretme" sekmesi
- **Car Data API**: http://localhost/car_data/{brand}/{file}.json

## 🔧 Özellikler

### AI ECU Training System
- ✅ Hex dosya yükleme ve okuma
- ✅ 80+ marka araç veritabanı
- ✅ AI analiz (External Ollama)
- ✅ Stage 1/2/3 modlama
- ✅ Modlanmış dosya indirme
- ✅ Gerçek car_data JSON entegrasyonu

### Ollama Integration
- ✅ External server (http://72.62.178.51:32768)
- ✅ Mixed content çözümü
- ✅ Fallback mekanizması
- ✅ /ecu komutları (analyze, stage1, stage2, stage3, optimize)

### Car Data System
- ✅ 80+ marka JSON dosyaları
- ✅ Otomatik dosya bulma
- ✅ Progresif yükleme
- ✅ Fallback data sistemi
- ✅ Arama ve filtreleme

## 🛡️ Güvenlik

- ✅ Rate limiting (30 req/s genel, 5 req/s admin)
- ✅ CORS headers
- ✅ CSP headers (Ollama mixed content fix)
- ✅ SSL ready (Let's Encrypt)
- ✅ Security headers (HSTS, XSS protection, etc.)

## 📊 Performans

- ✅ Gzip compression
- ✅ Static asset caching (1 year)
- ✅ JSON caching (1 hour)
- ✅ Connection pooling
- ✅ Worker process optimization

## 🔄 Maintenance

### Log Monitoring
```bash
# Tüm logları izle
docker-compose logs -f

# Sadece frontend logları
docker-compose logs -f frontend

# Sadece nginx logları
docker-compose logs -f nginx
```

### Container Yönetimi
```bash
# Container durumu
docker-compose ps

# Yeniden başlat
docker-compose restart

# Güncelleme
docker-compose down
docker-compose up -d --build
```

### Backup
```bash
# Car data backup
tar -czf car_data_backup.tar.gz car_data/

# Database backup (eğer varsa)
docker-compose exec frontend npm run backup
```

## ⚠️ Önemli Notlar

1. **Car Data**: 80+ marka için JSON dosyaları mevcut, otomatik yüklenir
2. **Ollama**: External server kullanılıyor, local kurulum yok
3. **SSL**: Let's Encrypt ile otomatik SSL kurulumu mevcut
4. **Domain**: nexaven.com.tr için optimize edilmiş
5. **Production**: Tamamen production-ready, test dosyaları yok

## 🆘 Sorun Giderme

### Car Data Yüklenmiyor
```bash
# Volume mount kontrolü
docker-compose exec frontend ls -la /app/car_data

# Nginx location test
curl -I http://localhost/car_data/BMW/BMW_20260120_190135.json
```

### Ollama Bağlantı Sorunu
```bash
# External server test
curl http://72.62.178.51:32768/api/tags

# Browser console'da mixed content hatası varsa CSP kontrol et
```

### Container Başlamıyor
```bash
# Detaylı loglar
docker-compose logs frontend
docker-compose logs nginx

# Port kontrolü
netstat -tulpn | grep :80
netstat -tulpn | grep :3000
```

## 📈 Monitoring

### Metrics
- Container health checks
- Nginx access/error logs
- Application performance logs
- Car data loading statistics

### Alerts
- Container down alerts
- High error rate alerts
- Disk space monitoring
- Memory usage monitoring

---

**Bu sistem tamamen stabil ve production-ready'dir. Hızlı çözümler kaldırılmış, sadece kalıcı çözümler kullanılmıştır.**