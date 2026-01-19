#!/bin/bash

# Ollama Model Setup Script for Zorlu ECU
set -e

echo "🤖 Zorlu ECU - Ollama AI Model Setup"
echo "===================================="

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

# Check if Ollama container is running
log_info "Checking Ollama container status..."
if ! docker ps | grep -q nexaven-ollama; then
    log_warning "Ollama container is not running!"
    log_info "Starting Ollama container (CPU-only mode)..."
    
    # Start only Ollama service
    docker compose up -d ollama 2>/dev/null || {
        log_error "Failed to start Ollama with GPU. Trying CPU-only mode..."
        
        # Create CPU-only docker-compose override
        cat > docker-compose.cpu.yml << 'EOF'
version: '3.8'
services:
  ollama:
    image: ollama/ollama:latest
    container_name: nexaven-ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama-data:/root/.ollama
    environment:
      - OLLAMA_HOST=0.0.0.0
      - OLLAMA_ORIGINS=*
    networks:
      - nexaven-network
    restart: unless-stopped

volumes:
  ollama-data:

networks:
  nexaven-network:
    driver: bridge
EOF
        
        docker compose -f docker-compose.cpu.yml up -d
    }
    
    sleep 15
fi

# Wait for Ollama to be ready
log_info "Waiting for Ollama to be ready..."
for i in {1..60}; do
    if docker exec nexaven-ollama ollama list >/dev/null 2>&1; then
        log_success "Ollama is ready!"
        break
    fi
    if [ $i -eq 60 ]; then
        log_error "Ollama failed to start after 60 seconds"
        log_info "Checking Ollama logs..."
        docker logs nexaven-ollama --tail 20
        exit 1
    fi
    echo -n "."
    sleep 2
done

# Check available models
log_info "Checking available models..."
EXISTING_MODELS=$(docker exec nexaven-ollama ollama list 2>/dev/null | tail -n +2 | awk '{print $1}' | grep -v "^$" || true)

if [ -n "$EXISTING_MODELS" ]; then
    log_success "Found existing models:"
    echo "$EXISTING_MODELS" | while read model; do
        echo "  ✅ $model"
    done
else
    log_warning "No models found. Will download recommended models."
fi

# ECU Tuning optimized models (smaller for CPU)
RECOMMENDED_MODELS=(
    "llama3.2:1b"           # Very fast, 1B parameters
    "qwen2.5:1.5b"          # Fast and efficient
    "phi3:mini"             # Microsoft Phi-3 Mini
)

echo ""
log_info "Recommended models for ECU tuning (CPU optimized):"
for model in "${RECOMMENDED_MODELS[@]}"; do
    echo "  🤖 $model"
done

echo ""
read -p "Do you want to download recommended models? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    for model in "${RECOMMENDED_MODELS[@]}"; do
        log_info "Downloading $model..."
        if docker exec nexaven-ollama ollama pull "$model"; then
            log_success "✅ $model downloaded successfully"
        else
            log_error "❌ Failed to download $model"
        fi
    done
else
    log_info "Skipping model download. You can download manually later:"
    echo "  docker exec nexaven-ollama ollama pull llama3.2:1b"
fi

# Test Ollama API
echo ""
log_info "Testing Ollama API..."
if curl -s http://localhost:11434/api/tags >/dev/null; then
    log_success "✅ Ollama API is accessible"
else
    log_warning "⚠️ Ollama API not accessible from host"
    log_info "Testing from container..."
    if docker exec nexaven-ollama curl -s http://localhost:11434/api/tags >/dev/null; then
        log_success "✅ Ollama API works inside container"
    else
        log_error "❌ Ollama API not working"
    fi
fi

# Show final status
echo ""
log_success "🎉 Ollama Setup Complete!"
echo ""
log_info "📊 Final Status:"
FINAL_MODELS=$(docker exec nexaven-ollama ollama list 2>/dev/null | tail -n +2 | awk '{print $1}' | grep -v "^$" || true)
if [ -n "$FINAL_MODELS" ]; then
    echo "$FINAL_MODELS" | while read model; do
        echo "  ✅ $model"
    done
else
    log_warning "No models installed"
fi

echo ""
log_info "🔗 Access URLs:"
log_info "  • Ollama API: http://localhost:11434"
log_info "  • Admin Panel: https://nexaven.com.tr/zorlu-ecu-admin"
log_info "  • AI Chat: Go to Admin Panel → AI + LinOLS tab"

echo ""
log_info "🧪 Test Commands:"
echo "  # List models:"
echo "  docker exec nexaven-ollama ollama list"
echo ""
echo "  # Test chat:"
echo "  docker exec nexaven-ollama ollama run llama3.2:1b 'ECU tuning nedir?'"
echo ""
echo "  # Check API:"
echo "  curl http://localhost:11434/api/tags"

echo ""
log_success "Ready for AI-powered ECU tuning! 🚗🤖"