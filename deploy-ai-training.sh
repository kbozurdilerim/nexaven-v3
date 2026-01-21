#!/bin/bash

echo "🧠 Nexaven AI Öğretme Sistemi Deployment"
echo "========================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }

# Stop existing containers
log_info "Stopping existing containers..."
docker compose down

# Build with AI training features
log_info "Building with AI training system..."
docker compose up -d --build

# Wait for services
log_info "Waiting for services to start..."
sleep 20

# Test AI training system
log_info "Testing AI training system..."
if curl -f http://localhost/health >/dev/null 2>&1; then
    log_success "✅ AI training system deployed successfully!"
    echo ""
    echo "🧠 AI Öğretme Sistemi Özellikleri:"
    echo "  • Hex dosya okuma ve analiz"
    echo "  • AI destekli ECU modlama"
    echo "  • Otomatik araç tanıma"
    echo "  • Stage 1/2/3 Force yazılım"
    echo "  • İndirilebilir modlanmış dosyalar"
    echo "  • Kapsamlı tuning veritabanı"
    echo ""
    echo "🌐 Erişim:"
    echo "  • Ana Site: http://nexaven.com.tr"
    echo "  • AI Öğretme: http://nexaven.com.tr/zorlu-ecu-admin (🧠 AI Öğretme sekmesi)"
    echo "  • AI ECU Chat: http://nexaven.com.tr/zorlu-ecu-admin (🤖 AI ECU Tuning sekmesi)"
    echo ""
    echo "📁 Desteklenen Dosya Formatları:"
    echo "  • .bin (Binary ECU files)"
    echo "  • .hex (Hex files)"
    echo "  • .ecu (ECU files)"
    echo "  • .ori (Original files)"
    echo "  • .mod (Modified files)"
    echo ""
    echo "🤖 AI Komutları:"
    echo "  • /ecu analyze - ECU dosyası analizi"
    echo "  • /ecu stage1 - Force Yazılım 1"
    echo "  • /ecu stage2 - Force Yazılım 2"
    echo "  • /ecu stage3 - Force Yazılım 3"
    echo "  • /ecu optimize - Optimizasyon önerileri"
    echo ""
    echo "📊 Veritabanı:"
    echo "  • 150+ araç modeli"
    echo "  • 50+ marka"
    echo "  • Hex adresleri ve modifikasyonlar"
    echo "  • AI eğitim verileri"
else
    log_error "❌ Deployment failed!"
    echo "🔍 Troubleshooting:"
    echo "  docker logs nexaven-frontend --tail 20"
    echo "  docker logs nexaven-nginx --tail 20"
fi

echo ""
log_info "Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep nexaven