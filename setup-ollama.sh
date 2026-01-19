#!/bin/bash

# Ollama Model Setup Script for Zorlu ECU (CPU-Optimized)
set -e

echo "🤖 Zorlu ECU - Ollama AI Model Setup (CPU Mode)"
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

# Check if Ollama container is running
log_info "Checking Ollama container status..."
if ! docker ps | grep -q nexaven-ollama; then
    log_warning "Ollama container is not running!"
    log_info "Starting Ollama container (CPU-only mode)..."
    
    # Try CPU-only deployment first
    if docker compose -f docker-compose.cpu.yml up -d ollama 2>/dev/null; then
        log_success "Started Ollama with CPU-only configuration"
    else
        log_info "Trying with main docker-compose..."
        docker compose up -d ollama 2>/dev/null || {
            log_error "Failed to start Ollama container"
            log_info "Checking Docker logs..."
            docker logs nexaven-ollama --tail 20 2>/dev/null || true
            exit 1
        }
    fi
    
    log_info "Waiting for Ollama to initialize..."
    sleep 20
fi

# Wait for Ollama to be ready
log_info "Waiting for Ollama API to be ready..."
for i in {1..60}; do
    if curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
        log_success "Ollama API is ready!"
        break
    fi
    if [ $i -eq 60 ]; then
        log_error "Ollama failed to start after 60 seconds"
        log_info "Checking Ollama logs..."
        docker logs nexaven-ollama --tail 30
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
    log_warning "No models found. Will download CPU-optimized models."
fi

# CPU-optimized models for ECU tuning
CPU_OPTIMIZED_MODELS=(
    "llama3.2:1b"           # Very fast, 1B parameters - best for CPU
    "qwen2.5:1.5b"          # Efficient 1.5B model
    "phi3:mini"             # Microsoft Phi-3 Mini - optimized
)

echo ""
log_info "CPU-optimized models for ECU tuning:"
for model in "${CPU_OPTIMIZED_MODELS[@]}"; do
    echo "  🤖 $model"
done

echo ""
read -p "Download CPU-optimized models for ECU tuning? (Y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    log_info "Skipping model download."
else
    for model in "${CPU_OPTIMIZED_MODELS[@]}"; do
        log_info "Downloading $model (CPU-optimized)..."
        if docker exec nexaven-ollama ollama pull "$model"; then
            log_success "✅ $model downloaded successfully"
        else
            log_error "❌ Failed to download $model"
            log_warning "This might be due to network issues or insufficient memory"
        fi
    done
fi

# Test Ollama API
echo ""
log_info "Testing Ollama API..."
if curl -s http://localhost:11434/api/tags >/dev/null; then
    log_success "✅ Ollama API is accessible"
    
    # Test a simple chat
    log_info "Testing AI chat functionality..."
    TEST_RESPONSE=$(curl -s -X POST http://localhost:11434/api/generate \
        -H "Content-Type: application/json" \
        -d '{"model":"llama3.2:1b","prompt":"ECU nedir?","stream":false}' \
        | grep -o '"response":"[^"]*"' | cut -d'"' -f4 2>/dev/null || echo "")
    
    if [ -n "$TEST_RESPONSE" ]; then
        log_success "✅ AI chat is working"
    else
        log_warning "⚠️ AI chat test failed - models may still be loading"
    fi
else
    log_warning "⚠️ Ollama API not accessible from host"
fi

# Show final status
echo ""
log_success "🎉 Ollama CPU Setup Complete!"
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
log_info "🧪 Manual Testing Commands (if needed):"
echo "  # Check containers: docker ps"
echo "  # Check frontend: curl http://localhost:3000"
echo "  # Check LinOLS: curl http://localhost:8080/health"
echo "  # Check Ollama: curl http://localhost:11434/api/tags"

echo ""
log_success "Ready for CPU-powered ECU tuning! 🚗🤖"
log_info "💡 Tip: CPU models are slower but work on any server"