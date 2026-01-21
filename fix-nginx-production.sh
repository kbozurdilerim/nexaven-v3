#!/bin/bash

echo "🔧 Nginx Production Config Fix"
echo "============================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Stop nginx
log_info "Stopping nginx..."
docker stop nexaven-nginx 2>/dev/null || true
docker rm nexaven-nginx 2>/dev/null || true

# Create nginx config without external includes
log_info "Creating self-contained nginx config..."
cat > nginx/nginx.conf << 'EOF'
user nginx;
worker_processes auto;
worker_cpu_affinity auto;
worker_rlimit_nofile 65535;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
    accept_mutex off;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    '$request_time';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Performance & Security
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    keepalive_requests 1000;
    types_hash_max_size 2048;
    server_tokens off;
    client_max_body_size 100M;
    client_body_buffer_size 128k;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 4k;
    client_body_timeout 12;
    client_header_timeout 12;
    send_timeout 10;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        application/xml
        image/svg+xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=general_limit:10m rate=30r/s;
    limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/s;
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/s;
    limit_conn_zone $binary_remote_addr zone=conn_limit_per_ip:10m;

    # Upstream configuration
    upstream frontend {
        server frontend:3000 max_fails=3 fail_timeout=30s weight=1;
        keepalive 32;
        keepalive_requests 100;
        keepalive_timeout 60s;
    }

    # HTTP server (production ready)
    server {
        listen 80;
        server_name nexaven.com.tr www.nexaven.com.tr localhost _;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' http://72.62.178.51:32768 ws: wss:; frame-ancestors 'none';" always;

        # Rate limiting
        limit_req zone=general_limit burst=50 nodelay;
        limit_conn conn_limit_per_ip 20;

        # Frontend application
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_redirect off;
            proxy_buffering off;
            proxy_cache_bypass $http_upgrade;

            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # API endpoints with higher rate limits
        location /api/ {
            limit_req zone=api_limit burst=200 nodelay;
            
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Admin login with stricter rate limiting
        location ~ ^/(admin|zorlu-ecu-admin) {
            limit_req zone=login_limit burst=10 nodelay;
            
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static assets with aggressive caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif)$ {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            
            expires 1y;
            add_header Cache-Control "public, immutable";
            add_header Vary "Accept-Encoding";
            
            add_header Access-Control-Allow-Origin "*";
            add_header Access-Control-Allow-Methods "GET, OPTIONS";
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "OK - Nexaven ECU System";
            add_header Content-Type text/plain;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }

        # Nginx status (internal only)
        location /nginx-status {
            stub_status on;
            access_log off;
            allow 127.0.0.1;
            allow 172.16.0.0/12;
            deny all;
        }

        # Block common attack patterns
        location ~* \.(php|asp|aspx|jsp)$ {
            return 444;
        }

        # Block access to sensitive files
        location ~ /\. {
            deny all;
            access_log off;
            log_not_found off;
        }

        location ~ ~$ {
            deny all;
            access_log off;
            log_not_found off;
        }

        # Block common exploit attempts
        location ~* (wp-admin|wp-login|phpmyadmin|admin|administrator) {
            return 444;
        }

        # Robots.txt
        location = /robots.txt {
            proxy_pass http://frontend;
            access_log off;
        }

        # Favicon
        location = /favicon.ico {
            proxy_pass http://frontend;
            access_log off;
            expires 1y;
        }
    }
}
EOF

# Start nginx with new config
log_info "Starting nginx with fixed configuration..."
docker compose up -d nginx

# Wait for nginx
sleep 10

# Test nginx config
log_info "Testing nginx configuration..."
if docker exec nexaven-nginx nginx -t; then
    log_success "✅ Nginx configuration is valid"
else
    log_error "❌ Nginx configuration error"
    docker logs nexaven-nginx --tail 10
    exit 1
fi

# Test health check
log_info "Testing health check..."
for i in {1..5}; do
    if curl -f http://localhost/health >/dev/null 2>&1; then
        log_success "✅ Nginx is working"
        break
    else
        if [ $i -eq 5 ]; then
            log_error "❌ Nginx health check failed"
            docker logs nexaven-nginx --tail 10
        else
            log_info "Health check attempt $i/5..."
            sleep 3
        fi
    fi
done

# Test domain
log_info "Testing domain access..."
if curl -f http://nexaven.com.tr/health >/dev/null 2>&1; then
    log_success "✅ Domain nexaven.com.tr is accessible"
else
    log_info "ℹ️ Domain test failed - may be DNS propagation"
fi

echo ""
log_success "🎉 Nginx Production Fix Complete!"
log_info "🌐 Access URLs:"
log_info "  • Main Site: http://nexaven.com.tr"
log_info "  • Admin Panel: http://nexaven.com.tr/zorlu-ecu-admin"
log_info "  • Health Check: http://nexaven.com.tr/health"

echo ""
log_info "Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"