#!/bin/bash

# Development Hot Reload Script
set -e

echo "🔥 Starting Nexaven Development Mode"
echo "===================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[DEV]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }

# Stop production containers
log_info "Stopping production containers..."
docker compose down 2>/dev/null || true

# Start development containers
log_info "Starting development containers with hot reload..."
docker compose -f docker-compose.dev.yml down 2>/dev/null || true
docker compose -f docker-compose.dev.yml up -d --build

# Wait for services
log_info "Waiting for development services..."
sleep 20

# Check if development server is running
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    log_success "✅ Development server is running"
else
    log_warning "⚠️  Development server not ready yet, checking logs..."
    docker compose -f docker-compose.dev.yml logs frontend
fi

echo ""
log_success "🔥 Development Mode Active!"
log_success "   • Frontend: http://localhost:3000"
log_success "   • HMR Port: 24678"
log_success "   • Live Reload: ✅ Active"

echo ""
log_info "📝 Development Commands:"
log_info "   • View logs: npm run dev:logs"
log_info "   • Shell access: npm run dev:shell"
log_info "   • Switch to prod: npm run prod:switch"

echo ""
log_success "🎯 Ready for development!"
log_info "Edit files in src/ and see changes instantly!"