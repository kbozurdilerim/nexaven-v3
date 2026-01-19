# 🔒 SSL Sertifikası Kurulum Rehberi

Bu rehber nexaven.com.tr için ücretsiz SSL sertifikası kurulumunu açıklar.

## 📋 Ön Koşullar

1. ✅ Domain DNS ayarları yapılmış olmalı
2. ✅ VPS'te Docker ve Docker Compose kurulu olmalı
3. ✅ Port 80 ve 443 açık olmalı

## 🌐 DNS Ayarları

Hostinger DNS panelinden şu kayıtları ekleyin:

```
A Record: nexaven.com.tr -> VPS_IP_ADDRESS
A Record: www.nexaven.com.tr -> VPS_IP_ADDRESS
```

## 🚀 Adım Adım SSL Kurulumu

### 1. Projeyi Hazırlayın
```bash
cd nexaven-v3/nexaven-website
```

### 2. Önce HTTP ile Başlatın
```bash
# HTTP-only nginx config kullan
cp nginx/nginx-http.conf nginx/nginx.conf

# Siteyi başlat
docker compose up -d
```

### 3. HTTP Erişimini Test Edin
```bash
curl http://nexaven.com.tr
```

### 4. SSL Kurulum Script'ini Çalıştırın
```bash
chmod +x setup-ssl.sh
./setup-ssl.sh
```

## 🔧 Manuel SSL Kurulumu

Eğer script çalışmazsa manuel olarak:

### 1. SSL Sertifikası Alın
```bash
# Certbot çalıştır
docker compose run --rm certbot

# Sertifika kontrolü
docker exec nexaven-nginx ls -la /etc/letsencrypt/live/nexaven.com.tr/
```

### 2. Nginx Konfigürasyonunu Güncelleyin
```bash
# SSL satırlarını aktif et
sed -i 's/# ssl_certificate/ssl_certificate/g' nginx/nginx.conf

# Nginx'i yeniden başlat
docker restart nexaven-nginx
```

### 3. HTTPS Erişimini Test Edin
```bash
curl https://nexaven.com.tr
```

## 🔄 SSL Otomatik Yenileme

### Cron Job Ekleyin
```bash
# Crontab'ı düzenle
crontab -e

# Şu satırı ekle (her gün saat 12:00'da yenile)
0 12 * * * cd /root/nexaven-v3/nexaven-website && docker compose run --rm certbot renew && docker restart nexaven-nginx
```

### Manuel Yenileme
```bash
docker compose run --rm certbot renew
docker restart nexaven-nginx
```

## 🛠️ Troubleshooting

### SSL Sertifikası Alınamıyor
```bash
# DNS propagation kontrol et
nslookup nexaven.com.tr

# Port 80 açık mı kontrol et
netstat -tlnp | grep :80

# Nginx loglarını kontrol et
docker logs nexaven-nginx
```

### HTTPS Çalışmıyor
```bash
# SSL dosyaları var mı kontrol et
docker exec nexaven-nginx ls -la /etc/letsencrypt/live/nexaven.com.tr/

# Nginx konfigürasyonunu test et
docker exec nexaven-nginx nginx -t

# SSL sertifikası bilgilerini kontrol et
openssl s_client -connect nexaven.com.tr:443 -servername nexaven.com.tr
```

### Rate Limit Hatası
```bash
# Let's Encrypt rate limit'e takıldıysanız staging kullanın
docker compose run --rm certbot certonly --webroot --webroot-path=/var/www/html --email admin@nexaven.com.tr --agree-tos --no-eff-email --staging -d nexaven.com.tr -d www.nexaven.com.tr
```

## 📊 SSL Durumu Kontrol

### Sertifika Bilgileri
```bash
# Sertifika detayları
docker exec nexaven-nginx openssl x509 -in /etc/letsencrypt/live/nexaven.com.tr/fullchain.pem -text -noout

# Sona erme tarihi
docker exec nexaven-nginx openssl x509 -in /etc/letsencrypt/live/nexaven.com.tr/fullchain.pem -noout -dates
```

### Online SSL Test
- https://www.ssllabs.com/ssltest/analyze.html?d=nexaven.com.tr

## 🎯 Sonuç

SSL kurulumu tamamlandıktan sonra:

✅ **HTTP** → **HTTPS** otomatik yönlendirme  
✅ **A+ SSL Rating** (SSLLabs)  
✅ **90 günlük** ücretsiz sertifika  
✅ **Otomatik yenileme** her gün  
✅ **www** ve **non-www** desteği  

## 📞 Destek

Sorun yaşarsanız:
1. DNS ayarlarını kontrol edin
2. Port 80/443'ün açık olduğunu kontrol edin  
3. Docker loglarını kontrol edin
4. Let's Encrypt rate limit'lerini kontrol edin