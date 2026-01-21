#!/bin/bash

# Production Deployment - Nexaven ECU AI System
set -e

echo "🚀 Production Deployment - Nexaven ECU AI System"
echo "================================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_deploy() { echo -e "${PURPLE}[DEPLOY]${NC} $1"; }

# Pre-deployment checks
log_info "Running pre-deployment checks..."

# Check Docker
if ! command -v docker &> /dev/null; then
    log_error "Docker not found. Please install Docker."
    exit 1
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 85 ]; then
    log_warning "Disk usage is ${DISK_USAGE}%. Consider cleaning up."
fi

# Check memory
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ "$MEMORY_USAGE" -gt 85 ]; then
    log_warning "Memory usage is ${MEMORY_USAGE}%. System may be under load."
fi

# Stop existing containers gracefully
log_deploy "Stopping existing containers..."
docker compose down --timeout 30 2>/dev/null || true

# Clean up old images and containers
log_deploy "Cleaning up old resources..."
docker system prune -f --volumes

# Create necessary directories
log_deploy "Creating directory structure..."
mkdir -p nginx/conf.d ecu-files logs/nginx logs/app

# Backup current nginx config
if [ -f "nginx/nginx.conf" ]; then
    log_info "Backing up current nginx configuration..."
    cp nginx/nginx.conf nginx/nginx.conf.backup.$(date +%Y%m%d_%H%M%S)
fi

# Use production nginx configuration
log_deploy "Installing production nginx configuration..."
cp nginx-production.conf nginx/nginx.conf

# Set proper permissions
log_deploy "Setting file permissions..."
chmod 644 nginx/nginx.conf
chmod 644 nginx/conf.d/shared-locations.conf
chmod -R 755 ecu-files

# Build frontend with production optimizations
log_deploy "Building frontend (production mode)..."
docker compose build --no-cache --parallel frontend

# Start services in production mode
log_deploy "Starting production services..."
docker compose up -d frontend nginx

# Wait for services to be ready
log_deploy "Waiting for services to initialize..."
sleep 30

# Health checks with retries
log_deploy "Performing comprehensive health checks..."

# Check frontend
for i in {1..10}; do
    if curl -f http://localhost:3000/health >/dev/null 2>&1; then
        log_success "✅ Frontend is healthy"
        break
    else
        if [ $i -eq 10 ]; then
            log_error "❌ Frontend health check failed after 10 attempts"
            docker logs nexaven-frontend --tail 20
            exit 1
        fi
        log_info "Frontend health check attempt $i/10..."
        sleep 5
    fi
done

# Check nginx
for i in {1..5}; do
    if curl -f http://localhost/health >/dev/null 2>&1; then
        log_success "✅ Nginx is healthy"
        break
    else
        if [ $i -eq 5 ]; then
            log_error "❌ Nginx health check failed after 5 attempts"
            docker logs nexaven-nginx --tail 20
            exit 1
        fi
        log_info "Nginx health check attempt $i/5..."
        sleep 3
    fi
done

# Check domain access
log_deploy "Testing domain access..."
if curl -f http://nexaven.com.tr/health >/dev/null 2>&1; then
    log_success "✅ Domain nexaven.com.tr is accessible"
else
    log_warning "⚠️ Domain access test failed - may be DNS propagation delay"
fi

# Check external Ollama connection
log_deploy "Testing external Ollama connection..."
if curl -f http://72.62.178.51:32768/api/tags >/dev/null 2>&1; then
    log_success "✅ External Ollama AI is accessible"
else
    log_warning "⚠️ External Ollama AI connection failed"
fi

# Performance tests
log_deploy "Running performance tests..."
RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' http://localhost:3000)
if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
    log_success "✅ Response time: ${RESPONSE_TIME}s (Good)"
else
    log_warning "⚠️ Response time: ${RESPONSE_TIME}s (Slow)"
fi

# Security checks
log_deploy "Running security checks..."
if curl -I http://localhost | grep -q "X-Frame-Options"; then
    log_success "✅ Security headers are present"
else
    log_warning "⚠️ Security headers missing"
fi

# SSL readiness check
log_deploy "Checking SSL readiness..."
if [ -f "/etc/letsencrypt/live/nexaven.com.tr/fullchain.pem" ] || docker run --rm -v nexaven-v3_certbot-etc:/etc/letsencrypt alpine test -f /etc/letsencrypt/live/nexaven.com.tr/fullchain.pem 2>/dev/null; then
    log_success "✅ SSL certificates are available"
    log_info "You can enable HTTPS by running: ./setup-ssl.sh"
else
    log_info "ℹ️ SSL certificates not found. Run ./setup-ssl.sh to enable HTTPS"
fi

# Display system status
echo ""
log_deploy "📊 System Status Report"
echo "=========================="

# Container status
echo "🐳 Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep nexaven

# Resource usage
echo ""
echo "💾 Resource Usage:"
echo "  CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "  Memory: $(free -h | awk 'NR==2{printf "%.1f/%.1fGB (%.0f%%)", $3/1024/1024/1024,$2/1024/1024/1024,$3*100/$2}')"
echo "  Disk: $(df -h / | awk 'NR==2{printf "%s/%s (%s)", $3,$2,$5}')"

# Network status
echo ""
echo "🌐 Network Status:"
echo "  Frontend: $(curl -o /dev/null -s -w '%{http_code}' http://localhost:3000)"
echo "  Nginx: $(curl -o /dev/null -s -w '%{http_code}' http://localhost/health)"
echo "  Domain: $(curl -o /dev/null -s -w '%{http_code}' http://nexaven.com.tr/health 2>/dev/null || echo 'N/A')"

# Application URLs
echo ""
log_success "🎉 Production Deployment Complete!"
echo ""
log_deploy "🌐 Application URLs:"
log_deploy "   • Main Site: http://nexaven.com.tr"
log_deploy "   • Admin Panel: http://nexaven.com.tr/zorlu-ecu-admin"
log_deploy "   • Health Check: http://nexaven.com.tr/health"

echo ""
log_deploy "👤 Admin Credentials:"
log_deploy "   • Email: admin@zorluecu.com"
log_deploy "   • Password: zorlu123"

echo ""
log_deploy "🤖 AI ECU Features:"
log_deploy "   • External Ollama: http://72.62.178.51:32768"
log_deploy "   • AI Chat: Admin Panel → 'AI ECU Tuning' tab"
log_deploy "   • ECU Commands: /ecu analyze, /ecu stage1, /ecu stage2"

echo ""
log_deploy "🔒 Security Features:"
log_deploy "   • Rate limiting enabled"
log_deploy "   • Security headers configured"
log_deploy "   • Attack pattern blocking"
log_deploy "   • SSL ready (run ./setup-ssl.sh)"

echo ""
log_deploy "📈 Monitoring:"
log_deploy "   • Logs: docker compose logs -f"
log_deploy "   • Nginx status: http://localhost/nginx-status (internal)"
log_deploy "   • Performance: Response time ${RESPONSE_TIME}s"

echo ""
log_success "🚗🤖 Nexaven ECU AI System is ready for production!"
log_info "💡 Next step: Run ./setup-ssl.sh to enable HTTPS"