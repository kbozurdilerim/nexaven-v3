#!/bin/bash

# Switch to Production Script
set -e

echo "🚀 Production Mode'a Geçiş"
echo "========================="

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

# Stop development mode
if docker ps | grep -q "nexaven-frontend-dev"; then
    log_info "Development mode durduruluyor..."
    docker compose -f docker-compose.dev.yml down
    log_success "Development mode durduruldu"
else
    log_info "Development mode zaten durdurulmuş"
fi

# Build latest changes
log_info "Son değişiklikler build ediliyor..."
npm run build

# Start production mode
log_info "Production mode başlatılıyor..."
docker compose up -d --build

# Wait for startup
log_info "Servisin başlaması bekleniyor..."
sleep 15

# Health check
if curl -f http://localhost > /dev/null 2>&1; then
    log_success "✅ Production mode başarıyla başlatıldı!"
    log_success "🌐 Site: http://nexaven.com.tr"
    log_success "🔒 SSL: https://nexaven.com.tr (eğer kuruluysa)"
else
    log_warning "⚠️  Site henüz erişilebilir değil, birkaç saniye bekleyin"
fi

# Show container status
log_info "Container durumu:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
log_success "🎉 Production mode aktif!"
log_info "📖 Logları kontrol edin: docker compose logs -f"