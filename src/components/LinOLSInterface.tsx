import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Monitor, Upload, Download, Settings, Play, Pause, RotateCcw, 
  FileText, Zap, Gauge, Thermometer, Fuel, Cpu, HardDrive,
  CheckCircle, AlertTriangle, Info, X, Maximize2, Minimize2
} from 'lucide-react'

interface ECUFile {
  name: string
  size: number
  type: string
  uploadedAt: string
  checksum?: string
}

interface TuningParameter {
  name: string
  current: number
  original: number
  unit: string
  category: 'boost' | 'fuel' | 'timing' | 'limiter' | 'other'
  description: string
}

interface LinOLSInterfaceProps {
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  onFileProcessed?: (file: ECUFile) => void
}

export default function LinOLSInterface({ isFullscreen, onToggleFullscreen, onFileProcessed }: LinOLSInterfaceProps) {
  const [currentFile, setCurrentFile] = useState<ECUFile | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState<'upload' | 'parameters' | 'maps' | 'diagnostics' | 'export'>('upload')
  const [tuningParameters, setTuningParameters] = useState<TuningParameter[]>([])
  const [selectedStage, setSelectedStage] = useState<'stock' | 'stage1' | 'stage2' | 'stage3' | 'custom'>('stock')
  const [isLinOLSConnected, setIsLinOLSConnected] = useState(false)

  useEffect(() => {
    // Simulate LinOLS connection check
    checkLinOLSConnection()
    initializeParameters()
  }, [])

  const checkLinOLSConnection = async () => {
    // Simulate connection to LinOLS (in real implementation, this would be an API call)
    setTimeout(() => {
      setIsLinOLSConnected(true)
    }, 1000)
  }

  const initializeParameters = () => {
    const defaultParameters: TuningParameter[] = [
      {
        name: 'Turbo Boost Pressure',
        current: 1.2,
        original: 1.2,
        unit: 'bar',
        category: 'boost',
        description: 'Maximum turbocharger boost pressure'
      },
      {
        name: 'Fuel Rail Pressure',
        current: 1600,
        original: 1600,
        unit: 'bar',
        category: 'fuel',
        description: 'Common rail fuel injection pressure'
      },
      {
        name: 'Injection Timing',
        current: 8.5,
        original: 8.5,
        unit: '°BTDC',
        category: 'timing',
        description: 'Main injection timing advance'
      },
      {
        name: 'Speed Limiter',
        current: 250,
        original: 250,
        unit: 'km/h',
        category: 'limiter',
        description: 'Maximum vehicle speed limit'
      },
      {
        name: 'Torque Limiter',
        current: 400,
        original: 400,
        unit: 'Nm',
        category: 'limiter',
        description: 'Maximum engine torque limit'
      },
      {
        name: 'EGR Valve',
        current: 100,
        original: 100,
        unit: '%',
        category: 'other',
        description: 'Exhaust Gas Recirculation valve opening'
      }
    ]
    setTuningParameters(defaultParameters)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)

    // Simulate file processing
    setTimeout(() => {
      const ecuFile: ECUFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        checksum: 'MD5: ' + Math.random().toString(36).substring(2, 15)
      }

      setCurrentFile(ecuFile)
      setIsProcessing(false)
      setActiveTab('parameters')
      onFileProcessed?.(ecuFile)
    }, 2000)
  }

  const applyStageSettings = (stage: typeof selectedStage) => {
    setSelectedStage(stage)
    
    const stageMultipliers = {
      stock: { boost: 1.0, fuel: 1.0, timing: 1.0, torque: 1.0 },
      stage1: { boost: 1.15, fuel: 1.12, timing: 1.05, torque: 1.20 },
      stage2: { boost: 1.30, fuel: 1.25, timing: 1.10, torque: 1.35 },
      stage3: { boost: 1.45, fuel: 1.40, timing: 1.15, torque: 1.50 },
      custom: { boost: 1.0, fuel: 1.0, timing: 1.0, torque: 1.0 }
    }

    const multipliers = stageMultipliers[stage]

    setTuningParameters(prev => prev.map(param => {
      let newValue = param.original

      switch (param.category) {
        case 'boost':
          newValue = param.original * multipliers.boost
          break
        case 'fuel':
          newValue = param.original * multipliers.fuel
          break
        case 'timing':
          newValue = param.original * multipliers.timing
          break
        case 'limiter':
          if (param.name.includes('Torque')) {
            newValue = param.original * multipliers.torque
          } else if (param.name.includes('Speed') && stage !== 'stock') {
            newValue = 0 // Remove speed limiter
          }
          break
        case 'other':
          if (param.name.includes('EGR') && stage !== 'stock') {
            newValue = 0 // Disable EGR
          }
          break
      }

      return { ...param, current: Math.round(newValue * 100) / 100 }
    }))
  }

  const updateParameter = (index: number, value: number) => {
    setTuningParameters(prev => prev.map((param, i) => 
      i === index ? { ...param, current: value } : param
    ))
    setSelectedStage('custom')
  }

  const exportFile = () => {
    if (!currentFile) return

    // Simulate file export
    const modifiedFileName = currentFile.name.replace('.bin', '_modified.bin')
    const blob = new Blob(['Modified ECU data'], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = modifiedFileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getCategoryIcon = (category: TuningParameter['category']) => {
    switch (category) {
      case 'boost': return <Gauge className="w-4 h-4" />
      case 'fuel': return <Fuel className="w-4 h-4" />
      case 'timing': return <Zap className="w-4 h-4" />
      case 'limiter': return <AlertTriangle className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: TuningParameter['category']) => {
    switch (category) {
      case 'boost': return 'text-blue-400 bg-blue-500/20 border-blue-500/50'
      case 'fuel': return 'text-green-400 bg-green-500/20 border-green-500/50'
      case 'timing': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50'
      case 'limiter': return 'text-red-400 bg-red-500/20 border-red-500/50'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50'
    }
  }

  return (
    <div className={`bg-black/40 border border-white/10 rounded-2xl overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : 'h-full'}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">LinOLS Interface</h3>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isLinOLSConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-white/60 text-sm">
                  {isLinOLSConnected ? 'LinOLS Bağlı' : 'LinOLS Bağlantısız'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentFile && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-lg border border-green-500/50">
                {currentFile.name}
              </span>
            )}
            <button
              onClick={onToggleFullscreen}
              className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {[
            { id: 'upload', label: '📁 Dosya Yükle', icon: Upload },
            { id: 'parameters', label: '⚙️ Parametreler', icon: Settings },
            { id: 'maps', label: '🗺️ Haritalar', icon: FileText },
            { id: 'diagnostics', label: '🔍 Teşhis', icon: Cpu },
            { id: 'export', label: '💾 Dışa Aktar', icon: Download }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 h-96 overflow-y-auto">
        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="text-center">
              <h4 className="text-xl font-bold text-white mb-2">ECU Dosyası Yükle</h4>
              <p className="text-white/60">Tuning yapmak için ECU dosyanızı yükleyin</p>
            </div>

            <div className="border-2 border-dashed border-purple-500/30 rounded-2xl p-8 text-center hover:border-purple-500/50 transition-all">
              <input
                type="file"
                accept=".bin,.hex,.s19,.a2l"
                onChange={handleFileUpload}
                className="hidden"
                id="ecu-file-upload"
                disabled={isProcessing}
              />
              <label htmlFor="ecu-file-upload" className="cursor-pointer">
                {isProcessing ? (
                  <div className="space-y-4">
                    <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
                    <p className="text-white font-semibold">Dosya işleniyor...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-16 h-16 text-purple-400 mx-auto" />
                    <div>
                      <p className="text-white font-semibold mb-2">ECU dosyasını buraya sürükleyin</p>
                      <p className="text-white/60 text-sm">veya tıklayarak seçin</p>
                    </div>
                    <p className="text-white/40 text-xs">Desteklenen formatlar: .bin, .hex, .s19, .a2l</p>
                  </div>
                )}
              </label>
            </div>

            {currentFile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-white font-semibold">Dosya başarıyla yüklendi</p>
                    <p className="text-white/60 text-sm">
                      {currentFile.name} • {(currentFile.size / 1024).toFixed(2)} KB
                    </p>
                    {currentFile.checksum && (
                      <p className="text-white/40 text-xs font-mono">{currentFile.checksum}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Parameters Tab */}
        {activeTab === 'parameters' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Tuning Parametreleri</h4>
                <p className="text-white/60">ECU parametrelerini ayarlayın</p>
              </div>

              {/* Stage Selector */}
              <div className="flex gap-2">
                {[
                  { id: 'stock', label: 'Stock', color: 'from-gray-500 to-gray-600' },
                  { id: 'stage1', label: 'Stage 1', color: 'from-blue-500 to-cyan-500' },
                  { id: 'stage2', label: 'Stage 2', color: 'from-purple-500 to-pink-500' },
                  { id: 'stage3', label: 'Stage 3', color: 'from-red-500 to-orange-500' },
                  { id: 'custom', label: 'Custom', color: 'from-green-500 to-emerald-500' }
                ].map(stage => (
                  <button
                    key={stage.id}
                    onClick={() => applyStageSettings(stage.id as any)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedStage === stage.id
                        ? `bg-gradient-to-r ${stage.color} text-white`
                        : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                    }`}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tuningParameters.map((param, index) => (
                <motion.div
                  key={param.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg border ${getCategoryColor(param.category)}`}>
                      {getCategoryIcon(param.category)}
                    </div>
                    <div>
                      <h5 className="text-white font-semibold">{param.name}</h5>
                      <p className="text-white/60 text-sm">{param.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Orijinal:</span>
                      <span className="text-white font-mono">{param.original} {param.unit}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-white/60 text-sm">Güncel:</span>
                      <input
                        type="number"
                        value={param.current}
                        onChange={(e) => updateParameter(index, parseFloat(e.target.value) || 0)}
                        step={param.unit === 'bar' ? 0.1 : param.unit === '°BTDC' ? 0.5 : 1}
                        className="flex-1 px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:border-purple-500"
                      />
                      <span className="text-white/60 text-sm">{param.unit}</span>
                    </div>

                    {param.current !== param.original && (
                      <div className="text-sm">
                        <span className={`${param.current > param.original ? 'text-green-400' : 'text-red-400'}`}>
                          {param.current > param.original ? '+' : ''}
                          {((param.current - param.original) / param.original * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Maps Tab */}
        {activeTab === 'maps' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-bold text-white mb-2">ECU Haritaları</h4>
              <p className="text-white/60">Yakıt ve ateşleme haritalarını görüntüleyin</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { name: 'Fuel Map', color: 'from-green-500 to-emerald-500', data: 'Yakıt enjeksiyon haritası' },
                { name: 'Ignition Map', color: 'from-yellow-500 to-orange-500', data: 'Ateşleme avansı haritası' },
                { name: 'Boost Map', color: 'from-blue-500 to-cyan-500', data: 'Turbo basınç haritası' },
                { name: 'Torque Map', color: 'from-purple-500 to-pink-500', data: 'Tork limiti haritası' }
              ].map(map => (
                <div key={map.name} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 bg-gradient-to-r ${map.color} rounded-lg`}>
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h5 className="text-white font-semibold">{map.name}</h5>
                      <p className="text-white/60 text-sm">{map.data}</p>
                    </div>
                  </div>
                  
                  <div className="h-32 bg-black/30 rounded-lg flex items-center justify-center">
                    <p className="text-white/40">Harita görselleştirmesi</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diagnostics Tab */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-bold text-white mb-2">ECU Teşhis</h4>
              <p className="text-white/60">Dosya analizi ve hata kontrolü</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Dosya Bütünlüğü', status: 'success', message: 'Checksum doğru' },
                { label: 'Uyumluluk', status: 'success', message: 'ECU ile uyumlu' },
                { label: 'Güvenlik', status: 'warning', message: 'Backup önerilir' }
              ].map(check => (
                <div key={check.label} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    {check.status === 'success' && <CheckCircle className="w-6 h-6 text-green-400" />}
                    {check.status === 'warning' && <AlertTriangle className="w-6 h-6 text-yellow-400" />}
                    {check.status === 'error' && <X className="w-6 h-6 text-red-400" />}
                    <div>
                      <p className="text-white font-semibold">{check.label}</p>
                      <p className="text-white/60 text-sm">{check.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-xl font-bold text-white mb-2">Dosya Dışa Aktarma</h4>
              <p className="text-white/60">Düzenlenmiş ECU dosyasını indirin</p>
            </div>

            {currentFile ? (
              <div className="space-y-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <h5 className="text-white font-semibold mb-3">Değişiklik Özeti</h5>
                  <div className="space-y-2">
                    {tuningParameters
                      .filter(p => p.current !== p.original)
                      .map(param => (
                        <div key={param.name} className="flex justify-between items-center">
                          <span className="text-white/60">{param.name}:</span>
                          <span className="text-white font-mono">
                            {param.original} → {param.current} {param.unit}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <button
                  onClick={exportFile}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  <Download className="w-5 h-5 inline mr-2" />
                  Düzenlenmiş Dosyayı İndir
                </button>
              </div>
            ) : (
              <div className="text-center p-8">
                <Info className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">Önce bir ECU dosyası yükleyin</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}