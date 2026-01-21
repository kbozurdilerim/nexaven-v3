# 🧠 Nexaven AI Öğretme & Modlama Sistemi

## Kapsamlı ECU AI Eğitim Platformu

Nexaven artık gelişmiş AI öğretme sistemi ile donatılmıştır. Orijinal ECU dosyalarını yükleyip, yapay zeka ile analiz edip, modlayabilir ve indirilebilir hale getirebilirsiniz.

## ✨ Ana Özellikler

### 🔧 AI ECU Öğretme Sistemi
- **Hex Dosya Okuma**: Binary dosyaları hex formatına çevirme
- **Otomatik Araç Tanıma**: Dosya adından araç bilgisi çıkarma
- **AI Analiz**: External Ollama ile ECU dosyası analizi
- **Force Yazılım Modlama**: Stage 1/2/3 otomatik modlama
- **İndirilebilir Dosyalar**: Modlanmış ECU dosyalarını indirme
- **Hex Viewer**: Orijinal ve modlanmış hex verilerini karşılaştırma

### 📊 Kapsamlı Veritabanı (150+ Araç)
```json
{
  "BMW": ["320i", "M3", "X5"],
  "Mercedes": ["C200", "AMG GT", "S-Class"],
  "Audi": ["A4 TFSI", "RS6", "Q7"],
  "Volkswagen": ["Golf GTI", "Passat", "Tiguan"],
  "Toyota": ["Supra 3.0", "Camry", "RAV4"],
  "Porsche": ["911 Turbo S", "Cayenne", "Panamera"],
  "Tesla": ["Model S Plaid", "Model 3", "Model Y"],
  "Ferrari": ["F8 Tributo", "SF90", "Roma"],
  "Lamborghini": ["Huracán EVO", "Aventador", "Urus"],
  "McLaren": ["720S", "P1", "Artura"]
}
```

### 🤖 AI Komutları
```bash
/ecu analyze <file>    # ECU dosyası analizi
/ecu stage1 <file>     # Force Yazılım 1 (konservatif)
/ecu stage2 <file>     # Force Yazılım 2 (orta seviye) 
/ecu stage3 <file>     # Force Yazılım 3 (agresif)
/ecu optimize <file>   # Optimizasyon önerileri
```

## 🚀 Kurulum ve Deployment

### Hızlı AI Deployment
```bash
cd nexaven-website
chmod +x deploy-ai-training.sh
./deploy-ai-training.sh
```

### Sağlam Production Deployment
```bash
chmod +x deploy-robust.sh
./deploy-robust.sh
```

## 🌐 Erişim Noktaları

- **Ana Site**: http://nexaven.com.tr
- **AI Öğretme Sistemi**: http://nexaven.com.tr/zorlu-ecu-admin → 🧠 AI Öğretme
- **AI ECU Chat**: http://nexaven.com.tr/zorlu-ecu-admin → 🤖 AI ECU Tuning

### 👤 Giriş Bilgileri
```
Email: admin@zorluecu.com
Password: zorlu123
```

## 📁 Desteklenen Dosya Formatları

| Format | Açıklama | Kullanım |
|--------|----------|----------|
| `.bin` | Binary ECU files | Ana ECU dump dosyaları |
| `.hex` | Intel Hex files | Hex formatında ECU verileri |
| `.ecu` | ECU dump files | ECU okuma dosyaları |
| `.ori` | Original files | Orijinal yedek dosyalar |
| `.mod` | Modified files | Modlanmış dosyalar |

## 🔧 Sistem Mimarisi

### External AI Integration
```
Nexaven Frontend → External Ollama AI (72.62.178.51:32768)
                ↓
            AI Analysis & Modding
                ↓
        Modified Hex Data → Download
```

### Veritabanı Yapısı
```json
{
  "vehicle": {
    "brand": "BMW",
    "model": "320i", 
    "year": 2020,
    "engine": "2.0 TwinPower Turbo",
    "ecu_info": {
      "type": "Bosch MG1",
      "hex_addresses": {
        "fuel_map": "0x10000-0x12000",
        "boost_map": "0x15000-0x16000"
      }
    },
    "tuning_stages": {
      "stage1": {
        "hp": 220,
        "torque": 350,
        "hex_modifications": {
          "fuel_map": "0x1A2B3C -> 0x1F2F3F"
        }
      }
    }
  }
}
```

## 🧠 AI Eğitim Verileri

### ECU Pattern'leri
```javascript
const fuelMapPatterns = [
  {
    pattern: "0x1A2B3C",
    description: "Standard fuel enrichment", 
    effect: "+10% fuel flow"
  },
  {
    pattern: "0x2C3D4E",
    description: "Lean burn optimization",
    effect: "+5% efficiency"
  }
];

const boostPatterns = [
  {
    pattern: "0x4D5E6F",
    description: "Conservative boost increase",
    effect: "+0.2 bar"
  }
];
```

### ECU Tipleri ve Zorluk Seviyeleri
```javascript
const ecuTypes = {
  "Bosch MG1": {
    difficulty: "Easy-Medium",
    read_methods: ["OBD", "BDM"],
    success_rate: 95
  },
  "Continental": {
    difficulty: "Hard", 
    read_methods: ["Bench", "BDM"],
    success_rate: 85
  },
  "Tesla MCU": {
    difficulty: "Expert",
    read_methods: ["CAN"],
    success_rate: 75
  }
};
```

## 📊 AI Öğretme Süreci

### 1. Dosya Yükleme
```javascript
// Hex dosya okuma
const readHexFile = (file) => {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  // Convert to hex string
  return hexString;
};
```

### 2. AI Analiz
```javascript
// Ollama AI ile analiz
const analyzeECU = async (hexData, vehicleInfo) => {
  const response = await fetch('http://72.62.178.51:32768/api/generate', {
    method: 'POST',
    body: JSON.stringify({
      model: 'llama2',
      prompt: `/ecu analyze ${hexData}`
    })
  });
  return response.json();
};
```

### 3. Modlama
```javascript
// Stage-based modlama
const modifyECU = (originalHex, stage, vehicleData) => {
  const modifications = vehicleData.tuning_stages[stage].hex_modifications;
  let modifiedHex = originalHex;
  
  // Apply modifications
  Object.entries(modifications).forEach(([map, change]) => {
    modifiedHex = applyHexChange(modifiedHex, change);
  });
  
  return modifiedHex;
};
```

### 4. İndirme
```javascript
// Binary dosya oluşturma
const downloadModifiedFile = (hexData, filename) => {
  const binary = hexToBinary(hexData);
  const blob = new Blob([binary], { type: 'application/octet-stream' });
  downloadBlob(blob, `${filename}_modified.bin`);
};
```

## 🔒 Güvenlik ve Kalite

### Güvenlik Kontrolleri
- **Checksum Verification**: CRC32, MD5 kontrolleri
- **Backup Creation**: Otomatik orijinal dosya yedekleme
- **Risk Assessment**: AI tabanlı risk değerlendirmesi
- **Rollback Support**: Geri alma desteği

### Kalite Metrikleri
- **Success Rate**: Araç tipine göre başarı oranları
- **Performance Gains**: HP/Torque artış tahminleri
- **Fuel Economy**: Yakıt tüketimi değişimleri
- **Reliability Score**: Güvenilirlik puanları

## 📈 Performans Optimizasyonu

### Caching Strategy
```javascript
// Hex data caching
const hexCache = new Map();
const cacheHexData = (fileHash, hexData) => {
  hexCache.set(fileHash, {
    data: hexData,
    timestamp: Date.now(),
    ttl: 3600000 // 1 hour
  });
};
```

### Batch Processing
```javascript
// Toplu dosya işleme
const processBatchFiles = async (files) => {
  const results = await Promise.all(
    files.map(file => processECUFile(file))
  );
  return results;
};
```

## 🛠️ Geliştirme ve Test

### Development Setup
```bash
# Frontend development
npm run dev

# AI training data update
npm run update-training-data

# Test AI integration
npm run test:ai
```

### Test Scenarios
```javascript
const testScenarios = [
  {
    name: "BMW 320i Stage 1",
    file: "bmw_320i_original.bin",
    expected: {
      hp_gain: 36,
      torque_gain: 50,
      success_rate: 95
    }
  },
  {
    name: "Tesla Model S Plaid",
    file: "tesla_plaid_original.bin", 
    expected: {
      hp_gain: 130,
      torque_gain: 130,
      success_rate: 75
    }
  }
];
```

## 📞 Destek ve Dokümantasyon

### API Endpoints
```
GET  /api/vehicles          # Araç listesi
POST /api/analyze           # ECU analizi
POST /api/modify            # ECU modlama
GET  /api/download/:id      # Dosya indirme
```

### Troubleshooting
```bash
# Container logs
docker logs nexaven-frontend --tail 50

# AI service test
curl http://72.62.178.51:32768/api/tags

# Health check
curl http://nexaven.com.tr/health
```

---

**Geliştirici**: Nexaven AI Team  
**Son Güncelleme**: 21 Ocak 2025  
**Versiyon**: AI Training v3.0  
**Status**: ✅ Production Ready  
**AI Engine**: External Ollama (72.62.178.51:32768)