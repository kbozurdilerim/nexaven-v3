#!/bin/bash

# Force Yazılım Chiptuning Calculator Deployment Script
# Bu script uygulamayı Docker ile deploy eder

set -e

echo "🚗 Force Yazılım Chiptuning Calculator Deployment"
echo "================================================"

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonksiyonlar
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Docker kontrolü
if ! command -v docker &> /dev/null; then
    log_error "Docker bulunamadı. Lütfen Docker'ı yükleyin."
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! command -v docker compose &> /dev/null; then
    log_error "Docker Compose bulunamadı. Lütfen Docker Compose'u yükleyin."
    exit 1
fi

# Mevcut container'ları durdur
log_info "Mevcut container'lar durduruluyor..."
docker-compose down 2>/dev/null || docker compose down 2>/dev/null || true

# Image'ları temizle
log_info "Eski image'lar temizleniyor..."
docker system prune -f

# Yeni build
log_info "Yeni image build ediliyor..."
if command -v docker-compose &> /dev/null; then
    docker-compose build --no-cache
else
    docker compose build --no-cache
fi

# Container'ları başlat
log_info "Container'lar başlatılıyor..."
if command -v docker-compose &> /dev/null; then
    docker-compose up -d
else
    docker compose up -d
fi

# Health check
log_info "Uygulama sağlık kontrolü yapılıyor..."
sleep 10

if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    log_success "✅ Uygulama başarıyla çalışıyor!"
    log_success "🌐 Erişim: http://localhost:3000"
    log_success "📊 Health Check: http://localhost:3000/health"
    log_success "📁 CSV Export: http://localhost:3000/api/export/csv"
else
    log_warning "⚠️  Health check başarısız. Container loglarını kontrol edin:"
    echo ""
    if command -v docker-compose &> /dev/null; then
        docker-compose logs chiptuning-app
    else
        docker compose logs chiptuning-app
    fi
fi

# Container durumları
log_info "Container durumları:"
docker ps --filter "name=chiptuning"

echo ""
log_info "🚀 Deployment tamamlandı!"
log_info "📖 Daha fazla bilgi için README.md dosyasını okuyun."