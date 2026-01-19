#!/bin/bash

# Quick Fix for Nexaven AI ECU Deployment Issues
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
mkdir -p linols/web-interface/templates ecu-files ollama-models

# Ensure LinOLS Dockerfile exists and is correct
log_info "Checking LinOLS Dockerfile..."
if [ ! -f "linols/Dockerfile.simple" ]; then
    log_error "LinOLS Dockerfile missing!"
    exit 1
fi

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

# LinOLS
if curl -f http://localhost:8080/health >/dev/null 2>&1; then
    log_success "✅ LinOLS is running"
else
    log_warning "⚠️ LinOLS not ready - checking logs..."
    docker logs nexaven-linols --tail 10 2>/dev/null || true
fi

# Ollama
if curl -f http://localhost:11434/api/tags >/dev/null 2>&1; then
    log_success "✅ Ollama is running"
else
    log_warning "⚠️ Ollama not ready - checking logs..."
    docker logs nexaven-ollama --tail 10 2>/dev/null || true
fi

# Show container status
echo ""
log_info "Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
log_success "🎉 AI ECU Tuning System Ready!"
log_info "Next steps:"
log_info "1. Setup AI models: ./setup-ollama.sh"
log_info "2. Access admin panel: https://nexaven.com.tr/zorlu-ecu-admin"
log_info "3. Use 'AI + LinOLS' tab for ECU tuning"

echo ""
log_info "Professional ECU tuning features:"
log_info "• AI-powered chat assistance"
log_info "• Real-time parameter adjustment"
log_info "• Stage 1/2/3 tuning presets"
log_info "• ECU file processing and export"