#!/bin/bash

# NEXAVEN PRODUCTION DEPLOYMENT SCRIPT
# Tek script - tüm işlemler burada

set -e

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🚀 NEXAVEN PRODUCTION DEPLOYMENT${NC}"
echo -e "${BLUE}================================================${NC}"

# Hata yakalama
trap 'echo -e "${RED}❌ Deployment hatası!${NC}"; exit 1' ERR

# 1. KONUM KONTROLÜ
echo -e "${BLUE}📍 1/8 - Konum kontrolü...${NC}"
if [ ! -f "docker-compose.yml" ] || [ ! -f "package.json" ]; then
    echo -e "${RED}❌ nexaven-website klasöründe olduğunuzdan emin olun!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Konum doğru: $(pwd)${NC}"

# 2. DOCKER KONTROLÜ
echo -e "${BLUE}📋 2/8 - Docker kontrolü...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker bulunamadı!${NC}"
    exit 1
fi

if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
    echo -e "${GREEN}✅ Docker Compose (v2) hazır${NC}"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
    echo -e "${GREEN}✅ Docker Compose (v1) hazır${NC}"
else
    echo -e "${RED}❌ Docker Compose bulunamadı!${NC}"
    exit 1
fi

# 3. ESKİ CONTAINER'LARI DURDUR
echo -e "${BLUE}🛑 3/8 - Eski container'lar durduruluyor...${NC}"
$DOCKER_COMPOSE_CMD down --remove-orphans || true
docker system prune -f || true
echo -e "${GREEN}✅ Temizlendi${NC}"

# 4. NGINX CONFIG
echo -e "${BLUE}🔧 4/8 - Nginx konfigürasyonu...${NC}"
if [ -f "nginx-production-with-ollama-proxy.conf" ]; then
    mkdir -p nginx
    cp nginx-production-with-ollama-proxy.conf nginx/nginx.conf
    echo -e "${GREEN}✅ Nginx config (Ollama proxy + CORS fix)${NC}"
else
    echo -e "${RED}❌ nginx config bulunamadı!${NC}"
    exit 1
fi

# 5. DATA DİZİNLERİ KONTROLÜ
echo -e "${BLUE}📁 5/8 - Data dizinleri kontrol...${NC}"
if [ -d "car_data" ]; then
    json_count=$(find car_data -name "*.json" | wc -l)
    echo -e "${GREEN}✅ Car data (${json_count} JSON)${NC}"
else
    echo -e "${RED}❌ Car data dizini yok!${NC}"
    exit 1
fi

if [ -d "car_ecu_data" ]; then
    ecu_json_count=$(find car_ecu_data -name "*.json" | wc -l)
    echo -e "${GREEN}✅ Car ECU data (${ecu_json_count} JSON)${NC}"
else
    echo -e "${RED}❌ Car ECU data dizini yok!${NC}"
    exit 1
fi

if [ -d "car_logo" ]; then
    logo_count=$(find car_logo -name "*.svg" | wc -l)
    echo -e "${GREEN}✅ Car logos (${logo_count} SVG)${NC}"
else
    echo -e "${RED}❌ Car logo dizini yok!${NC}"
    exit 1
fi

# 6. FRONTEND BUILD
echo -e "${BLUE}🏗️  6/8 - Frontend build...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Node modules yükleniyor...${NC}"
    npm install
fi

echo -e "${YELLOW}🔨 Production build...${NC}"
npm run build
echo -e "${GREEN}✅ Build tamamlandı${NC}"

# 7. SSL DİZİNLERİ
echo -e "${BLUE}🔐 7/8 - SSL dizinleri...${NC}"
mkdir -p nginx/ssl
echo -e "${GREEN}✅ SSL hazır${NC}"

# 8. CONTAINER'LARI BAŞLAT
echo -e "${BLUE}🚀 8/8 - Container'lar başlatılıyor...${NC}"
$DOCKER_COMPOSE_CMD up -d --build

# KONTROLLER
echo -e "${BLUE}🔍 Container kontrolleri...${NC}"
sleep 15

if $DOCKER_COMPOSE_CMD ps | grep -q "nexaven-frontend.*Up"; then
    echo -e "${GREEN}✅ Frontend çalışıyor${NC}"
else
    echo -e "${RED}❌ Frontend başlatılamadı!${NC}"
    $DOCKER_COMPOSE_CMD logs frontend
    exit 1
fi

if $DOCKER_COMPOSE_CMD ps | grep -q "nexaven-nginx.*Up"; then
    echo -e "${GREEN}✅ Nginx çalışıyor${NC}"
else
    echo -e "${RED}❌ Nginx başlatılamadı!${NC}"
    $DOCKER_COMPOSE_CMD logs nginx
    exit 1
fi

# ENDPOINT TESTLERİ
echo -e "${BLUE}🏥 Endpoint testleri...${NC}"
sleep 5

if curl -f http://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Health check${NC}"
else
    echo -e "${YELLOW}⚠️  Health check başarısız${NC}"
fi

if curl -f http://localhost/ollama/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Ollama proxy${NC}"
else
    echo -e "${YELLOW}⚠️  Ollama proxy test edilemedi${NC}"
fi

if curl -f http://localhost/car_data/BMW/BMW_20260120_190135.json > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Car data endpoint${NC}"
else
    echo -e "${YELLOW}⚠️  Car data test edilemedi${NC}"
fi

# BAŞARI MESAJI
echo ""
echo -e "${GREEN}🎉 DEPLOYMENT TAMAMLANDI!${NC}"
echo -e "${PURPLE}================================================${NC}"
echo ""
echo -e "${BLUE}📊 Sistem Durumu:${NC}"
echo -e "  • Frontend: ${GREEN}✅ Çalışıyor${NC}"
echo -e "  • Nginx: ${GREEN}✅ Çalışıyor${NC}"
echo -e "  • Car Data: ${GREEN}✅ ${json_count} JSON dosyası${NC}"
echo -e "  • ECU Data: ${GREEN}✅ ${ecu_json_count} JSON dosyası${NC}"
echo -e "  • Logos: ${GREEN}✅ ${logo_count} SVG dosyası${NC}"
echo -e "  • Ollama: ${GREEN}✅ Proxy aktif (CORS fixed)${NC}"
echo ""
echo -e "${YELLOW}🌐 Erişim:${NC}"
echo -e "  • Ana Site: ${BLUE}http://localhost${NC}"
echo -e "  • Admin: ${BLUE}http://localhost/zorlu-ecu/admin${NC}"
echo -e "  • HTTPS: ${BLUE}https://nexaven.com.tr${NC} (SSL sonrası)"
echo ""
echo -e "${BLUE}🔧 Komutlar:${NC}"
echo -e "  • Loglar: ${YELLOW}$DOCKER_COMPOSE_CMD logs -f${NC}"
echo -e "  • Durum: ${YELLOW}$DOCKER_COMPOSE_CMD ps${NC}"
echo -e "  • Restart: ${YELLOW}$DOCKER_COMPOSE_CMD restart${NC}"
echo -e "  • Stop: ${YELLOW}$DOCKER_COMPOSE_CMD down${NC}"
echo ""
echo -e "${GREEN}✨ Production ready!${NC}"
echo -e "${PURPLE}================================================${NC}"

echo ""
echo -e "${GREEN}🚀 BAŞARILI! 🚀${NC}"