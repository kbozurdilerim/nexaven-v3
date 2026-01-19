# Force Yazılım - Chiptuning Database

Bu klasör Force Yazılım chiptuning uygulaması için gerekli tüm veri dosyalarını içerir.

## Dosya Yapısı

### 1. chiptuning-database.json
Ana veritabanı dosyası. 15 popüler araç modelini içerir:
- BMW, Mercedes-Benz, Audi, Volkswagen
- Ford, Toyota, Porsche, Nissan
- Tesla, Lamborghini, McLaren, Ferrari
- Bugatti, Koenigsegg, Pagani

### 2. extended-database.json
Genişletilmiş veritabanı. Ek 15 araç modeli:
- Subaru, Mitsubishi, Honda, Hyundai
- Alfa Romeo, Jaguar, Maserati, Bentley
- Aston Martin, Rolls-Royce
- Çin markaları: BYD, NIO, Geely
- Hint markaları: Tata, Mahindra

### 3. chiptuning-prices.csv
CSV formatında fiyat listesi. Tüm araçların:
- Orijinal güç değerleri
- Stage 1, 2, 3 güç artışları
- Fiyat bilgileri
- Zorluk seviyeleri

## Veri Yapısı

Her araç için şu bilgiler bulunur:

```json
{
  "id": 1,
  "brand": "BMW",
  "model": "320i",
  "year": 2020,
  "engine": "2.0 TwinPower Turbo",
  "displacement": 1998,
  "fuel_type": "Benzin",
  "original_specs": {
    "hp": 184,
    "torque": 300,
    "fuel_consumption": 6.8
  },
  "tuning_stages": {
    "stage1": {
      "hp": 220,
      "torque": 350,
      "price": 8500,
      "fuel_improvement": 8,
      "estimated_time": "2-3 saat",
      "required_mods": []
    }
  },
  "ecu_info": {
    "type": "Bosch MG1",
    "difficulty": "Medium",
    "read_method": "OBD"
  },
  "notes": "Popüler model, güvenilir Force yazılım"
}
```

## Force Yazılım Seviyeleri

### Stage 1 (Yazılım Only)
- Sadece ECU yazılım güncellemesi
- %15-25 güç artışı
- Yakıt ekonomisi iyileştirmesi
- Ek donanım gerektirmez

### Stage 2 (Yazılım + Temel Modlar)
- ECU yazılım + temel modifikasyonlar
- %25-40 güç artışı
- Downpipe, intercooler, intake gerekli
- Orta seviye performans artışı

### Stage 3 (Full Build)
- Kapsamlı modifikasyonlar
- %40-60+ güç artışı
- Turbo upgrade, fuel system, internals
- Maksimum performans

## Zorluk Seviyeleri

- **Easy**: OBD okuma/yazma, standart protokol
- **Medium**: Bench okuma gerekebilir, orta zorluk
- **Hard**: Bench okuma/yazma, özel protokol
- **Expert**: İleri seviye teknik bilgi gerekli
- **Master**: En yüksek seviye uzmanlık

## Fiyat Aralıkları (TRY)

- **Stage 1**: 6.500 - 60.000 TL
- **Stage 2**: 12.000 - 120.000 TL  
- **Stage 3**: 22.000 - 250.000 TL

Fiyatlar araç segmenti ve zorluk seviyesine göre değişir.

## Desteklenen Markalar

### Mainstream Brands
BMW, Mercedes-Benz, Audi, Volkswagen, Ford, Toyota, Honda, Hyundai

### Premium Brands  
Porsche, Jaguar, Maserati, Bentley, Aston Martin, Rolls-Royce

### Supercar/Hypercar Brands
Lamborghini, McLaren, Ferrari, Bugatti, Koenigsegg, Pagani

### Electric Brands
Tesla, BYD, NIO, Tata

### Performance Brands
Subaru, Mitsubishi, Alfa Romeo, Nissan

### Emerging Markets
Geely, Mahindra, Tata

## Kullanım

Bu veri dosyaları Force Yazılım chiptuning uygulaması tarafından otomatik olarak yüklenir. Manuel müdahale gerektirmez.

Uygulama başlatıldığında:
1. Ana database yüklenir
2. Extended database birleştirilir  
3. API endpoints aktif hale gelir
4. Web arayüzü veri ile beslenir

## Güncelleme

Veri dosyaları düzenli olarak güncellenir:
- Yeni araç modelleri eklenir
- Fiyat güncellemeleri yapılır
- Yeni Force yazılım seçenekleri eklenir
- ECU bilgileri güncellenir

---

**Force Yazılım © 2026 - Zorlu ECU Chiptuning Solutions**