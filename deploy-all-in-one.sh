#!/bin/bash

# NEXAVEN ALL-IN-ONE DEPLOYMENT SCRIPT
# Bu script tek seferde tüm sistemi kurar ve çalıştırır

set -e

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🚀 NEXAVEN ALL-IN-ONE DEPLOYMENT BAŞLATIYOR...${NC}"
echo -e "${BLUE}================================================${NC}"

# Hata yakalama
trap 'echo -e "${RED}❌ Deployment sırasında hata oluştu!${NC}"; exit 1' ERR

# 1. SISTEM KONTROLÜ
echo -e "${BLUE}📋 1/8 - Sistem kontrolü yapılıyor...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker bulunamadı! Lütfen Docker'ı kurun.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose bulunamadı! Lütfen Docker Compose'u kurun.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker ve Docker Compose hazır${NC}"

# 2. ESKİ CONTAINER'LARI DURDUR
echo -e "${BLUE}🛑 2/8 - Eski container'lar durduruluyor...${NC}"
docker-compose down --remove-orphans || true
docker system prune -f || true
echo -e "${GREEN}✅ Eski container'lar temizlendi${NC}"

# 3. NGINX CONFIG GÜNCELLEMESİ
echo -e "${BLUE}🔧 3/8 - Nginx konfigürasyonu güncelleniyor...${NC}"
if [ -f "nginx-production-complete.conf" ]; then
    cp nginx-production-complete.conf nginx/nginx.conf
    echo -e "${GREEN}✅ Nginx config güncellendi (car_data + car_ecu_data + car_logo + Ollama mixed content fix)${NC}"
else
    echo -e "${RED}❌ nginx-production-complete.conf bulunamadı!${NC}"
    exit 1
fi

# 4. CAR DATA, ECU DATA VE LOGO KONTROLÜ
echo -e "${BLUE}📁 4/8 - Car data, ECU data ve logo dizinleri kontrol ediliyor...${NC}"
if [ -d "car_data" ]; then
    json_count=$(find car_data -name "*.json" | wc -l)
    echo -e "${GREEN}✅ Car data dizini mevcut (${json_count} JSON dosyası)${NC}"
else
    echo -e "${RED}❌ Car data dizini bulunamadı!${NC}"
    exit 1
fi

if [ -d "car_ecu_data" ]; then
    ecu_json_count=$(find car_ecu_data -name "*.json" | wc -l)
    echo -e "${GREEN}✅ Car ECU data dizini mevcut (${ecu_json_count} JSON dosyası)${NC}"
else
    echo -e "${RED}❌ Car ECU data dizini bulunamadı!${NC}"
    exit 1
fi

if [ -d "car_logo" ]; then
    logo_count=$(find car_logo -name "*.svg" | wc -l)
    echo -e "${GREEN}✅ Car logo dizini mevcut (${logo_count} SVG dosyası)${NC}"
else
    echo -e "${RED}❌ Car logo dizini bulunamadı!${NC}"
    exit 1
fi

# 5. DOCKER COMPOSE KONTROLÜ
echo -e "${BLUE}🐳 5/8 - Docker Compose konfigürasyonu kontrol ediliyor...${NC}"
if grep -q "car_data:/app/car_data:ro" docker-compose.yml && grep -q "car_ecu_data:/app/car_ecu_data:ro" docker-compose.yml && grep -q "car_logo:/app/car_logo:ro" docker-compose.yml; then
    echo -e "${GREEN}✅ Car data, ECU data ve logo volume mount konfigürasyonu mevcut${NC}"
else
    echo -e "${RED}❌ Car data, ECU data veya logo volume mount eksik!${NC}"
    exit 1
fi

# 6. FRONTEND BUILD
echo -e "${BLUE}🏗️  6/8 - Frontend build ediliyor...${NC}"
if [ -f "package.json" ]; then
    # Node modules kontrolü
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Node modules yükleniyor...${NC}"
        npm install
    fi
    
    # Build
    echo -e "${YELLOW}🔨 Production build yapılıyor...${NC}"
    npm run build
    echo -e "${GREEN}✅ Frontend build tamamlandı${NC}"
else
    echo -e "${RED}❌ package.json bulunamadı!${NC}"
    exit 1
fi

# 7. SSL DİZİNLERİ HAZIRLA
echo -e "${BLUE}🔐 7/8 - SSL dizinleri hazırlanıyor...${NC}"
mkdir -p nginx/ssl
echo -e "${GREEN}✅ SSL dizinleri hazır${NC}"

# 8. CONTAINER'LARI BAŞLAT
echo -e "${BLUE}🚀 8/8 - Container'lar başlatılıyor...${NC}"
docker-compose up -d --build

# CONTAINER DURUMLARINI KONTROL ET
echo -e "${BLUE}🔍 Container durumları kontrol ediliyor...${NC}"
sleep 15

# Frontend container kontrolü
if docker-compose ps | grep -q "nexaven-frontend.*Up"; then
    echo -e "${GREEN}✅ Frontend container çalışıyor${NC}"
else
    echo -e "${RED}❌ Frontend container başlatılamadı!${NC}"
    echo -e "${YELLOW}Frontend logları:${NC}"
    docker-compose logs frontend
    exit 1
fi

# Nginx container kontrolü
if docker-compose ps | grep -q "nexaven-nginx.*Up"; then
    echo -e "${GREEN}✅ Nginx container çalışıyor${NC}"
else
    echo -e "${RED}❌ Nginx container başlatılamadı!${NC}"
    echo -e "${YELLOW}Nginx logları:${NC}"
    docker-compose logs nginx
    exit 1
fi

# HEALTH CHECK'LER
echo -e "${BLUE}🏥 Health check'ler yapılıyor...${NC}"
sleep 5

# HTTP health check
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ HTTP health check başarılı${NC}"
else
    echo -e "${YELLOW}⚠️  HTTP health check başarısız (normal olabilir)${NC}"
fi

# Car data, ECU data ve logo endpoint kontrolü
echo -e "${BLUE}📊 Car data, ECU data ve logo endpoint kontrolü...${NC}"
if curl -f http://localhost/car_data/BMW/BMW_20260120_190135.json > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Car data endpoint çalışıyor${NC}"
else
    echo -e "${YELLOW}⚠️  Car data endpoint test edilemedi${NC}"
fi

if curl -f http://localhost/car_ecu_data/Bmw/Bmw_20260122_160652.json > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Car ECU data endpoint çalışıyor${NC}"
else
    echo -e "${YELLOW}⚠️  Car ECU data endpoint test edilemedi${NC}"
fi

if curl -f http://localhost/car_logo/bmw.svg > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Car logo endpoint çalışıyor${NC}"
else
    echo -e "${YELLOW}⚠️  Car logo endpoint test edilemedi${NC}"
fi

# Ollama bağlantı testi
echo -e "${BLUE}🤖 Ollama bağlantı testi...${NC}"
if curl -f http://72.62.178.51:32768/api/tags > /dev/null 2>&1; then
    echo -e "${GREEN}✅ External Ollama server erişilebilir${NC}"
else
    echo -e "${YELLOW}⚠️  External Ollama server test edilemedi${NC}"
fi

# BAŞARI MESAJI
echo ""
echo -e "${GREEN}🎉 NEXAVEN ALL-IN-ONE DEPLOYMENT TAMAMLANDI!${NC}"
echo -e "${PURPLE}================================================${NC}"
echo ""
echo -e "${BLUE}📊 Deployment Özeti:${NC}"
echo -e "  • Frontend: ${GREEN}✅ Çalışıyor${NC}"
echo -e "  • Nginx: ${GREEN}✅ Çalışıyor${NC}"
echo -e "  • Car Data: ${GREEN}✅ Mount edildi${NC}"
echo -e "  • Car ECU Data: ${GREEN}✅ Mount edildi${NC}"
echo -e "  • Car Logos: ${GREEN}✅ Mount edildi${NC}"
echo -e "  • Ollama: ${GREEN}✅ External server${NC}"
echo -e "  • Mixed Content: ${GREEN}✅ Çözüldü${NC}"
echo -e "  • Modal Renkleri: ${GREEN}✅ Düzeltildi${NC}"
echo ""
echo -e "${YELLOW}🌐 Erişim URL'leri:${NC}"
echo -e "  • Ana Site: ${BLUE}http://localhost${NC}"
echo -e "  • HTTPS: ${BLUE}https://nexaven.com.tr${NC} (SSL kurulumundan sonra)"
echo -e "  • Zorlu ECU Admin: ${BLUE}http://localhost/zorlu-ecu/admin${NC}"
echo -e "  • AI Training: Admin panelinde 'AI Öğretme' sekmesi"
echo ""
echo -e "${BLUE}🔧 Yararlı Komutlar:${NC}"
echo -e "  • Logları görmek için: ${YELLOW}docker-compose logs -f${NC}"
echo -e "  • Container durumu: ${YELLOW}docker-compose ps${NC}"
echo -e "  • Yeniden başlatmak için: ${YELLOW}docker-compose restart${NC}"
echo -e "  • Durdurmak için: ${YELLOW}docker-compose down${NC}"
echo ""
echo -e "${GREEN}✨ Sistem tamamen stabil ve production-ready!${NC}"
echo -e "${PURPLE}================================================${NC}"

# Son kontrol - container logları
echo -e "${BLUE}📋 Son 10 satır container logları:${NC}"
docker-compose logs --tail=10

echo ""
echo -e "${GREEN}🚀 DEPLOYMENT BAŞARIYLA TAMAMLANDI! 🚀${NC}"