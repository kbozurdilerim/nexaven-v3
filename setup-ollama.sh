#!/bin/bash

# External Ollama Connection Test for Zorlu ECU
set -e

echo "🤖 Zorlu ECU - External Ollama Connection Test"
echo "=============================================="

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

# External Ollama server configuration
EXTERNAL_OLLAMA="http://72.62.178.51:32768"

log_info "Testing connection to external Ollama server..."
log_info "Server: $EXTERNAL_OLLAMA"

# Test connection
if curl -s "$EXTERNAL_OLLAMA/api/tags" >/dev/null 2>&1; then
    log_success "✅ External Ollama server is accessible!"
    
    # Get available models
    log_info "Checking available models..."
    MODELS=$(curl -s "$EXTERNAL_OLLAMA/api/tags" | grep -o '"name":"[^"]*"' | cut -d'"' -f4 2>/dev/null || echo "")
    
    if [ -n "$MODELS" ]; then
        log_success "Available models:"
        echo "$MODELS" | while read model; do
            echo "  ✅ $model"
        done
    else
        log_warning "No models found or unable to parse response"
    fi
    
    # Test AI chat functionality
    log_info "Testing AI chat functionality..."
    TEST_RESPONSE=$(curl -s -X POST "$EXTERNAL_OLLAMA/api/generate" \
        -H "Content-Type: application/json" \
        -d '{"model":"llama3.2","prompt":"ECU nedir? Kısaca açıkla.","stream":false}' \
        2>/dev/null | grep -o '"response":"[^"]*"' | cut -d'"' -f4 || echo "")
    
    if [ -n "$TEST_RESPONSE" ]; then
        log_success "✅ AI chat is working!"
        echo "Sample response: ${TEST_RESPONSE:0:100}..."
    else
        log_warning "⚠️ AI chat test failed - model might not be available"
    fi
    
else
    log_error "❌ Cannot connect to external Ollama server"
    log_error "Server: $EXTERNAL_OLLAMA"
    log_error ""
    log_error "Possible issues:"
    log_error "• Server is down or restarting"
    log_error "• Network connectivity problems"
    log_error "• Firewall blocking the connection"
    log_error "• Server address changed"
    exit 1
fi

echo ""
log_success "🎉 External Ollama Connection Test Complete!"
echo ""
log_info "🔗 Integration Details:"
log_info "  • External Server: $EXTERNAL_OLLAMA"
log_info "  • Admin Panel: https://nexaven.com.tr/zorlu-ecu-admin"
log_info "  • AI Tab: Go to 'AI ECU Tuning' tab"

echo ""
log_info "🧪 Manual Testing Commands:"
echo "  # Test connection:"
echo "  curl $EXTERNAL_OLLAMA/api/tags"
echo ""
echo "  # Test chat:"
echo "  curl -X POST $EXTERNAL_OLLAMA/api/generate \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"model\":\"llama3.2\",\"prompt\":\"ECU nedir?\",\"stream\":false}'"

echo ""
log_success "Ready for external AI-powered ECU tuning! 🚗🤖"
log_info "💡 Tip: No local AI installation needed - using external server"