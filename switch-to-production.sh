#!/bin/bash

# Switch to Production Script
set -e

echo "🚀 Switching to Production Mode"
echo "==============================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[PROD]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }

# Stop development containers
log_info "Stopping development containers..."
docker compose -f docker-compose.dev.yml down 2>/dev/null || true

# Build production
log_info "Building production version..."
npm run build

# Start production containers
log_info "Starting production containers..."
docker compose up -d --build

# Wait for services
log_info "Waiting for production services..."
sleep 30

# Health check
if curl -f http://localhost > /dev/null 2>&1; then
    log_success "✅ Production server is running"
else
    log_warning "⚠️  Production server not ready yet"
fi

echo ""
log_success "🚀 Production Mode Active!"
log_success "   • Website: https://nexaven.com.tr"
log_success "   • Nexaven Admin: https://nexaven.com.tr/admin"
log_success "   • Zorlu ECU Admin: https://nexaven.com.tr/zorlu-ecu-admin"

echo ""
log_info "📊 Admin Credentials:"
log_info "   Nexaven: admin@nexaven.com / admin123"
log_info "   Zorlu ECU: admin@zorluecu.com / zorlu123"

echo ""
log_success "✅ Production deployment completed!"