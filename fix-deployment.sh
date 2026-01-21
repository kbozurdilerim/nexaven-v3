#!/bin/bash

# Quick Fix for Nexaven AI ECU Deployment
set -e

echo "🔧 Nexaven AI ECU - Quick Fix Deployment"
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

# Stop all containers
log_info "Stopping all containers..."
docker compose down 2>/dev/null || docker-compose down 2>/dev/null || true

# Clean up
log_info "Cleaning up..."
docker system prune -f

# Create necessary directories
log_info "Creating directories..."
mkdir -p ecu-files

# Start with CPU-only configuration
log_info "Starting services with CPU-only configuration..."
if [ -f "docker-compose.cpu.yml" ]; then
    log_info "Using CPU-optimized configuration..."
    docker compose -f docker-compose.cpu.yml build --no-cache
    docker compose -f docker-compose.cpu.yml up -d
else
    log_info "Using standard configuration..."
    docker compose build --no-cache
    docker compose up -d
fi

# Wait for services
log_info "Waiting for services to start..."
sleep 30

# Check service status
log_info "Checking service status..."

# Frontend
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    log_success "✅ Frontend is running"
else
    log_warning "⚠️ Frontend not ready yet"
fi

# External Ollama (if accessible)
if curl -f http://72.62.178.51:32768/api/tags >/dev/null 2>&1; then
    log_success "✅ External Ollama is accessible"
else
    log_warning "⚠️ External Ollama not accessible - check network connection"
fi

# Show container status
echo ""
log_info "Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
log_success "🎉 AI ECU System Deployed!"
log_info "Next steps:"
log_info "1. Access admin panel: https://nexaven.com.tr/zorlu-ecu-admin"
log_info "2. Go to 'AI ECU Tuning' tab"
log_info "3. Start using AI-powered ECU tuning"

echo ""
log_info "Professional ECU tuning features:"
log_info "• External Ollama AI integration (72.62.178.51:32768)"
log_info "• Real-time ECU parameter calculation"
log_info "• Stage 1/2/3 tuning presets"
log_info "• ECU file upload and analysis"