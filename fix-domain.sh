#!/bin/bash

echo "🌐 Domain Fix - nexaven.com.tr → Frontend"
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

# 1. Stop nginx
log_info "Stopping nginx..."
docker stop nexaven-nginx 2>/dev/null || true
docker rm nexaven-nginx 2>/dev/null || true

# 2. Use HTTP-only config
log_info "Using HTTP-only nginx configuration..."
cp nginx-http-only.conf nginx/nginx.conf

# 3. Start nginx
log_info "Starting nginx with HTTP-only config..."
docker compose up -d nginx

# 4. Wait for nginx
sleep 10

# 5. Test nginx config
log_info "Testing nginx configuration..."
if docker exec nexaven-nginx nginx -t; then
    log_success "✅ Nginx configuration is valid"
else
    log_error "❌ Nginx configuration error"
    docker logs nexaven-nginx --tail 10
    exit 1
fi

# 6. Test frontend connection from nginx
log_info "Testing frontend connection from nginx..."
if docker exec nexaven-nginx curl -f http://frontend:3000 >/dev/null 2>&1; then
    log_success "✅ Nginx can reach frontend"
else
    log_error "❌ Nginx cannot reach frontend"
    log_info "Checking Docker network..."
    docker network ls
    docker network inspect nexaven-v3_nexaven-network
fi

# 7. Test domain access
log_info "Testing domain access..."
for i in {1..5}; do
    if curl -f http://nexaven.com.tr >/dev/null 2>&1; then
        log_success "✅ nexaven.com.tr is accessible"
        break
    else
        log_warning "Attempt $i/5: Domain not accessible yet..."
        sleep 5
    fi
    
    if [ $i -eq 5 ]; then
        log_error "❌ nexaven.com.tr not accessible"
        log_info "Testing localhost..."
        if curl -f http://localhost >/dev/null 2>&1; then
            log_info "✅ localhost works - DNS issue"
        else
            log_error "❌ localhost also fails - nginx issue"
        fi
    fi
done

# 8. Show nginx access logs
log_info "Recent nginx access logs:"
docker logs nexaven-nginx --tail 5 2>/dev/null | grep -E "(GET|POST|PUT|DELETE)" || echo "No access logs yet"

# 9. Test specific paths
log_info "Testing specific paths..."
echo "Frontend direct: http://72.62.178.51:3000"
echo "Through nginx: http://nexaven.com.tr"
echo "Admin panel: http://nexaven.com.tr/zorlu-ecu-admin"

echo ""
log_info "Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
log_success "🎉 Domain Fix Complete!"
log_info "🌐 Access URLs:"
log_info "  • Domain: http://nexaven.com.tr"
log_info "  • Admin: http://nexaven.com.tr/zorlu-ecu-admin"
log_info "  • Direct: http://72.62.178.51:3000 (backup)"

echo ""
log_info "🔧 If domain still not working:"
log_info "  1. Check DNS: nslookup nexaven.com.tr"
log_info "  2. Check nginx logs: docker logs nexaven-nginx"
log_info "  3. Test localhost: curl http://localhost"