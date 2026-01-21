#!/bin/bash

# Quick Fix for External Ollama Deployment
echo "🔧 Quick Fix - External Ollama ECU System"
echo "========================================"

# Stop all containers
echo "Stopping containers..."
docker compose down 2>/dev/null || docker-compose down 2>/dev/null || true

# Remove LinOLS directory if exists
if [ -d "linols" ]; then
    echo "Removing LinOLS directory..."
    rm -rf linols
fi

# Build and start only frontend + nginx
echo "Building frontend..."
docker compose build --no-cache frontend 2>/dev/null || docker-compose build --no-cache frontend

echo "Starting services..."
docker compose up -d frontend nginx 2>/dev/null || docker-compose up -d frontend nginx

# Wait for services
echo "Waiting for services..."
sleep 15

# Check status
echo ""
echo "Service Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "✅ External Ollama ECU System Ready!"
echo "🔗 Admin Panel: https://nexaven.com.tr/zorlu-ecu-admin"
echo "🤖 AI Tab: Go to 'AI ECU Tuning' tab"
echo "🌐 External Ollama: http://72.62.178.51:32768"