#!/bin/bash

# Force Yazılım Chiptuning Calculator - Quick Start
# Bu script uygulamayı hızlıca başlatır

echo "🚗 Force Yazılım Chiptuning Calculator - Quick Start"
echo "=================================================="

# Renk kodları
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}[INFO]${NC} Uygulamayı başlatıyor..."

# Sadece uygulama container'ını başlat (nginx olmadan)
docker-compose up -d chiptuning-app

echo ""
echo -e "${GREEN}✅ Uygulama başlatıldı!${NC}"
echo ""
echo "🌐 Erişim Adresleri:"
echo "   • Ana Sayfa: http://localhost:3000"
echo "   • Health Check: http://localhost:3000/health"
echo "   • API Dokümantasyonu: http://localhost:3000/api/stats"
echo "   • CSV Export: http://localhost:3000/api/export/csv"
echo ""
echo "📊 Özellikler:"
echo "   • 30+ Araç Modeli"
echo "   • 3 Stage Force Yazılım"
echo "   • Dark Theme & Animasyonlar"
echo "   • Real-time Arama"
echo "   • Performans Hesaplayıcı"
echo ""
echo "🛑 Durdurmak için: docker-compose down"
echo "📖 Detaylı bilgi: README.md"