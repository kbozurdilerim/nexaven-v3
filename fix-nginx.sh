#!/bin/bash

echo "🔧 Nginx SSL Fix - HTTP Only Mode"
echo "================================="

# Stop nginx container
echo "Stopping nginx container..."
docker stop nexaven-nginx 2>/dev/null || true
docker rm nexaven-nginx 2>/dev/null || true

# Backup original nginx config
echo "Backing up nginx config..."
cp nginx/nginx.conf nginx/nginx.conf.backup

# Use HTTP-only config
echo "Switching to HTTP-only config..."
cp nginx-http-only.conf nginx/nginx.conf

# Start nginx with new config
echo "Starting nginx with HTTP-only config..."
docker compose up -d nginx

# Wait for nginx to start
sleep 5

# Check nginx status
echo ""
echo "Nginx Status:"
docker ps | grep nginx

echo ""
echo "Testing nginx..."
if curl -f http://localhost/health >/dev/null 2>&1; then
    echo "✅ Nginx is working (HTTP-only mode)"
else
    echo "❌ Nginx still not working"
fi

echo ""
echo "✅ Nginx Fixed - HTTP Only Mode"
echo "🌐 Access: http://nexaven.com.tr"
echo "🔒 SSL can be added later with Let's Encrypt"