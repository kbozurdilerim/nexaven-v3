#!/bin/bash

# Hot Reload Development Update Script
set -e

echo "🔄 Nexaven Hot Reload Update"
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

# Check if development mode is running
if docker ps | grep -q "nexaven-frontend-dev"; then
    log_info "Development mode zaten çalışıyor - Hot reload aktif!"
    log_success "Kod değişiklikleriniz otomatik olarak yansıyacak"
    
    # Show logs
    log_info "Development logları:"
    docker logs nexaven-frontend-dev --tail 20
    
    log_info "Canlı logları izlemek için:"
    echo "docker logs nexaven-frontend-dev -f"
    
else
    log_warning "Development mode çalışmıyor. Başlatılıyor..."
    
    # Stop production if running
    if docker ps | grep -q "nexaven-frontend"; then
        log_info "Production container durduruluyor..."
        docker compose down
    fi
    
    # Start development mode
    log_info "Development mode başlatılıyor..."
    docker compose -f docker-compose.dev.yml up -d --build
    
    # Wait for startup
    log_info "Servisin başlaması bekleniyor..."
    sleep 10
    
    # Check status
    if docker ps | grep -q "nexaven-frontend-dev"; then
        log_success "✅ Development mode başarıyla başlatıldı!"
        log_success "🌐 Site: http://nexaven.com.tr"
        log_success "🔄 Hot reload aktif - kod değişiklikleri otomatik yansıyacak"
        
        # Show initial logs
        log_info "Son loglar:"
        docker logs nexaven-frontend-dev --tail 10
        
    else
        log_error "❌ Development mode başlatılamadı"
        log_info "Logları kontrol edin:"
        docker logs nexaven-frontend-dev
        exit 1
    fi
fi

echo ""
log_success "🎯 Kullanım:"
log_success "   • Kod değiştir → Otomatik yenilenir"
log_success "   • Logları izle: docker logs nexaven-frontend-dev -f"
log_success "   • Production'a geç: ./deploy.sh"

echo ""
log_info "📝 Development komutları:"
echo "   docker logs nexaven-frontend-dev -f     # Canlı loglar"
echo "   docker exec -it nexaven-frontend-dev sh # Container'a gir"
echo "   docker compose -f docker-compose.dev.yml down # Durdur"