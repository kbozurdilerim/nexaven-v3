#!/bin/bash

# Nexaven.com.tr + AI ECU Tuning Deployment Script
set -e

echo "🚀 Nexaven.com.tr + AI ECU Tuning Deployment"
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
log_ai() { echo -e "${PURPLE}[AI]${NC} $1"; }

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

# Create necessary directories
log_info "Creating directories..."
mkdir -p ollama-models ecu-files linols/web-interface/templates

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
sleep 45

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

# Check Ollama
if curl -f http://localhost:11434/api/tags > /dev/null 2>&1; then
    log_success "✅ Ollama AI is running"
    log_ai "Checking available models..."
    MODELS=$(curl -s http://localhost:11434/api/tags | grep -o '"name":"[^"]*"' | cut -d'"' -f4 || echo "")
    if [ -n "$MODELS" ]; then
        log_ai "Available models: $MODELS"
    else
        log_warning "⚠️  No AI models installed. Run setup-ollama.sh to install models."
    fi
else
    log_warning "⚠️  Ollama AI health check failed"
fi

# Check LinOLS
if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    log_success "✅ LinOLS interface is running"
else
    log_warning "⚠️  LinOLS interface health check failed"
fi

# Display access URLs
echo ""
log_success "🌐 Access URLs:"
log_success "   • Main Site: https://nexaven.com.tr"
log_success "   • Health Check: https://nexaven.com.tr/health"

echo ""
log_ai "📊 Admin Panel URLs:"
log_ai "   • Nexaven Core Admin: https://nexaven.com.tr/admin"
log_ai "   • Zorlu ECU Admin: https://nexaven.com.tr/zorlu-ecu-admin"

echo ""
log_ai "👤 Admin Login Credentials:"
log_ai "   Nexaven Core:"
log_ai "     Email: admin@nexaven.com"
log_ai "     Password: admin123"
log_ai "   Zorlu ECU:"
log_ai "     Email: admin@zorluecu.com" 
log_ai "     Password: zorlu123"

echo ""
log_success "🤖 AI ECU Tuning Features:"
log_success "   ✅ Ollama AI Chat Integration"
log_success "   ✅ LinOLS ECU File Processing"
log_success "   ✅ Real-time Parameter Tuning"
log_success "   ✅ Stage 1/2/3 Presets"
log_success "   ✅ Custom ECU Modifications"
log_success "   ✅ Professional Workflow"

echo ""
log_ai "🔧 AI Commands Available:"
log_ai "   • /linols open - Open LinOLS interface"
log_ai "   • /linols stage1 - Apply Stage 1 tuning"
log_ai "   • /linols stage2 - Apply Stage 2 tuning"
log_ai "   • Ask ECU questions in natural language"

echo ""
log_info "🚀 Next Steps:"
log_info "   1. Install AI models: chmod +x setup-ollama.sh && ./setup-ollama.sh"
log_info "   2. Access admin panel: https://nexaven.com.tr/zorlu-ecu-admin"
log_info "   3. Go to 'AI + LinOLS' tab"
log_info "   4. Start chatting with AI about ECU tuning"
log_info "   5. Upload ECU files and begin tuning"

# Show container status
echo ""
log_info "Container status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
log_success "🎉 AI-Powered ECU Tuning System Deployed!"
log_info "📖 Check logs with: docker-compose logs -f"
log_info "🔄 For development mode: npm run dev:docker"
log_ai "🤖 Ready for professional ECU tuning with AI assistance!"