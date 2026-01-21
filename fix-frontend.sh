#!/bin/bash

echo "🔧 Frontend Assets Fix - Nexaven ECU"
echo "==================================="

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

# 1. Stop containers
log_info "Stopping containers..."
docker compose down

# 2. Use HTTP-only nginx config
log_info "Using HTTP-only nginx configuration..."
cp nginx-http-only.conf nginx/nginx.conf

# 3. Clean build frontend
log_info "Clean building frontend..."
docker compose build --no-cache frontend

# 4. Start services
log_info "Starting services..."
docker compose up -d frontend nginx

# 5. Wait for services
log_info "Waiting for services to start..."
sleep 15

# 6. Test frontend directly
log_info "Testing frontend directly..."
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    log_success "✅ Frontend is working on port 3000"
else
    log_error "❌ Frontend not working on port 3000"
    log_info "Checking frontend logs..."
    docker logs nexaven-frontend --tail 10
fi

# 7. Test nginx proxy
log_info "Testing nginx proxy..."
if curl -f http://localhost/health >/dev/null 2>&1; then
    log_success "✅ Nginx proxy is working"
else
    log_warning "⚠️ Nginx proxy not working yet"
    log_info "Checking nginx logs..."
    docker logs nexaven-nginx --tail 10
fi

# 8. Test domain
log_info "Testing domain access..."
if curl -f http://nexaven.com.tr/health >/dev/null 2>&1; then
    log_success "✅ Domain is accessible"
else
    log_warning "⚠️ Domain not accessible yet"
fi

echo ""
log_info "Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
log_success "🎉 Frontend Fix Complete!"
log_info "🌐 Access URLs:"
log_info "  • Direct Frontend: http://localhost:3000"
log_info "  • Through Nginx: http://nexaven.com.tr"
log_info "  • Admin Panel: http://nexaven.com.tr/zorlu-ecu-admin"
log_info "  • AI ECU Tuning: Go to 'AI ECU Tuning' tab"

echo ""
log_info "🔧 If still showing blank page:"
log_info "  1. Check browser console for errors"
log_info "  2. Try hard refresh (Ctrl+F5)"
log_info "  3. Check: docker logs nexaven-frontend"