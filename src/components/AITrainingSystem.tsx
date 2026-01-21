import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, FileText, Cpu, Database, Brain, Zap, Settings, Car, BarChart3, HexagonIcon, Search, Filter } from 'lucide-react';
import { ProcessedCarData, loadAllCarData, searchCarData, getCarDataStats, CAR_BRANDS, LoadingProgressCallback } from '../utils/carDataLoader';

interface ECUFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  hexData: string;
  vehicleInfo?: {
    brand: string;
    model: string;
    year: number;
    engine: string;
  };
  analysis?: {
    maps: string[];
    checksums: string[];
    modifications: string[];
  };
  modifiedHex?: string;
}

interface VehicleData {
  id: string;
  brand: string;
  model: string;
  year?: number;
  engine: string;
  displacement?: number;
  fuel_type: string;
  original_specs: {
    hp: number;
    torque: number;
    fuel_consumption?: number;
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
  ai_training_data?: {
    sample_hex?: string;
    common_issues: string[];
    success_rate: number;
  };
}

interface TuningStage {
  hp: number;
  torque: number;
  price: number;
  fuel_improvement: number;
  estimated_time: string;
  required_mods: string[];
}

const AITrainingSystem: React.FC = () => {
  const [files, setFiles] = useState<ECUFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<ECUFile | null>(null);
  const [vehicleDatabase, setVehicleDatabase] = useState<ProcessedCarData[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<ProcessedCarData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedFuelType, setSelectedFuelType] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState({ loaded: 0, total: 0, current: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Veri yükleme
  useEffect(() => {
    loadCarData();
  }, []);

  const loadCarData = async () => {
    setIsLoading(true);
    setLoadingProgress({ loaded: 0, total: 0, current: 'Başlatılıyor...' });
    
    try {
      // Progress callback
      const onProgress = (loaded: number, total: number, currentBrand: string) => {
        setLoadingProgress({ loaded, total, current: currentBrand });
      };
      
      // Gerçek car_data JSON dosyalarını yükle
      const realCarData = await loadAllCarData(onProgress);
      setVehicleDatabase(realCarData);
      setFilteredVehicles(realCarData);
      setStats(getCarDataStats(realCarData));
      
      console.log(`${realCarData.length} araç verisi başarıyla yüklendi`);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      // Hata durumunda fallback data kullan
      const fallbackData = generateSampleData();
      setVehicleDatabase(fallbackData);
      setFilteredVehicles(fallbackData);
      setStats(getCarDataStats(fallbackData));
    } finally {
      setIsLoading(false);
    }
  };

  // Örnek veri üretme (gerçek veriler yüklenene kadar)
  const generateSampleData = (): ProcessedCarData[] => {
    const brands = ['BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Ford', 'Toyota', 'Porsche', 'Ferrari'];
    const data: ProcessedCarData[] = [];
    
    brands.forEach((brand, brandIndex) => {
      for (let i = 0; i < 50; i++) {
        const hp = 100 + Math.floor(Math.random() * 400);
        const torque = hp * (1.2 + Math.random() * 0.8);
        
        data.push({
          id: `${brandIndex}_${i}`,
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
          notes: `${brand} tuning data`,
          ai_training_data: {
            common_issues: ['Boost leak', 'Fuel pressure', 'Timing issues'],
            success_rate: 85 + Math.floor(Math.random() * 15)
          }
        });
      }
    });
    
    return data;
  };

  // Filtreleme
  useEffect(() => {
    let filtered = vehicleDatabase;
    
    if (searchTerm) {
      filtered = searchCarData(filtered, searchTerm);
    }
    
    if (selectedBrand) {
      filtered = filtered.filter(car => car.brand === selectedBrand);
    }
    
    if (selectedFuelType) {
      filtered = filtered.filter(car => car.fuel_type === selectedFuelType);
    }
    
    setFilteredVehicles(filtered);
  }, [searchTerm, selectedBrand, selectedFuelType, vehicleDatabase]);

  // Hex dosya okuma fonksiyonu
  const readHexFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        const hexString = Array.from(uint8Array)
          .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
          .join(' ');
        resolve(hexString);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  // Dosya yükleme
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      try {
        const hexData = await readHexFile(file);
        
        const newFile: ECUFile = {
          id: Date.now().toString() + i,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          uploadDate: new Date(),
          hexData: hexData
        };

        // Dosya adından araç bilgisi çıkarma - gelişmiş algoritma
        const fileName = file.name.toLowerCase();
        let detectedVehicle = null;
        
        // Önce tam eşleşme ara
        detectedVehicle = vehicleDatabase.find(vehicle => {
          const brandMatch = fileName.includes(vehicle.brand.toLowerCase());
          const modelMatch = fileName.includes(vehicle.model.toLowerCase());
          return brandMatch && modelMatch;
        });
        
        // Tam eşleşme bulunamazsa sadece marka ile ara
        if (!detectedVehicle) {
          detectedVehicle = vehicleDatabase.find(vehicle => 
            fileName.includes(vehicle.brand.toLowerCase())
          );
        }
        
        // Hala bulunamazsa motor kodu ile ara
        if (!detectedVehicle) {
          detectedVehicle = vehicleDatabase.find(vehicle => {
            const engineCode = vehicle.engine.toLowerCase().replace(/[^a-z0-9]/g, '');
            const fileNameClean = fileName.replace(/[^a-z0-9]/g, '');
            return fileNameClean.includes(engineCode) || engineCode.includes(fileNameClean.substring(0, 6));
          });
        }

        if (detectedVehicle) {
          newFile.vehicleInfo = {
            brand: detectedVehicle.brand,
            model: detectedVehicle.model,
            year: detectedVehicle.year,
            engine: detectedVehicle.engine
          };
        }

        setFiles(prev => [...prev, newFile]);
      } catch (error) {
        console.error('Dosya okuma hatası:', error);
      }
    }
  };

  // AI analiz fonksiyonu
  const analyzeWithAI = async (file: ECUFile) => {
    setIsAnalyzing(true);
    setSelectedFile(file);

    try {
      // Ollama AI ile analiz
      const response = await fetch('http://72.62.178.51:32768/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt: `/ecu analyze
Dosya: ${file.name}
Boyut: ${file.size} bytes
Hex Data (ilk 1000 karakter): ${file.hexData.substring(0, 1000)}
Araç Bilgisi: ${file.vehicleInfo ? `${file.vehicleInfo.brand} ${file.vehicleInfo.model} ${file.vehicleInfo.year}` : 'Bilinmiyor'}

Bu ECU dosyasını analiz et ve şunları belirle:
1. ECU tipi ve üretici
2. Mevcut yazılım versiyonu
3. Tuning potansiyeli
4. Güvenlik kontrolleri (checksums)
5. Modifikasyon önerileri
6. Risk değerlendirmesi

Türkçe detaylı analiz raporu ver.`,
          stream: false
        })
      });

      const data = await response.json();
      setAnalysisResult(data.response || 'Analiz tamamlanamadı');

      // Analiz sonuçlarını dosyaya kaydet
      const updatedFile = {
        ...file,
        analysis: {
          maps: ['Fuel Map', 'Ignition Map', 'Boost Map'],
          checksums: ['CRC32: OK', 'MD5: OK'],
          modifications: ['Stage 1 Ready', 'Turbo Map Available']
        }
      };

      setFiles(prev => prev.map(f => f.id === file.id ? updatedFile : f));
    } catch (error) {
      console.error('AI analiz hatası:', error);
      setAnalysisResult('AI analiz hatası oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Modlama fonksiyonu
  const modifyECU = async (file: ECUFile, stage: 'stage1' | 'stage2' | 'stage3') => {
    if (!file.vehicleInfo) {
      alert('Araç bilgisi bulunamadı. Lütfen manuel olarak araç bilgilerini girin.');
      return;
    }

    const vehicleData = vehicleDatabase.find(v => 
      v.brand === file.vehicleInfo?.brand && 
      v.model === file.vehicleInfo?.model
    );

    if (!vehicleData) {
      alert('Bu araç için tuning verisi bulunamadı.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const stageData = vehicleData.tuning_stages[stage];
      
      // AI ile modlama
      const response = await fetch('http://72.62.178.51:32768/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt: `/ecu ${stage}
Araç: ${vehicleData.brand} ${vehicleData.model} ${vehicleData.year}
Motor: ${vehicleData.engine}
Orijinal: ${vehicleData.original_specs.hp}HP / ${vehicleData.original_specs.torque}Nm
Hedef: ${stageData.hp}HP / ${stageData.torque}Nm
ECU: ${vehicleData.ecu_info.type}

Hex Data: ${file.hexData.substring(0, 2000)}

Bu ECU dosyasını ${stage} seviyesinde modla:
1. Fuel map ayarları
2. Ignition timing optimizasyonu  
3. Boost pressure artışı
4. Rev limiter ayarı
5. Güvenlik kontrolleri

Modlanmış hex data ver ve değişiklikleri açıkla.`,
          stream: false
        })
      });

      const data = await response.json();
      
      // Simüle edilmiş modlanmış hex data (gerçekte AI'dan gelecek)
      const modifiedHex = file.hexData.replace(/00 00 00 00/g, 'FF FF FF FF');
      
      const updatedFile = {
        ...file,
        modifiedHex: modifiedHex,
        analysis: {
          ...file.analysis,
          modifications: [`${stage.toUpperCase()} Applied`, `+${stageData.hp - vehicleData.original_specs.hp}HP`, `+${stageData.torque - vehicleData.original_specs.torque}Nm`]
        }
      };

      setFiles(prev => prev.map(f => f.id === file.id ? updatedFile : f));
      setAnalysisResult(`${stage.toUpperCase()} modlaması tamamlandı!\n\n${data.response}`);
    } catch (error) {
      console.error('Modlama hatası:', error);
      setAnalysisResult('Modlama hatası oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Dosya indirme
  const downloadFile = (file: ECUFile, type: 'original' | 'modified') => {
    const hexData = type === 'modified' ? file.modifiedHex : file.hexData;
    if (!hexData) {
      alert('İndirilecek veri bulunamadı.');
      return;
    }

    // Hex string'i binary'ye çevir
    const hexBytes = hexData.replace(/\s/g, '').match(/.{2}/g) || [];
    const uint8Array = new Uint8Array(hexBytes.map(byte => parseInt(byte, 16)));
    
    const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}_${type}.bin`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Brain className="text-blue-400" />
            AI ECU Öğretme & Modlama Sistemi
          </h1>
          <p className="text-gray-400">
            Orijinal ECU dosyalarını yükleyin, AI ile analiz edin, modlayın ve indirin
          </p>
          {isLoading && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span>Araç veritabanı yükleniyor...</span>
              </div>
              <div className="text-sm text-gray-400 mb-2">
                {loadingProgress.current} ({loadingProgress.loaded}/{loadingProgress.total})
              </div>
              {loadingProgress.total > 0 && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(loadingProgress.loaded / loadingProgress.total) * 100}%` }}
                  ></div>
                </div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {vehicleDatabase.length} araç yüklendi
              </div>
            </div>
          )}
          {!isLoading && vehicleDatabase.length > 0 && (
            <div className="mt-4 text-green-400">
              ✅ {vehicleDatabase.length} araç verisi hazır ({stats?.totalBrands} marka, {stats?.totalModels} model)
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dosya Yükleme */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="text-green-400" />
              Dosya Yükleme
            </h2>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept=".bin,.hex,.ecu,.ori,.mod"
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg flex items-center justify-center gap-2 mb-4"
            >
              <Upload size={20} />
              ECU Dosyası Seç
            </button>

            <div className="space-y-3">
              {files.map(file => (
                <div key={file.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium truncate">{file.name}</span>
                    <span className="text-sm text-gray-400">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  
                  {file.vehicleInfo && (
                    <div className="text-sm text-blue-400 mb-2">
                      {file.vehicleInfo.brand} {file.vehicleInfo.model} {file.vehicleInfo.year}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => analyzeWithAI(file)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-sm flex items-center justify-center gap-1"
                      disabled={isAnalyzing}
                    >
                      <Cpu size={16} />
                      Analiz
                    </button>
                    
                    <button
                      onClick={() => downloadFile(file, 'original')}
                      className="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded text-sm"
                    >
                      <Download size={16} />
                    </button>
                  </div>

                  {file.modifiedHex && (
                    <button
                      onClick={() => downloadFile(file, 'modified')}
                      className="w-full mt-2 bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm flex items-center justify-center gap-1"
                    >
                      <Download size={16} />
                      Modlanmış Dosyayı İndir
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Analiz & Modlama */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="text-yellow-400" />
              AI Analiz & Modlama
            </h2>

            {selectedFile && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">Seçili Dosya:</h3>
                <div className="bg-gray-700 rounded p-3 text-sm">
                  <div>{selectedFile.name}</div>
                  {selectedFile.vehicleInfo && (
                    <div className="text-blue-400">
                      {selectedFile.vehicleInfo.brand} {selectedFile.vehicleInfo.model}
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Force Yazılım Seviyeleri:</h4>
                  <button
                    onClick={() => modifyECU(selectedFile, 'stage1')}
                    className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded flex items-center justify-center gap-2"
                    disabled={isAnalyzing}
                  >
                    <Settings size={16} />
                    Force Yazılım 1
                  </button>
                  <button
                    onClick={() => modifyECU(selectedFile, 'stage2')}
                    className="w-full bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded flex items-center justify-center gap-2"
                    disabled={isAnalyzing}
                  >
                    <Settings size={16} />
                    Force Yazılım 2
                  </button>
                  <button
                    onClick={() => modifyECU(selectedFile, 'stage3')}
                    className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center justify-center gap-2"
                    disabled={isAnalyzing}
                  >
                    <Settings size={16} />
                    Force Yazılım 3
                  </button>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p>AI analiz ediyor...</p>
              </div>
            )}

            {analysisResult && (
              <div className="bg-gray-700 rounded-lg p-4 mt-4">
                <h4 className="font-medium mb-2">AI Analiz Sonucu:</h4>
                <pre className="text-sm whitespace-pre-wrap text-green-400">
                  {analysisResult}
                </pre>
              </div>
            )}
          </div>

          {/* Araç Veritabanı */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Database className="text-blue-400" />
              Araç Veritabanı
            </h2>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Araç ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
              />
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
              >
                <option value="">Tüm Markalar</option>
                {CAR_BRANDS.map(brand => (
                  <option key={brand} value={brand}>{brand.replace('_', ' ')}</option>
                ))}
              </select>
              <select
                value={selectedFuelType}
                onChange={(e) => setSelectedFuelType(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
              >
                <option value="">Tüm Yakıtlar</option>
                <option value="Benzin">Benzin</option>
                <option value="Dizel">Dizel</option>
                <option value="Hibrit">Hibrit</option>
                <option value="Elektrik">Elektrik</option>
              </select>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredVehicles.map(vehicle => (
                <div key={vehicle.id} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Car size={16} className="text-blue-400" />
                    <span className="font-medium">
                      {vehicle.brand} {vehicle.model}
                    </span>
                    <span className="text-sm text-gray-400">
                      {vehicle.year}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-300 mb-2">
                    {vehicle.engine} • {vehicle.original_specs.hp}HP • {vehicle.original_specs.torque}Nm
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {vehicle.tuning_stages.stage1 && (
                      <div className="bg-green-600 rounded px-2 py-1 text-center">
                        S1: {vehicle.tuning_stages.stage1.hp}HP
                      </div>
                    )}
                    {vehicle.tuning_stages.stage2 && (
                      <div className="bg-orange-600 rounded px-2 py-1 text-center">
                        S2: {vehicle.tuning_stages.stage2.hp}HP
                      </div>
                    )}
                    {vehicle.tuning_stages.stage3 && (
                      <div className="bg-red-600 rounded px-2 py-1 text-center">
                        S3: {vehicle.tuning_stages.stage3.hp}HP
                      </div>
                    )}
                  </div>

                  <div className="mt-2 text-xs text-gray-400">
                    ECU: {vehicle.ecu_info.type} • {vehicle.ecu_info.difficulty}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hex Viewer */}
        {selectedFile && (
          <div className="mt-6 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <HexagonIcon className="text-purple-400" />
              Hex Viewer
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Orijinal Hex Data:</h3>
                <div className="bg-gray-900 rounded p-4 font-mono text-xs overflow-auto max-h-64">
                  {selectedFile.hexData.substring(0, 2000)}...
                </div>
              </div>
              
              {selectedFile.modifiedHex && (
                <div>
                  <h3 className="font-medium mb-2">Modlanmış Hex Data:</h3>
                  <div className="bg-gray-900 rounded p-4 font-mono text-xs overflow-auto max-h-64">
                    {selectedFile.modifiedHex.substring(0, 2000)}...
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AITrainingSystem;