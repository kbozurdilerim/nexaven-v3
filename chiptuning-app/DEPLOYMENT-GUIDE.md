# Force Yazılım - Deployment Guide

Bu kılavuz Force Yazılım Chiptuning Calculator uygulamasının deployment sürecini açıklar.

## 🚀 Hızlı Başlangıç

### 1. Repository'yi Klonlayın
```bash
git clone https://github.com/kbozurdilerim/chiptuningcalc.git
cd chiptuningcalc/chiptuning-app
```

### 2. Docker ile Başlatın
```bash
# Hızlı başlatma (sadece uygulama)
docker-compose up -d chiptuning-app

# Tam deployment (nginx ile)
docker-compose up -d
```

### 3. Erişim
- **Ana Sayfa**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **CSV Export**: http://localhost:3000/api/export/csv

## 🔧 Detaylı Kurulum

### Gereksinimler
- Docker 20.10+
- Docker Compose 2.0+
- 2GB RAM
- 1GB Disk Alanı

### Manuel Kurulum
```bash
# 1. Bağımlılıkları yükle
npm install

# 2. Uygulamayı başlat
npm start

# 3. Geliştirme modu
npm run dev
```

## 🐳 Docker Deployment

### Production Build
```bash
# Image build et
docker build -t force-yazilim-chiptuning .

# Container çalıştır
docker run -d \
  --name chiptuning-app \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data:ro \
  force-yazilim-chiptuning
```

### Docker Compose (Önerilen)
```bash
# Tüm servisleri başlat
docker-compose up -d

# Sadece uygulama
docker-compose up -d chiptuning-app

# Logları görüntüle
docker-compose logs -f chiptuning-app

# Durdur
docker-compose down
```

## 🌐 Production Deployment

### VPS/Server Deployment
```bash
# 1. Sunucuya bağlan
ssh user@your-server.com

# 2. Repository klonla
git clone https://github.com/kbozurdilerim/chiptuningcalc.git
cd chiptuningcalc/chiptuning-app

# 3. Environment ayarla
cp .env.example .env
nano .env

# 4. Deploy et
./deploy.sh
```

### Environment Variables
```bash
# .env dosyası
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔒 SSL/HTTPS Setup

### Let's Encrypt ile SSL
```bash
# Certbot yükle
sudo apt install certbot python3-certbot-nginx

# SSL sertifikası al
sudo certbot --nginx -d yourdomain.com

# Otomatik yenileme
sudo crontab -e
# Ekle: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring & Health Check

### Health Check Endpoints
- **Health**: `GET /health`
- **Stats**: `GET /api/stats`
- **Metrics**: Container logs

### Monitoring Script
```bash
#!/bin/bash
# health-check.sh
while true; do
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo "$(date): ✅ App is healthy"
    else
        echo "$(date): ❌ App is down"
        # Restart container
        docker-compose restart chiptuning-app
    fi
    sleep 60
done
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Port 3000 kullanımda
sudo lsof -i :3000
sudo kill -9 <PID>

# Veya farklı port kullan
PORT=3001 docker-compose up -d
```

#### 2. Database Not Loading
```bash
# Data klasörü kontrolü
ls -la data/
chmod 644 data/*.json

# Container logs
docker-compose logs chiptuning-app
```

#### 3. Memory Issues
```bash
# Memory kullanımı
docker stats chiptuning-app

# Memory limit ayarla
docker run -m 512m force-yazilim-chiptuning
```

#### 4. Build Errors
```bash
# Cache temizle
docker system prune -a

# No-cache build
docker-compose build --no-cache
```

### Log Analysis
```bash
# Container logs
docker-compose logs -f chiptuning-app

# Nginx logs
docker-compose logs -f nginx

# System logs
journalctl -u docker
```

## 🚀 Performance Optimization

### Production Settings
```javascript
// server.js optimizations
app.use(compression());
app.use(helmet());

// Cache headers
app.use(express.static('public', {
  maxAge: '1d',
  etag: true
}));
```

### Docker Optimizations
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD ["npm", "start"]
```

## 📈 Scaling

### Load Balancer Setup
```yaml
# docker-compose.yml
version: '3.8'
services:
  app1:
    build: .
    ports:
      - "3001:3000"
  
  app2:
    build: .
    ports:
      - "3002:3000"
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
```

### Database Scaling
```bash
# Redis cache ekle
docker run -d --name redis redis:alpine

# Database connection pool
npm install redis
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        run: |
          ssh ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_HOST }} \
          "cd /app && git pull && docker-compose up -d --build"
```

## 📞 Support

### İletişim
- **Email**: info@zorluecu.com
- **Phone**: +90 532 111 22 33
- **Website**: https://nexaven.com.tr

### Documentation
- **API Docs**: `/api/stats`
- **Health Check**: `/health`
- **CSV Export**: `/api/export/csv`

---

**Force Yazılım © 2026 - Professional Chiptuning Solutions**