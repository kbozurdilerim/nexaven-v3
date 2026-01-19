#!/bin/bash

# Nexaven.com.tr + Admin Panels Deployment Script
set -e

echo "🚀 Nexaven.com.tr + Admin Panels Deployment"
echo "============================================="

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
log_admin() { echo -e "${PURPLE}[ADMIN]${NC} $1"; }

# Check Docker
if ! command -v docker &> /dev/null; then
    log_error "Docker not found. Please install Docker."
    exit 1
fi

# Stop existing containers
log_info "Stopping existing containers..."
docker-compose down 2>/dev/null || docker compose down 2>/dev/null || true

# Clean up
log_info "Cleaning up old images..."
docker system prune -f

# Build and start services
log_info "Building and starting services..."
if command -v docker-compose &> /dev/null; then
    docker-compose build --no-cache
    docker-compose up -d
else
    docker compose build --no-cache
    docker compose up -d
fi

# Wait for services to be ready
log_info "Waiting for services to be ready..."
sleep 30

# Health checks
log_info "Performing health checks..."

# Check Nexaven frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    log_success "✅ Nexaven frontend is running"
else
    log_warning "⚠️  Nexaven frontend health check failed"
fi

# Check nginx
if curl -f http://localhost/health > /dev/null 2>&1; then
    log_success "✅ Nginx is running"
else
    log_warning "⚠️  Nginx health check failed"
fi

# Display access URLs
echo ""
log_success "🌐 Access URLs:"
log_success "   • Main Site: https://nexaven.com.tr"
log_success "   • Health Check: https://nexaven.com.tr/health"

echo ""
log_admin "📊 Admin Panel URLs:"
log_admin "   • Nexaven Core Admin: https://nexaven.com.tr/admin"
log_admin "   • Zorlu ECU Admin: https://nexaven.com.tr/zorlu-ecu-admin"

echo ""
log_admin "👤 Admin Login Credentials:"
log_admin "   Nexaven Core:"
log_admin "     Email: admin@nexaven.com"
log_admin "     Password: admin123"
log_admin "   Zorlu ECU:"
log_admin "     Email: admin@zorluecu.com" 
log_admin "     Password: zorlu123"

echo ""
log_success "🎯 Available Features:"
log_success "   ✅ Customer Approval System"
log_success "   ✅ Enhanced Customer Management"
log_success "   ✅ Order Management (Zorlu ECU)"
log_success "   ✅ Live Chat System"
log_success "   ✅ File Upload/Management"
log_success "   ✅ Hot Reload Development"

# Show container status
echo ""
log_info "Container status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
log_success "🎉 Deployment completed!"
log_info "📖 Check logs with: docker-compose logs -f"
log_info "🔄 For development mode: npm run dev:docker"