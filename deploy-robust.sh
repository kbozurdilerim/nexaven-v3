#!/bin/bash

echo "🚀 Nexaven.com.tr Sağlam Production Deployment"
echo "=============================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
    log_warning "Running as root - be careful!"
fi

# Stop existing containers
log_info "Stopping existing containers..."
docker stop nexaven-nginx nexaven-frontend 2>/dev/null || true
docker rm nexaven-nginx nexaven-frontend 2>/dev/null || true

# Clean up old images and networks
log_info "Cleaning up old resources..."
docker system prune -f
docker network prune -f

# Create necessary directories
log_info "Creating directories..."
mkdir -p nginx/ssl
mkdir -p logs
mkdir -p data

# Ensure nginx config is in place
log_info "Verifying nginx configuration..."
if [ ! -f "nginx/nginx.conf" ]; then
    log_error "nginx/nginx.conf not found!"
    exit 1
fi

# Test nginx config syntax (if nginx is available locally)
if command -v nginx >/dev/null 2>&1; then
    log_info "Testing nginx configuration syntax..."
    nginx -t -c "$(pwd)/nginx/nginx.conf" 2>/dev/null || log_warning "Local nginx test failed - will test in container"
fi

# Build and start services
log_info "Building and starting services..."
docker compose up -d --build

# Wait for services to start
log_info "Waiting for services to start..."
sleep 15

# Check container status
log_info "Checking container status..."
if ! docker ps | grep -q nexaven-frontend; then
    log_error "Frontend container failed to start!"
    docker logs nexaven-frontend --tail 20
    exit 1
fi

if ! docker ps | grep -q nexaven-nginx; then
    log_error "Nginx container failed to start!"
    docker logs nexaven-nginx --tail 20
    exit 1
fi

# Test nginx configuration in container
log_info "Testing nginx configuration in container..."
if docker exec nexaven-nginx nginx -t; then
    log_success "✅ Nginx configuration is valid"
else
    log_error "❌ Nginx configuration error"
    docker logs nexaven-nginx --tail 10
    exit 1
fi

# Test health endpoints
log_info "Testing health endpoints..."
sleep 5

# Test localhost
for i in {1..10}; do
    if curl -f http://localhost/health >/dev/null 2>&1; then
        log_success "✅ Localhost health check passed"
        break
    else
        if [ $i -eq 10 ]; then
            log_error "❌ Localhost health check failed"
            docker logs nexaven-nginx --tail 10
            docker logs nexaven-frontend --tail 10
        else
            log_info "Health check attempt $i/10..."
            sleep 3
        fi
    fi
done

# Test domain (if accessible)
log_info "Testing domain access..."
if curl -f http://nexaven.com.tr/health >/dev/null 2>&1; then
    log_success "✅ Domain nexaven.com.tr is accessible"
else
    log_warning "⚠️ Domain test failed - may be DNS propagation or firewall"
fi

# Test frontend application
log_info "Testing frontend application..."
if curl -f http://localhost/ >/dev/null 2>&1; then
    log_success "✅ Frontend is responding"
else
    log_warning "⚠️ Frontend test failed"
fi

# Show container status
echo ""
log_info "Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep nexaven

# Show logs summary
echo ""
log_info "Recent logs:"
echo "Frontend logs:"
docker logs nexaven-frontend --tail 5 2>/dev/null || echo "No frontend logs"
echo ""
echo "Nginx logs:"
docker logs nexaven-nginx --tail 5 2>/dev/null || echo "No nginx logs"

echo ""
log_success "🎉 Nexaven Sağlam Deployment Complete!"
echo ""
log_info "🌐 Access URLs:"
log_info "  • Main Site: http://nexaven.com.tr"
log_info "  • Admin Panel: http://nexaven.com.tr/zorlu-ecu-admin"
log_info "  • Health Check: http://nexaven.com.tr/health"
log_info "  • Localhost: http://localhost (for testing)"

echo ""
log_info "📋 Next Steps:"
log_info "  1. Test the site: curl http://nexaven.com.tr/health"
log_info "  2. Check admin panel: http://nexaven.com.tr/zorlu-ecu-admin"
log_info "  3. Setup SSL: ./setup-ssl.sh (optional)"
log_info "  4. Monitor logs: docker logs nexaven-nginx -f"

echo ""
log_info "🔧 Troubleshooting:"
log_info "  • Check containers: docker ps"
log_info "  • View logs: docker logs nexaven-frontend"
log_info "  • Restart: docker compose restart"
log_info "  • Full rebuild: docker compose up -d --build --force-recreate"

# Final system check
echo ""
log_info "System Resources:"
echo "Disk usage: $(df -h / | awk 'NR==2{print $5}')"
echo "Memory usage: $(free -h | awk 'NR==2{print $3"/"$2}')"
echo "Docker containers: $(docker ps -q | wc -l) running"

log_success "Deployment completed successfully! 🚀"