#!/bin/bash

# Quick Deploy - Sadece Frontend (AI/LinOLS olmadan)
set -e

echo "🚀 Nexaven Quick Deploy (Frontend Only)"
echo "======================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }

# Stop existing containers
log_info "Stopping existing containers..."
docker compose down 2>/dev/null || true

# Create simple docker-compose for frontend only
cat > docker-compose.simple.yml << 'EOF'
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: nexaven-frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    networks:
      - nexaven-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: nexaven-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx-simple.conf:/etc/nginx/nginx.conf:ro
      - certbot-etc:/etc/letsencrypt
      - certbot-var:/var/lib/letsencrypt
      - web-root:/var/www/html
    depends_on:
      - frontend
    networks:
      - nexaven-network
    restart: unless-stopped

  certbot:
    image: certbot/certbot
    container_name: nexaven-certbot
    volumes:
      - certbot-etc:/etc/letsencrypt
      - certbot-var:/var/lib/letsencrypt
      - web-root:/var/www/html
    command: certonly --webroot --webroot-path=/var/www/html --email admin@nexaven.com.tr --agree-tos --no-eff-email -d nexaven.com.tr -d www.nexaven.com.tr
    depends_on:
      - nginx

volumes:
  certbot-etc:
  certbot-var:
  web-root:

networks:
  nexaven-network:
    driver: bridge
EOF

# Create simple nginx config
mkdir -p nginx
cat > nginx/nginx-simple.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    sendfile on;
    keepalive_timeout 65;
    client_max_body_size 20M;
    
    upstream frontend {
        server nexaven-frontend:3000;
    }

    server {
        listen 80;
        server_name nexaven.com.tr www.nexaven.com.tr;
        
        location /.well-known/acme-challenge/ {
            root /var/www/html;
        }
        
        location /health {
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
        
        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    server {
        listen 443 ssl http2;
        server_name nexaven.com.tr www.nexaven.com.tr;
        
        ssl_certificate /etc/letsencrypt/live/nexaven.com.tr/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/nexaven.com.tr/privkey.pem;
        
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        location /health {
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

# Build and start
log_info "Building and starting frontend..."
docker compose -f docker-compose.simple.yml up -d --build

# Wait and check
log_info "Waiting for services..."
sleep 30

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    log_success "✅ Frontend is running"
else
    echo "⚠️ Frontend check failed"
fi

if curl -f http://localhost/health > /dev/null 2>&1; then
    log_success "✅ Nginx is running"
else
    echo "⚠️ Nginx check failed"
fi

echo ""
log_success "🌐 Site: https://nexaven.com.tr"
log_success "📊 Admin: https://nexaven.com.tr/admin"
log_success "🔧 Zorlu ECU: https://nexaven.com.tr/zorlu-ecu-admin"

echo ""
echo "👤 Login:"
echo "  Nexaven: admin@nexaven.com / admin123"
echo "  Zorlu ECU: admin@zorluecu.com / zorlu123"

echo ""
log_success "🎉 Quick deployment completed!"
echo "💡 AI/LinOLS özellikleri için tam deployment yapın: ./deploy.sh"