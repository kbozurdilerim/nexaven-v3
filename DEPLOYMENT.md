# 🚀 Nexaven Website - Production Deployment Guide

Bu rehber Nexaven website'ini Hostinger VPS'e Docker Compose ile deploy etmek için hazırlanmıştır.

## 📋 Ön Koşullar

- Ubuntu 20.04+ VPS
- Root erişimi
- Domain (nexaven.com.tr)
- Minimum 2GB RAM, 20GB disk

## 🔧 VPS Hazırlığı

### 1. VPS'e Bağlanın
```bash
ssh root@your-vps-ip
```

### 2. Sistem Güncellemesi
```bash
apt update && apt upgrade -y
```

### 3. Docker Kurulumu
```bash
# Docker yükle
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker servisini başlat
systemctl start docker
systemctl enable docker

# Docker Compose plugin yükle
apt-get install docker-compose-plugin

# Kurulumu test et
docker --version
docker compose version
```

### 4. Git Kurulumu
```bash
apt install git -y
```

## 📦 Proje Deployment

### 1. Projeyi Klonlayın
```bash
cd /opt
git clone https://github.com/yourusername/nexaven-website.git
cd nexaven-website
```

### 2. Deploy Script'ini Çalıştırın
```bash
chmod +x deploy.sh
./deploy.sh
```

Script otomatik olarak:
- ✅ Docker container'larını build eder
- ✅ Nginx ve frontend servislerini başlatır
- ✅ SSL sertifikası alır (Let's Encrypt)
- ✅ Otomatik SSL yenileme ayarlar
- ✅ Health check yapar

### 3. Domain Ayarları

Hostinger kontrol panelinde A kaydı ekleyin:

```
Tip: A
Host: @
Value: VPS_IP_ADRESINIZ
TTL: 3600

Tip: A
Host: www
Value: VPS_IP_ADRESINIZ
TTL: 3600
```

## 🔍 Kontrol ve Test

### Servis Durumu
```bash
docker compose ps
```

### Logları İzleme
```bash
# Tüm servisler
docker compose logs -f

# Sadece frontend
docker compose logs -f frontend

# Sadece nginx
docker compose logs -f nginx
```

### Website Testi
```bash
# HTTP test
curl -I http://nexaven.com.tr

# HTTPS test (SSL kurulduktan sonra)
curl -I https://nexaven.com.tr
```

## 🛠️ Yönetim Komutları

### Servisleri Yeniden Başlatma
```bash
docker compose restart
```

### Servisleri Durdurma
```bash
docker compose down
```

### Yeni Kod Deploy Etme
```bash
git pull origin main
docker compose build --no-cache
docker compose up -d
```

### SSL Sertifikası Manuel Yenileme
```bash
docker compose run --rm certbot renew
docker compose restart nginx
```

## 📊 Monitoring

### Disk Kullanımı
```bash
df -h
```

### Memory Kullanımı
```bash
free -h
```

### Docker Container Stats
```bash
docker stats
```

### Nginx Access Logs
```bash
docker compose logs nginx | grep "GET"
```

## 🔒 Güvenlik

### Firewall Ayarları
```bash
# UFW yükle ve aktifleştir
apt install ufw -y
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw enable
```

### Fail2Ban (Opsiyonel)
```bash
apt install fail2ban -y
systemctl enable fail2ban
systemctl start fail2ban
```

## 🚨 Sorun Giderme

### Container Çalışmıyor
```bash
# Container durumunu kontrol et
docker compose ps

# Logları kontrol et
docker compose logs [service-name]

# Container'ı yeniden başlat
docker compose restart [service-name]
```

### SSL Sorunu
```bash
# Certbot loglarını kontrol et
docker compose logs certbot

# SSL dosyalarını kontrol et
ls -la nginx/ssl/

# Nginx konfigürasyonunu test et
docker compose exec nginx nginx -t
```

### Build Hatası
```bash
# Cache'i temizle
docker system prune -a

# Yeniden build et
docker compose build --no-cache
```

## 📈 Performance Optimizasyonu

### Nginx Cache Ayarları
Nginx konfigürasyonunda cache ayarları zaten yapılandırılmış:
- Static dosyalar 1 yıl cache
- Gzip compression aktif
- Rate limiting aktif

### Docker Resource Limits
Gerekirse docker-compose.yml'de resource limits ekleyin:

```yaml
services:
  frontend:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

## 🔄 Backup Stratejisi

### Manuel Backup
```bash
# Tüm projeyi yedekle
tar -czf nexaven-backup-$(date +%Y%m%d).tar.gz /opt/nexaven-website

# Sadece önemli dosyaları yedekle
tar -czf nexaven-config-$(date +%Y%m%d).tar.gz nginx/ssl/ .env
```

### Otomatik Backup (Crontab)
```bash
# Crontab düzenle
crontab -e

# Her gece 2'de backup al
0 2 * * * tar -czf /backups/nexaven-$(date +\%Y\%m\%d).tar.gz /opt/nexaven-website
```

## 📞 Destek

### Loglar
- Frontend: `docker compose logs frontend`
- Nginx: `docker compose logs nginx`
- Certbot: `docker compose logs certbot`

### Önemli Dosyalar
- `docker-compose.yml` - Servis konfigürasyonu
- `nginx/nginx.conf` - Web sunucu ayarları
- `Dockerfile.frontend` - Frontend build ayarları
- `.env` - Environment variables

### Hızlı Komutlar
```bash
# Sistem durumu
docker compose ps && docker stats --no-stream

# Disk temizliği
docker system prune -f

# Yeniden deploy
git pull && docker compose up -d --build
```

---

## ✅ Deployment Checklist

- [ ] VPS hazır ve erişilebilir
- [ ] Docker ve Docker Compose yüklü
- [ ] Domain A kaydı yapılandırılmış
- [ ] Proje klonlanmış
- [ ] Deploy script çalıştırılmış
- [ ] SSL sertifikası alınmış
- [ ] Website erişilebilir (HTTP/HTTPS)
- [ ] Admin panelleri çalışıyor
- [ ] Firewall yapılandırılmış
- [ ] Monitoring kurulmuş

**🎉 Deployment tamamlandı! Website https://nexaven.com.tr adresinde yayında!**