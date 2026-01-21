#!/bin/bash

echo "🔍 Nexaven System Status Check"
echo "=============================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }

echo ""
log_info "🐳 Docker Container Status"
echo "=========================="
if docker ps | grep -q nexaven; then
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep nexaven
    log_success "✅ Containers are running"
else
    log_error "❌ No Nexaven containers running"
fi

echo ""
log_info "🌐 Network Connectivity"
echo "======================="

# Test localhost
if curl -f http://localhost/health >/dev/null 2>&1; then
    log_success "✅ Localhost health check passed"
else
    log_error "❌ Localhost health check failed"
fi

# Test domain
if curl -f http://nexaven.com.tr/health >/dev/null 2>&1; then
    log_success "✅ Domain nexaven.com.tr accessible"
else
    log_warning "⚠️ Domain nexaven.com.tr not accessible"
fi

# Test frontend
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    log_success "✅ Frontend direct access working"
else
    log_warning "⚠️ Frontend direct access failed"
fi

echo ""
log_info "🤖 AI Service Status"
echo "==================="

# Test external Ollama
if curl -f http://72.62.178.51:32768/api/tags >/dev/null 2>&1; then
    log_success "✅ External Ollama AI service accessible"
else
    log_warning "⚠️ External Ollama AI service not accessible"
fi

echo ""
log_info "📊 System Resources"
echo "=================="
echo "Disk usage: $(df -h / | awk 'NR==2{print $5}')"
echo "Memory usage: $(free -h | awk 'NR==2{print $3"/"$2}')"
echo "Docker containers: $(docker ps -q | wc -l) running"
echo "Load average: $(uptime | awk -F'load average:' '{print $2}')"

echo ""
log_info "📋 Service URLs"
echo "==============="
echo "🌐 Main Site: http://nexaven.com.tr"
echo "👤 Admin Panel: http://nexaven.com.tr/admin"
echo "🔧 Zorlu ECU Admin: http://nexaven.com.tr/zorlu-ecu-admin"
echo "❤️ Health Check: http://nexaven.com.tr/health"
echo "🤖 AI Service: http://72.62.178.51:32768"

echo ""
log_info "🔧 Quick Commands"
echo "================="
echo "• Restart services: docker compose restart"
echo "• View logs: docker logs nexaven-nginx -f"
echo "• Quick deploy: ./quick-deploy.sh"
echo "• Full deploy: ./deploy-robust.sh"
echo "• Setup SSL: ./setup-ssl.sh"

echo ""
if docker ps | grep -q nexaven-frontend && docker ps | grep -q nexaven-nginx; then
    log_success "🎉 System Status: HEALTHY"
else
    log_error "⚠️ System Status: NEEDS ATTENTION"
    echo ""
    log_info "🔧 Troubleshooting:"
    echo "1. Check container logs: docker logs nexaven-frontend"
    echo "2. Restart services: ./quick-deploy.sh"
    echo "3. Full redeploy: ./deploy-robust.sh"
fi