# Nexaven.com.tr Production Deployment Guide

## 🚀 Sağlam Production Setup

Bu rehber Nexaven ECU tuning sisteminin production ortamında güvenli ve sağlam bir şekilde çalıştırılması için hazırlanmıştır.

## 📋 Sistem Özellikleri

### ✅ Tamamlanan Özellikler
- **Frontend-only Architecture**: React tabanlı modern web uygulaması
- **External Ollama AI**: `http://72.62.178.51:32768` adresindeki AI servisi
- **Domain Support**: `nexaven.com.tr` ve `www.nexaven.com.tr`
- **Robust Nginx**: Production-ready güvenlik ve performans ayarları
- **Real Customer System**: Test verileri kaldırıldı, gerçek müşteri sistemi
- **AI ECU Tuning**: Yapay zeka destekli ECU analiz ve tuning sistemi

### 🔧 AI ECU Komutları
- `/ecu analyze <file>` - ECU dosyası analizi
- `/ecu stage1 <file>` - Stage 1 tuning (Force Yazılım 1)
- `/ecu stage2 <file>` - Stage 2 tuning (Force Yazılım 2)  
- `/ecu stage3 <file>` - Stage 3 tuning (Force Yazılım 3)
- `/ecu optimize <file>` - Optimizasyon önerileri

## 🚀 Deployment Seçenekleri

### 1. Hızlı Deployment (Önerilen)
```bash
chmod +x quick-deploy.sh
./quick-deploy.sh
```

### 2. Sağlam Production Deployment
```bash
chmod +x deploy-robust.sh
./deploy-robust.sh
```

### 3. SSL Kurulumu (Opsiyonel)
```bash
chmod +x setup-ssl.sh
./setup-ssl.sh
```

## 🌐 Erişim URL'leri

- **Ana Site**: http://nexaven.com.tr
- **Admin Panel**: http://nexaven.com.tr/admin
- **Zorlu ECU Admin**: http://nexaven.com.tr/zorlu-ecu-admin
- **Health Check**: http://nexaven.com.tr/health
- **AI Chat**: Admin panelinde AI ECU Tuning sekmesi

## 👤 Giriş Bilgileri

### Nexaven Admin
- **Email**: admin@nexaven.com
- **Password**: admin123

### Zorlu ECU Admin  
- **Email**: admin@zorluecu.com
- **Password**: zorlu123

## 🔧 Nginx Konfigürasyonu

### Güvenlik Özellikleri
- **Rate Limiting**: DDoS koruması
- **Security Headers**: XSS, CSRF koruması
- **SSL Ready**: Let's Encrypt desteği
- **Attack Protection**: Yaygın saldırı türlerine karşı koruma

### Performance Özellikleri
- **Gzip Compression**: Hızlı yükleme
- **Static Caching**: Agresif önbellekleme
- **Keep-Alive**: Bağlantı optimizasyonu
- **Buffer Optimization**: Bellek kullanımı optimizasyonu

## 📊 Monitoring ve Troubleshooting

### Container Durumu
```bash
docker ps
docker logs nexaven-frontend
docker logs nexaven-nginx
```

### Health Check
```bash
curl http://nexaven.com.tr/health
curl http://localhost/health
```

### Restart Services
```bash
docker compose restart
docker compose up -d --force-recreate
```

## 🔒 Güvenlik Notları

1. **Firewall**: Port 80 ve 443 açık olmalı
2. **DNS**: A record nexaven.com.tr -> server IP
3. **SSL**: Production için SSL sertifikası önerilen
4. **Backup**: Düzenli veri yedekleme yapın
5. **Updates**: Docker image'ları düzenli güncelleyin

## 🚨 Sorun Giderme

### Site Açılmıyor
```bash
# Container durumunu kontrol et
docker ps

# Nginx loglarını kontrol et  
docker logs nexaven-nginx --tail 20

# Frontend loglarını kontrol et
docker logs nexaven-frontend --tail 20

# Yeniden başlat
./quick-deploy.sh
```

### Domain Çalışmıyor
```bash
# DNS kontrolü
nslookup nexaven.com.tr

# Port kontrolü
netstat -tlnp | grep :80
netstat -tlnp | grep :443

# Firewall kontrolü
ufw status
```

### AI Çalışmıyor
```bash
# External Ollama test
curl http://72.62.178.51:32768/api/tags

# Frontend AI bağlantısı test
curl http://localhost/api/ai/test
```

## 📈 Performance Monitoring

### Resource Usage
```bash
docker stats
df -h
free -h
```

### Nginx Stats
```bash
curl http://localhost/nginx-status
```

### Application Metrics
- Response time monitoring
- Error rate tracking  
- User activity logs

## 🔄 Backup Strategy

### Database Backup
```bash
# User data backup
docker exec nexaven-frontend npm run backup

# Configuration backup
tar -czf backup-$(date +%Y%m%d).tar.gz nginx/ src/ package.json
```

### Restore Process
```bash
# Restore from backup
tar -xzf backup-YYYYMMDD.tar.gz
./deploy-robust.sh
```

## 📞 Support

Teknik destek için:
- **Email**: admin@nexaven.com.tr
- **System**: Zorlu ECU Admin Panel
- **Logs**: `/var/log/nginx/` ve Docker logs

---

**Son Güncelleme**: 21 Ocak 2025
**Versiyon**: Production v3.0
**Status**: ✅ Aktif ve Çalışır Durumda