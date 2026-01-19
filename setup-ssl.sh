#!/bin/bash

# SSL Sertifikası Kurulum Script'i
set -e

echo "🔒 SSL Sertifikası Kurulumu"
echo "=========================="

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

# 1. Önce HTTP ile siteyi başlat
log_info "HTTP ile siteyi başlatıyoruz..."
docker compose up -d

# 2. Siteinin çalıştığını kontrol et
log_info "Sitenin çalışmasını bekliyoruz..."
sleep 30

# 3. HTTP erişimini test et
if curl -f http://nexaven.com.tr > /dev/null 2>&1; then
    log_success "✅ Site HTTP ile erişilebilir"
else
    log_error "❌ Site HTTP ile erişilemiyor. DNS ayarlarını kontrol edin."
    exit 1
fi

# 4. SSL sertifikası al
log_info "SSL sertifikası alınıyor..."
docker compose run --rm certbot

# 5. Sertifika alındığını kontrol et
if docker exec nexaven-nginx test -f /etc/letsencrypt/live/nexaven.com.tr/fullchain.pem; then
    log_success "✅ SSL sertifikası başarıyla alındı"
else
    log_error "❌ SSL sertifikası alınamadı"
    exit 1
fi

# 6. Nginx konfigürasyonunu SSL için güncelle
log_info "Nginx konfigürasyonu SSL için güncelleniyor..."

# SSL satırlarını aktif et
sed -i 's/# ssl_certificate/ssl_certificate/g' nginx/nginx.conf
sed -i 's/# ssl_certificate_key/ssl_certificate_key/g' nginx/nginx.conf

# 7. Nginx'i yeniden başlat
log_info "Nginx yeniden başlatılıyor..."
docker restart nexaven-nginx

# 8. HTTPS erişimini test et
log_info "HTTPS erişimi test ediliyor..."
sleep 10

if curl -f https://nexaven.com.tr > /dev/null 2>&1; then
    log_success "✅ Site HTTPS ile erişilebilir"
else
    log_warning "⚠️  HTTPS erişimi henüz çalışmıyor, birkaç dakika bekleyin"
fi

# 9. SSL sertifikası bilgilerini göster
log_info "SSL sertifikası bilgileri:"
docker exec nexaven-nginx openssl x509 -in /etc/letsencrypt/live/nexaven.com.tr/fullchain.pem -text -noout | grep -E "(Subject:|Issuer:|Not Before:|Not After:)"

# 10. Otomatik yenileme için cron job ekle
log_info "Otomatik SSL yenileme ayarlanıyor..."
(crontab -l 2>/dev/null; echo "0 12 * * * cd $(pwd) && docker compose run --rm certbot renew && docker restart nexaven-nginx") | crontab -

echo ""
log_success "🎉 SSL kurulumu tamamlandı!"
log_success "🌐 Siteniz artık HTTPS ile erişilebilir:"
log_success "   • https://nexaven.com.tr"
log_success "   • https://www.nexaven.com.tr"
log_info "📅 SSL sertifikası her gün saat 12:00'da otomatik olarak yenilenecek"