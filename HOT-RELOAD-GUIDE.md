# 🔥 Hot Reload Development Guide

Bu rehber, Nexaven projesinde hiç bozmadan canlı güncellemeler yapmanızı sağlar.

## 🚀 Hızlı Başlangıç

### 1. Development Mode Başlat
```bash
# VPS'te nexaven-v3 klasöründe
cd nexaven-v3
npm run dev:docker
```

### 2. Kod Değiştir → Otomatik Güncellenir! 
- Herhangi bir `.tsx`, `.ts`, `.css` dosyasını düzenle
- Kaydet
- Tarayıcı otomatik yenilenir ✨

### 3. Production'a Geç
```bash
npm run prod:switch
```

## 📋 Komutlar

### Development
```bash
npm run dev:docker      # Hot reload başlat
npm run dev:logs        # Canlı logları izle  
npm run dev:shell       # Container'a gir
```

### Production
```bash
npm run prod:switch     # Production'a geç
npm run deploy          # Tam deployment
```

### Docker
```bash
npm run docker:up       # Production başlat
npm run docker:down     # Durdur
npm run docker:logs     # Logları göster
```

## 🔄 Nasıl Çalışır?

### Development Mode
- **Volume Mapping**: Kod dosyaları container'a mount edilir
- **Hot Module Replacement**: Vite HMR ile anında güncelleme
- **File Watching**: Dosya değişiklikleri otomatik algılanır
- **Port 3000**: Frontend
- **Port 24678**: HMR WebSocket

### Production Mode  
- **Optimized Build**: Minified ve optimized kod
- **Static Serving**: Nginx ile hızlı servis
- **SSL Ready**: HTTPS desteği
- **Caching**: Browser cache optimizasyonu

## 📁 Hangi Dosyalar İzlenir?

✅ **İzlenen (Hot Reload)**
- `src/**/*.tsx` - React components
- `src/**/*.ts` - TypeScript files  
- `src/**/*.css` - Styles
- `index.html` - HTML template
- `tailwind.config.js` - Tailwind config
- `vite.config.ts` - Vite config

❌ **İzlenmeyen**
- `package.json` - Restart gerekir
- `Dockerfile` - Rebuild gerekir
- `docker-compose.yml` - Restart gerekir

## 🛠️ Troubleshooting

### Hot Reload Çalışmıyor?
```bash
# Container'ı yeniden başlat
docker compose -f docker-compose.dev.yml down
npm run dev:docker

# Logları kontrol et
npm run dev:logs
```

### Port Çakışması?
```bash
# Çalışan container'ları kontrol et
docker ps

# Çakışan container'ı durdur
docker stop nexaven-frontend
```

### Değişiklikler Yansımıyor?
```bash
# Browser cache temizle (Ctrl+Shift+R)
# Veya container'ı yeniden başlat
npm run dev:docker
```

## 📊 Performance

### Development
- **Startup**: ~30 saniye
- **Hot Reload**: ~1-3 saniye
- **Memory**: ~200MB
- **CPU**: Düşük

### Production
- **Startup**: ~15 saniye  
- **Response**: <100ms
- **Memory**: ~50MB
- **CPU**: Çok düşük

## 🔒 Güvenlik

### Development
- Sadece local network erişimi
- Debug bilgileri aktif
- Source maps dahil

### Production
- Public erişim
- Optimized ve minified
- Security headers
- SSL/HTTPS

## 📝 Workflow Örneri

```bash
# 1. Development başlat
npm run dev:docker

# 2. Kod geliştir (otomatik güncellenir)
# - src/pages/AdminDashboard.tsx düzenle
# - Kaydet → Tarayıcı yenilenir

# 3. Test et
# - http://nexaven.com.tr adresinde test et

# 4. Production'a geç
npm run prod:switch

# 5. Final test
# - https://nexaven.com.tr adresinde test et
```

## 🎯 Best Practices

### Development
- Küçük değişiklikler yap
- Her değişiklikten sonra test et
- Console loglarını takip et
- Browser dev tools kullan

### Production
- Deployment öncesi test et
- SSL sertifikasını kontrol et
- Performance'ı ölç
- Backup al

## 📞 Destek

Sorun yaşarsan:
1. `npm run dev:logs` ile logları kontrol et
2. Browser console'u kontrol et  
3. Container'ı yeniden başlat
4. Production'a geçip test et

## 🎉 Sonuç

Bu sistem ile:
- ✅ Hiç bozmadan geliştirme yapabilirsin
- ✅ Anında değişiklikleri görebilirsin  
- ✅ Production'a güvenle geçebilirsin
- ✅ Rollback yapabilirsin

**Happy Coding! 🚀**