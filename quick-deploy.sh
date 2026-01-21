#!/bin/bash

echo "⚡ Nexaven Quick Deploy"
echo "====================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Quick restart with robust config
log_info "Stopping containers..."
docker compose down

log_info "Starting services with robust config..."
docker compose up -d --build

# Wait and test
log_info "Waiting for services..."
sleep 15

# Test health
if curl -f http://localhost/health >/dev/null 2>&1; then
    log_success "✅ Quick deploy successful!"
    echo ""
    echo "🌐 Access URLs:"
    echo "  • Main Site: http://nexaven.com.tr"
    echo "  • Admin Panel: http://nexaven.com.tr/zorlu-ecu-admin"
    echo "  • Health: http://nexaven.com.tr/health"
    echo ""
    echo "📊 Status:"
    docker ps --format "table {{.Names}}\t{{.Status}}" | grep nexaven
    echo ""
    echo "🔧 AI ECU Features:"
    echo "  • External Ollama: http://72.62.178.51:32768"
    echo "  • AI Commands: /ecu analyze, /ecu stage1, /ecu stage2, /ecu stage3"
else
    log_error "❌ Deploy failed!"
    echo "🔍 Check logs:"
    echo "  docker logs nexaven-nginx --tail 10"
    echo "  docker logs nexaven-frontend --tail 10"
    echo ""
    echo "🔧 Try full deployment:"
    echo "  ./deploy-robust.sh"
fi