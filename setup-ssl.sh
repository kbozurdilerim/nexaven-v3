#!/bin/bash

# SSL Sertifikası Kurulum Script'i - External Ollama ECU System
set -e

echo "🔒 SSL Sertifikası Kurulumu - Nexaven ECU"
echo "========================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 1. Önce HTTP-only nginx ile başlat
log_info "HTTP-only nginx konfigürasyonu ile başlatıyoruz..."

# Geçici HTTP-only config kullan
cp nginx/nginx.conf nginx/nginx.conf.ssl-backup
cp nginx-http-only.conf nginx/nginx.conf

# Servisleri başlat
docker compose up -d frontend nginx

# 2. Siteinin çalıştığını kontrol et
log_info "Sitenin çalışmasını bekliyoruz..."
sleep 20

# 3. HTTP erişimini test et
log_info "HTTP erişimi test ediliyor..."
for i in {1..5}; do
    if curl -f http://nexaven.com.tr/health > /dev/null 2>&1; then
        log_success "✅ Site HTTP ile erişilebilir"
        break
    else
        log_warning "Deneme $i/5: Site henüz hazır değil, bekliyoruz..."
        sleep 10
    fi
    
    if [ $i -eq 5 ]; then
        log_error "❌ Site HTTP ile erişilemiyor. DNS ayarlarını kontrol edin."
        log_error "Manuel test: curl -I http://nexaven.com.tr"
        exit 1
    fi
done

# 4. SSL sertifikası al
log_info "SSL sertifikası alınıyor..."
log_info "Domain: nexaven.com.tr, www.nexaven.com.tr"

# Certbot ile sertifika al
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/html \
    --email admin@nexaven.com.tr \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d nexaven.com.tr \
    -d www.nexaven.com.tr

# 5. Sertifika alındığını kontrol et
log_info "SSL sertifikası kontrol ediliyor..."
if docker run --rm -v nexaven-v3_certbot-etc:/etc/letsencrypt alpine test -f /etc/letsencrypt/live/nexaven.com.tr/fullchain.pem; then
    log_success "✅ SSL sertifikası başarıyla alındı"
else
    log_error "❌ SSL sertifikası alınamadı"
    log_error "Certbot loglarını kontrol edin: docker compose logs certbot"
    exit 1
fi

# 6. SSL konfigürasyonunu geri yükle
log_info "SSL konfigürasyonu aktifleştiriliyor..."
cp nginx/nginx.conf.ssl-backup nginx/nginx.conf

# 7. Nginx'i SSL ile yeniden başlat
log_info "Nginx SSL ile yeniden başlatılıyor..."
docker compose restart nginx

# 8. HTTPS erişimini test et
log_info "HTTPS erişimi test ediliyor..."
sleep 15

for i in {1..3}; do
    if curl -f https://nexaven.com.tr/health > /dev/null 2>&1; then
        log_success "✅ Site HTTPS ile erişilebilir"
        break
    else
        log_warning "HTTPS deneme $i/3, bekliyoruz..."
        sleep 10
    fi
    
    if [ $i -eq 3 ]; then
        log_warning "⚠️ HTTPS erişimi henüz çalışmıyor"
        log_info "Manuel test: curl -I https://nexaven.com.tr"
        log_info "Nginx logları: docker logs nexaven-nginx"
    fi
done

# 9. SSL sertifikası bilgilerini göster
log_info "SSL sertifikası bilgileri:"
docker run --rm -v nexaven-v3_certbot-etc:/etc/letsencrypt alpine \
    openssl x509 -in /etc/letsencrypt/live/nexaven.com.tr/fullchain.pem -text -noout | \
    grep -E "(Subject:|Issuer:|Not Before:|Not After:)" || true

# 10. Otomatik yenileme için cron job ekle
log_info "Otomatik SSL yenileme ayarlanıyor..."
CRON_JOB="0 3 * * * cd $(pwd) && docker compose run --rm certbot renew --quiet && docker compose restart nginx"
(crontab -l 2>/dev/null | grep -v "certbot renew"; echo "$CRON_JOB") | crontab -

echo ""
log_success "🎉 SSL kurulumu tamamlandı!"
log_success "🌐 Siteniz artık HTTPS ile erişilebilir:"
log_success "   • https://nexaven.com.tr"
log_success "   • https://www.nexaven.com.tr"
log_success "   • https://nexaven.com.tr/zorlu-ecu-admin"
log_info "📅 SSL sertifikası her gece saat 03:00'da otomatik olarak yenilenecek"
log_info "🤖 AI ECU Tuning: Admin panelinde 'AI ECU Tuning' sekmesi"