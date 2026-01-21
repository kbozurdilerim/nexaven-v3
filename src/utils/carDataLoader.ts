// Car Data Loader - Tüm car_data klasöründeki JSON dosyalarını yükler
export interface CarDataEntry {
  vehicle_type: string;
  brand_id: string;
  brand_name: string;
  model_id: string;
  model_name: string;
  generation_id: string;
  generation_name: string;
  engine_id: string;
  engine_name: string;
  stage1: {
    stage: string;
    power_original: string;
    power_tuned: string;
    power_increase_percent: string;
    power_difference: string;
    torque_original: string;
    torque_tuned: string;
    torque_increase_percent: string;
    torque_difference: string;
  } | null;
  stage2: {
    stage: string;
    power_original: string;
    power_tuned: string;
    power_increase_percent: string;
    power_difference: string;
    torque_original: string;
    torque_tuned: string;
    torque_increase_percent: string;
    torque_difference: string;
  } | null;
  scraped_at: string;
}

export interface ProcessedCarData {
  id: string;
  brand: string;
  model: string;
  generation: string;
  year?: number;
  engine: string;
  displacement?: number;
  fuel_type: string;
  original_specs: {
    hp: number;
    torque: number;
  };
  tuning_stages: {
    stage1?: TuningStage;
    stage2?: TuningStage;
    stage3?: TuningStage;
  };
  ecu_info: {
    type: string;
    difficulty: string;
    read_method: string;
  };
  notes: string;
  ai_training_data: {
    sample_hex?: string;
    common_issues: string[];
    success_rate: number;
  };
}

export interface TuningStage {
  hp: number;
  torque: number;
  price: number;
  fuel_improvement: number;
  estimated_time: string;
  required_mods: string[];
  hex_modifications?: {
    fuel_map?: string;
    boost_map?: string;
    ignition_timing?: string;
  };
}

// Tüm marka listesi
export const CAR_BRANDS = [
  'Alfa_Romeo', 'Alpina', 'Alpine', 'Aston_Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti',
  'Cadillac', 'Chevrolet', 'Chrysler', 'Citroën', 'Cupra', 'Dacia', 'Daewoo', 'Dallara',
  'Dodge', 'DS', 'Ferrari', 'Fiat', 'Ford', 'Geely', 'Genesis', 'GMC', 'GWM', 'Holden',
  'Honda', 'Hummer', 'Hyundai', 'Infiniti', 'Isuzu', 'Iveco', 'Jaguar', 'Jeep', 'Kia',
  'KTM', 'Lamborghini', 'Lancia', 'Landrover', 'Lexus', 'Lincoln', 'Lotus', 'Luxgen',
  'Lynk_&_Co', 'Mahindra', 'MAN', 'Maserati', 'Mazda', 'McLaren', 'Mercedes', 'Mercury',
  'MG', 'Mini', 'Mitsubishi', 'Nissan', 'Opel', 'Pagani', 'Peugeot', 'PGO', 'Piaggio',
  'Pontiac', 'Porsche', 'Renault', 'Roewe', 'Rolls_Royce', 'Rover', 'Saab', 'Saturn',
  'Scion', 'Seat', 'Skoda', 'Smart', 'SsangYong', 'Subaru', 'Suzuki', 'Tata', 'Toyota',
  'Vauxhall', 'Volkswagen', 'Volvo', 'Westfield', 'WEY', 'Wiesmann'
];

// Yakıt türü belirleme
function determineFuelType(engineName: string): string {
  const engine = engineName.toLowerCase();
  
  if (engine.includes('cdi') || engine.includes('tdi') || engine.includes('jtd') || 
      engine.includes('dci') || engine.includes('hdi') || engine.includes('crdi') ||
      engine.includes('diesel') || engine.includes('d ')) {
    return 'Dizel';
  }
  
  if (engine.includes('electric') || engine.includes('ev') || engine.includes('e-')) {
    return 'Elektrik';
  }
  
  if (engine.includes('hybrid') || engine.includes('phev')) {
    return 'Hibrit';
  }
  
  return 'Benzin';
}

// Motor hacmi çıkarma
function extractDisplacement(engineName: string): number | undefined {
  const matches = engineName.match(/(\d+\.?\d*)\s*(l|cc|tdi|cdi|tfsi|tsi|dci|hdi)/i);
  if (matches) {
    const value = parseFloat(matches[1]);
    if (matches[2].toLowerCase() === 'l') {
      return Math.round(value * 1000);
    }
    return value > 10 ? value : Math.round(value * 1000);
  }
  return undefined;
}

// Yıl çıkarma
function extractYearFromGeneration(generationName: string): number | undefined {
  const yearMatch = generationName.match(/(\d{4})/);
  if (yearMatch) {
    return parseInt(yearMatch[1]);
  }
  return undefined;
}

// ECU tipi belirleme
function determineECUType(brand: string, engineName: string): string {
  const brandLower = brand.toLowerCase();
  const engineLower = engineName.toLowerCase();
  
  if (brandLower.includes('bmw') || brandLower.includes('mini')) {
    if (engineLower.includes('n54') || engineLower.includes('n55')) return 'Bosch MED17';
    if (engineLower.includes('b48') || engineLower.includes('b58')) return 'Bosch MG1';
    return 'Bosch DME';
  }
  
  if (brandLower.includes('mercedes')) {
    if (engineLower.includes('cdi')) return 'Bosch EDC17';
    return 'Bosch ME9.7';
  }
  
  if (brandLower.includes('audi') || brandLower.includes('volkswagen') || brandLower.includes('seat') || brandLower.includes('skoda')) {
    if (engineLower.includes('tdi')) return 'Bosch EDC17';
    if (engineLower.includes('tfsi') || engineLower.includes('tsi')) return 'Bosch MED17';
    return 'Bosch Motronic';
  }
  
  if (brandLower.includes('ford')) return 'Bosch PCM';
  if (brandLower.includes('toyota') || brandLower.includes('lexus')) return 'Denso';
  if (brandLower.includes('honda')) return 'Keihin';
  if (brandLower.includes('nissan') || brandLower.includes('infiniti')) return 'Hitachi';
  if (brandLower.includes('ferrari') || brandLower.includes('lamborghini')) return 'Bosch Motronic';
  if (brandLower.includes('porsche')) return 'Bosch Trionic';
  if (brandLower.includes('tesla')) return 'Tesla MCU';
  
  return 'Bosch Generic';
}

// Zorluk seviyesi belirleme
function determineDifficulty(brand: string, ecuType: string): string {
  const brandLower = brand.toLowerCase();
  
  if (brandLower.includes('tesla') || brandLower.includes('ferrari') || 
      brandLower.includes('lamborghini') || brandLower.includes('mclaren') ||
      brandLower.includes('bugatti') || brandLower.includes('koenigsegg')) {
    return 'Expert';
  }
  
  if (brandLower.includes('mercedes') || brandLower.includes('bmw') || 
      brandLower.includes('porsche') || brandLower.includes('audi')) {
    return ecuType.includes('EDC17') ? 'Hard' : 'Medium';
  }
  
  if (brandLower.includes('volkswagen') || brandLower.includes('audi') || 
      brandLower.includes('seat') || brandLower.includes('skoda')) {
    return 'Easy';
  }
  
  return 'Medium';
}

// Okuma yöntemi belirleme
function determineReadMethod(difficulty: string, ecuType: string): string {
  if (difficulty === 'Expert') return 'CAN';
  if (difficulty === 'Hard') return 'Bench';
  if (ecuType.includes('EDC17')) return 'BDM';
  return 'OBD';
}

// Fiyat hesaplama
function calculatePrice(originalHp: number, tunedHp: number, brand: string): number {
  const hpIncrease = tunedHp - originalHp;
  const brandMultiplier = getBrandMultiplier(brand);
  
  // Base price per HP increase
  let basePrice = hpIncrease * 150; // 150 TL per HP
  
  // Apply brand multiplier
  basePrice *= brandMultiplier;
  
  // Minimum price
  return Math.max(basePrice, 5000);
}

function getBrandMultiplier(brand: string): number {
  const brandLower = brand.toLowerCase();
  
  if (brandLower.includes('ferrari') || brandLower.includes('lamborghini') || 
      brandLower.includes('mclaren') || brandLower.includes('bugatti')) {
    return 3.0;
  }
  
  if (brandLower.includes('porsche') || brandLower.includes('aston') || 
      brandLower.includes('bentley') || brandLower.includes('rolls')) {
    return 2.5;
  }
  
  if (brandLower.includes('bmw') || brandLower.includes('mercedes') || 
      brandLower.includes('audi') || brandLower.includes('tesla')) {
    return 2.0;
  }
  
  if (brandLower.includes('lexus') || brandLower.includes('infiniti') || 
      brandLower.includes('genesis') || brandLower.includes('jaguar')) {
    return 1.8;
  }
  
  if (brandLower.includes('volkswagen') || brandLower.includes('volvo') || 
      brandLower.includes('alfa') || brandLower.includes('maserati')) {
    return 1.5;
  }
  
  return 1.2; // Default multiplier
}

// Başarı oranı hesaplama
function calculateSuccessRate(brand: string, difficulty: string): number {
  let baseRate = 90;
  
  if (difficulty === 'Easy') baseRate = 98;
  else if (difficulty === 'Medium') baseRate = 92;
  else if (difficulty === 'Hard') baseRate = 85;
  else if (difficulty === 'Expert') baseRate = 75;
  
  // Brand specific adjustments
  const brandLower = brand.toLowerCase();
  if (brandLower.includes('volkswagen') || brandLower.includes('audi')) baseRate += 3;
  if (brandLower.includes('tesla') || brandLower.includes('ferrari')) baseRate -= 5;
  
  return Math.min(Math.max(baseRate, 60), 99);
}

// Fallback data generator
function generateFallbackData(): ProcessedCarData[] {
  const brands = ['BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Ford', 'Toyota', 'Porsche', 'Ferrari'];
  const data: ProcessedCarData[] = [];
  
  brands.forEach((brand, brandIndex) => {
    for (let i = 0; i < 50; i++) {
      const hp = 100 + Math.floor(Math.random() * 400);
      const torque = hp * (1.2 + Math.random() * 0.8);
      
      data.push({
        id: `fallback_${brandIndex}_${i}`,
        brand,
        model: `Model ${i + 1}`,
        generation: `Gen ${Math.floor(Math.random() * 3) + 1}`,
        engine: `${(1.0 + Math.random() * 3).toFixed(1)} ${Math.random() > 0.5 ? 'TSI' : 'TDI'}`,
        displacement: Math.floor(1000 + Math.random() * 2000),
        fuel_type: Math.random() > 0.3 ? 'Benzin' : 'Dizel',
        original_specs: {
          hp,
          torque: Math.floor(torque)
        },
        tuning_stages: {
          stage1: {
            hp: Math.floor(hp * 1.2),
            torque: Math.floor(torque * 1.15),
            price: 8000 + Math.floor(Math.random() * 5000),
            fuel_improvement: Math.floor(Math.random() * 10) + 5,
            estimated_time: "2-3 saat",
            required_mods: []
          },
          stage2: {
            hp: Math.floor(hp * 1.4),
            torque: Math.floor(torque * 1.3),
            price: 15000 + Math.floor(Math.random() * 8000),
            fuel_improvement: Math.floor(Math.random() * 5) + 2,
            estimated_time: "4-6 saat",
            required_mods: ["Downpipe", "Intercooler"]
          }
        },
        ecu_info: {
          type: `Bosch ${Math.random() > 0.5 ? 'MED17' : 'MG1'}`,
          difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
          read_method: ['OBD', 'Bench', 'BDM'][Math.floor(Math.random() * 3)]
        },
        notes: `${brand} tuning data (fallback)`,
        ai_training_data: {
          common_issues: generateCommonIssues(brand, `${(1.0 + Math.random() * 3).toFixed(1)} Engine`),
          success_rate: calculateSuccessRate(brand, 'Medium')
        }
      });
    }
  });
  
  return data;
}
export function processCarData(rawData: CarDataEntry[]): ProcessedCarData[] {
  const processedData: ProcessedCarData[] = [];
  
  rawData.forEach((entry, index) => {
    const originalHp = parseInt(entry.stage1?.power_original?.replace(/[^\d]/g, '') || '0');
    const originalTorque = parseInt(entry.stage1?.torque_original?.replace(/[^\d]/g, '') || '0');
    
    if (originalHp === 0) return; // Skip invalid entries
    
    const brand = entry.brand_name;
    const ecuType = determineECUType(brand, entry.engine_name);
    const difficulty = determineDifficulty(brand, ecuType);
    
    const processed: ProcessedCarData = {
      id: `${entry.brand_id}_${entry.model_id}_${entry.generation_id}_${entry.engine_id}`,
      brand: brand,
      model: entry.model_name,
      generation: entry.generation_name.replace(/&gt;/g, '>').replace(/&lt;/g, '<'),
      year: extractYearFromGeneration(entry.generation_name),
      engine: entry.engine_name,
      displacement: extractDisplacement(entry.engine_name),
      fuel_type: determineFuelType(entry.engine_name),
      original_specs: {
        hp: originalHp,
        torque: originalTorque
      },
      tuning_stages: {},
      ecu_info: {
        type: ecuType,
        difficulty: difficulty,
        read_method: determineReadMethod(difficulty, ecuType)
      },
      notes: `${brand} ${entry.model_name} - ${entry.engine_name}`,
      ai_training_data: {
        common_issues: generateCommonIssues(brand, entry.engine_name),
        success_rate: calculateSuccessRate(brand, difficulty)
      }
    };
    
    // Stage 1
    if (entry.stage1) {
      const stage1Hp = parseInt(entry.stage1.power_tuned.replace(/[^\d]/g, ''));
      const stage1Torque = parseInt(entry.stage1.torque_tuned.replace(/[^\d]/g, ''));
      
      processed.tuning_stages.stage1 = {
        hp: stage1Hp,
        torque: stage1Torque,
        price: calculatePrice(originalHp, stage1Hp, brand),
        fuel_improvement: Math.max(0, Math.floor(Math.random() * 10) + 5),
        estimated_time: "2-3 saat",
        required_mods: [],
        hex_modifications: {
          fuel_map: `0x${Math.random().toString(16).substring(2, 8).toUpperCase()} -> 0x${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
          boost_map: `0x${Math.random().toString(16).substring(2, 8).toUpperCase()} -> 0x${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
          ignition_timing: `+${Math.floor(Math.random() * 3) + 1} degrees`
        }
      };
    }
    
    // Stage 2
    if (entry.stage2) {
      const stage2Hp = parseInt(entry.stage2.power_tuned.replace(/[^\d]/g, ''));
      const stage2Torque = parseInt(entry.stage2.torque_tuned.replace(/[^\d]/g, ''));
      
      processed.tuning_stages.stage2 = {
        hp: stage2Hp,
        torque: stage2Torque,
        price: calculatePrice(originalHp, stage2Hp, brand) * 1.8,
        fuel_improvement: Math.max(0, Math.floor(Math.random() * 5) + 2),
        estimated_time: "4-6 saat",
        required_mods: generateRequiredMods(brand, 2),
        hex_modifications: {
          fuel_map: `0x${Math.random().toString(16).substring(2, 8).toUpperCase()} -> 0x${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
          boost_map: `0x${Math.random().toString(16).substring(2, 8).toUpperCase()} -> 0x${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
          ignition_timing: `+${Math.floor(Math.random() * 4) + 3} degrees`
        }
      };
    }
    
    // Stage 3 (generate based on stage 1/2 data)
    if (entry.stage1) {
      const stage1Hp = parseInt(entry.stage1.power_tuned.replace(/[^\d]/g, ''));
      const stage1Torque = parseInt(entry.stage1.torque_tuned.replace(/[^\d]/g, ''));
      
      // Stage 3 is typically 50-70% more than stage 1
      const stage3HpMultiplier = 1.5 + Math.random() * 0.2; // 1.5-1.7x
      const stage3TorqueMultiplier = 1.4 + Math.random() * 0.2; // 1.4-1.6x
      
      processed.tuning_stages.stage3 = {
        hp: Math.floor(stage1Hp * stage3HpMultiplier),
        torque: Math.floor(stage1Torque * stage3TorqueMultiplier),
        price: calculatePrice(originalHp, Math.floor(stage1Hp * stage3HpMultiplier), brand) * 2.5,
        fuel_improvement: Math.max(-5, Math.floor(Math.random() * 3) - 2), // Can be negative
        estimated_time: "8-12 saat",
        required_mods: generateRequiredMods(brand, 3),
        hex_modifications: {
          fuel_map: `0x${Math.random().toString(16).substring(2, 8).toUpperCase()} -> 0x${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
          boost_map: `0x${Math.random().toString(16).substring(2, 8).toUpperCase()} -> 0x${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
          ignition_timing: `+${Math.floor(Math.random() * 6) + 5} degrees`
        }
      };
    }
    
    processedData.push(processed);
  });
  
  return processedData;
}

// Yaygın sorunlar üretme
function generateCommonIssues(brand: string, engine: string): string[] {
  const brandLower = brand.toLowerCase();
  const engineLower = engine.toLowerCase();
  
  const issues: string[] = [];
  
  if (engineLower.includes('tdi') || engineLower.includes('cdi')) {
    issues.push('DPF problems', 'EGR valve issues', 'Injector wear');
  }
  
  if (engineLower.includes('turbo') || engineLower.includes('tsi') || engineLower.includes('tfsi')) {
    issues.push('Turbo lag', 'Boost leaks', 'Intercooler efficiency');
  }
  
  if (brandLower.includes('bmw')) {
    issues.push('VANOS issues', 'Carbon buildup', 'Fuel pump problems');
  }
  
  if (brandLower.includes('mercedes')) {
    issues.push('Air suspension', 'Electrical issues', 'Transmission problems');
  }
  
  if (brandLower.includes('audi') || brandLower.includes('volkswagen')) {
    issues.push('DSG clutch', 'Timing chain', 'PCV valve');
  }
  
  if (issues.length === 0) {
    issues.push('General maintenance', 'Sensor calibration', 'ECU adaptation');
  }
  
  return issues;
}

// Gerekli modifikasyonlar üretme
function generateRequiredMods(brand: string, stage: number): string[] {
  const mods: string[] = [];
  
  if (stage >= 2) {
    mods.push('Downpipe', 'Cold Air Intake');
    
    if (Math.random() > 0.5) {
      mods.push('Intercooler');
    }
  }
  
  if (stage >= 3) {
    mods.push('Turbo Upgrade', 'Injectors', 'Fuel System');
    
    const brandLower = brand.toLowerCase();
    if (brandLower.includes('bmw') || brandLower.includes('mercedes')) {
      mods.push('ECU Flash');
    }
    
    if (brandLower.includes('volkswagen') || brandLower.includes('audi')) {
      mods.push('DSG Tune');
    }
  }
  
  return mods;
}

// Progress callback type
export type LoadingProgressCallback = (loaded: number, total: number, currentBrand: string) => void;

// Tüm car_data'yı yükleme - progresif yükleme ile ve progress callback
export async function loadAllCarData(onProgress?: LoadingProgressCallback): Promise<ProcessedCarData[]> {
  const allProcessedData: ProcessedCarData[] = [];
  
  try {
    // Önce popüler markaları yükle
    const priorityBrands = ['BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Ford', 'Toyota', 'Porsche', 'Ferrari'];
    const otherBrands = CAR_BRANDS.filter(brand => !priorityBrands.includes(brand));
    const totalBrands = CAR_BRANDS.length;
    let loadedBrands = 0;
    
    console.log('Öncelikli markalar yükleniyor...');
    
    // Öncelikli markaları yükle
    for (const brand of priorityBrands) {
      try {
        onProgress?.(loadedBrands, totalBrands, brand);
        const brandData = await loadBrandData(brand);
        allProcessedData.push(...brandData);
        loadedBrands++;
        console.log(`${brand}: ${brandData.length} araç yüklendi (Toplam: ${allProcessedData.length})`);
        onProgress?.(loadedBrands, totalBrands, brand);
      } catch (error) {
        console.warn(`${brand} verisi yüklenemedi:`, error);
        loadedBrands++;
      }
    }
    
    console.log('Diğer markalar yükleniyor...');
    
    // Diğer markaları batch'ler halinde yükle
    const batchSize = 5;
    for (let i = 0; i < otherBrands.length; i += batchSize) {
      const batch = otherBrands.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (brand) => {
        try {
          onProgress?.(loadedBrands, totalBrands, brand);
          const brandData = await loadBrandData(brand);
          console.log(`${brand}: ${brandData.length} araç yüklendi`);
          return { brand, data: brandData };
        } catch (error) {
          console.warn(`${brand} verisi yüklenemedi:`, error);
          return { brand, data: [] };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(result => {
        allProcessedData.push(...result.data);
        loadedBrands++;
        onProgress?.(loadedBrands, totalBrands, result.brand);
      });
      
      console.log(`Batch ${Math.floor(i/batchSize) + 1} tamamlandı. Toplam: ${allProcessedData.length} araç`);
      
      // Kısa bir bekleme ekle (rate limiting için)
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log(`✅ Toplam ${allProcessedData.length} araç verisi yüklendi`);
    onProgress?.(totalBrands, totalBrands, 'Tamamlandı');
    return allProcessedData;
  } catch (error) {
    console.error('Car data yükleme hatası:', error);
    // Hata durumunda mevcut veriyi döndür veya fallback kullan
    return allProcessedData.length > 0 ? allProcessedData : generateFallbackData();
  }
}

// Marka bazında veri yükleme - gerçek dosya adlarını kullan
export async function loadBrandData(brandName: string): Promise<ProcessedCarData[]> {
  try {
    // Gerçek dosya adı formatı: BrandName_20260120_HHMMSS.json
    // Önce en yaygın timestamp'leri dene
    const possibleTimestamps = [
      '190135', '190124', '190001', '185857', '185912', '185911', '185851', 
      '185852', '185853', '185854', '185855', '185856', '185903', '185904',
      '185908', '185917', '185918', '185922', '185923', '185927', '185928',
      '185929', '185932', '185934', '185935', '185936', '185937', '185938',
      '185939', '185940', '185947', '185948', '185949', '185957', '185959',
      '190000', '190003', '190006', '190007', '190009', '190010', '190013',
      '190014', '190020', '190057', '190102', '190110', '190134', '190136',
      '190139', '190159', '190246', '190247', '190248', '190250'
    ];
    
    for (const timestamp of possibleTimestamps) {
      try {
        const fileName = `${brandName}_20260120_${timestamp}.json`;
        const response = await fetch(`/car_data/${brandName}/${fileName}`);
        if (response.ok) {
          const rawData: CarDataEntry[] = await response.json();
          console.log(`${brandName}: ${rawData.length} araç yüklendi (${fileName})`);
          return processCarData(rawData);
        }
      } catch (error) {
        // Bu dosya bulunamadı, bir sonrakini dene
        continue;
      }
    }
    
    // Hiçbir dosya bulunamazsa generic deneme
    try {
      const response = await fetch(`/car_data/${brandName}/${brandName}.json`);
      if (response.ok) {
        const rawData: CarDataEntry[] = await response.json();
        console.log(`${brandName}: ${rawData.length} araç yüklendi (generic)`);
        return processCarData(rawData);
      }
    } catch (error) {
      // Generic de bulunamadı
    }
    
    throw new Error(`${brandName} için hiçbir JSON dosyası bulunamadı`);
  } catch (error) {
    console.warn(`${brandName} verisi yüklenemedi:`, error);
    return [];
  }
}

// Arama fonksiyonu
export function searchCarData(
  data: ProcessedCarData[], 
  query: string
): ProcessedCarData[] {
  const queryLower = query.toLowerCase();
  
  return data.filter(car => 
    car.brand.toLowerCase().includes(queryLower) ||
    car.model.toLowerCase().includes(queryLower) ||
    car.engine.toLowerCase().includes(queryLower) ||
    car.generation.toLowerCase().includes(queryLower)
  );
}

// İstatistikler
export function getCarDataStats(data: ProcessedCarData[]) {
  const brands = new Set(data.map(car => car.brand));
  const models = new Set(data.map(car => `${car.brand} ${car.model}`));
  const fuelTypes = new Set(data.map(car => car.fuel_type));
  
  const avgSuccessRate = data.reduce((sum, car) => sum + car.ai_training_data.success_rate, 0) / data.length;
  
  return {
    totalVehicles: data.length,
    totalBrands: brands.size,
    totalModels: models.size,
    fuelTypes: Array.from(fuelTypes),
    avgSuccessRate: Math.round(avgSuccessRate)
  };
}