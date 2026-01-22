import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, AlertCircle, CheckCircle, Clock, ArrowLeft } from 'lucide-react'

// Logo mapping utility
const getCarLogoUrl = (brandName: string): string => {
  const brandMap: Record<string, string> = {
    'BMW': 'bmw.svg',
    'Mercedes': 'mercedes.svg',
    'Audi': 'audi.svg',
    'Volkswagen': 'vw.svg',
    'Ford': 'ford.svg',
    'Toyota': 'toyota.svg',
    'Porsche': 'porsche.svg',
    'Ferrari': 'ferrari.svg',
    'Lamborghini': 'lamborghini.svg',
    'Renault': 'renault.svg',
    'Peugeot': 'peugot.svg',
    'Citroën': 'citroen.svg',
    'Opel': 'opel.svg',
    'Fiat': 'fiat.svg',
    'Honda': 'honda.svg',
    'Nissan': 'nissan.svg',
    'Hyundai': 'hyundai.svg',
    'Kia': 'kia.svg'
  };
  
  const logoFile = brandMap[brandName] || 'other-car.svg';
  return `/car_logo/${logoFile}`;
};

interface Vehicle {
  id: string
  plate: string
  brand: string
  model: string
  year: number
  engine: string
  customer: string
  phone: string
  status: 'completed' | 'processing' | 'pending'
  totalCost: number
  paidAmount: number
  debt: number
  serviceType: string
  notes: string
}

export default function VehicleQueryPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [searchResults, setSearchResults] = useState<Vehicle[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [showOnlyDebts, setShowOnlyDebts] = useState(false)

  // Load vehicles on mount
  useEffect(() => {
    const allVehicles = loadVehicles()
    setVehicles(allVehicles)
  }, [])

  // Load sample vehicles from localStorage or use defaults
  const loadVehicles = () => {
    const saved = localStorage.getItem('zorlu_vehicles')
    if (saved) {
      return JSON.parse(saved)
    }
    return [
      {
        id: '1',
        plate: '34 AB 123',
        brand: 'BMW',
        model: '325i',
        year: 2020,
        engine: '2.0',
        customer: 'Ahmet Yılmaz',
        phone: '0532 111 2233',
        status: 'completed',
        totalCost: 5000,
        paidAmount: 5000,
        debt: 0,
        serviceType: 'Stage 1',
        notes: 'Başarıyla tamamlandı'
      },
      {
        id: '2',
        plate: '34 CD 456',
        brand: 'Audi',
        model: 'A4',
        year: 2021,
        engine: '2.0T',
        customer: 'Mehmet Demir',
        phone: '0533 444 5566',
        status: 'processing',
        totalCost: 6500,
        paidAmount: 3250,
        debt: 3250,
        serviceType: 'Stage 2',
        notes: 'Turbo kurulum devam ediyor'
      },
      {
        id: '3',
        plate: '35 EF 789',
        brand: 'Mercedes',
        model: 'C63',
        year: 2022,
        engine: '4.0',
        customer: 'Fatih Kaya',
        phone: '0534 777 8899',
        status: 'pending',
        totalCost: 8000,
        paidAmount: 2000,
        debt: 6000,
        serviceType: 'Full ECU Remap',
        notes: 'Beklemede, takvim bekleniyor'
      }
    ]
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setHasSearched(false)
      return
    }

    setHasSearched(true)
    const query = searchQuery.toLowerCase().trim()
    
    // Firma adına göre filtrele
    let results = vehicles.filter((v: Vehicle) =>
      v.customer.toLowerCase().includes(query)
    )

    // Sadece borçları göster seçeneği aktifse
    if (showOnlyDebts) {
      results = results.filter(v => v.debt > 0)
    }

    setSearchResults(results)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const totalDebt = searchResults.length > 0 
    ? searchResults.reduce((sum, v) => sum + v.debt, 0)
    : vehicles.reduce((sum, v) => sum + v.debt, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-emerald-500'
      case 'processing':
        return 'from-yellow-500 to-orange-500'
      case 'pending':
        return 'from-blue-500 to-cyan-500'
      default:
        return 'from-gray-500 to-slate-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı'
      case 'processing':
        return 'İşleniyor'
      case 'pending':
        return 'Beklemede'
      default:
        return 'Bilinmiyor'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-blue-400" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-red-500/20 backdrop-blur-xl bg-black/20">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/zorlu-ecu/kesfet')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Cari Borç Sorgulaması</h1>
            <p className="text-red-400 text-sm">Zorlu ECU - Firma Bazlı Borç Takibi</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 border border-red-500/30 rounded-2xl p-6 mb-8"
        >
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Firma adı giriniz (ör: Ahmet Yılmaz)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Filter Checkbox */}
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <input
                type="checkbox"
                id="debtFilter"
                checked={showOnlyDebts}
                onChange={(e) => setShowOnlyDebts(e.target.checked)}
                className="w-5 h-5 rounded border-white/20 bg-white/10 checked:bg-red-500 focus:ring-red-500"
              />
              <label htmlFor="debtFilter" className="text-white font-medium cursor-pointer">
                💳 Sadece Borçlu Araçları Göster
              </label>
            </div>

            <button
              onClick={handleSearch}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all"
            >
              Firma Sorgula
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <div className="space-y-4">
          {/* Summary Stats */}
          {hasSearched && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            >
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl">
                <p className="text-red-400 text-sm font-semibold mb-1">Toplam Borç</p>
                <p className="text-red-400 text-3xl font-bold">₺{totalDebt.toLocaleString('tr-TR')}</p>
              </div>
              <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl">
                <p className="text-blue-400 text-sm font-semibold mb-1">Araç Sayısı</p>
                <p className="text-blue-400 text-3xl font-bold">{searchResults.length}</p>
              </div>
              <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
                <p className="text-yellow-400 text-sm font-semibold mb-1">Borçlu Araç</p>
                <p className="text-yellow-400 text-3xl font-bold">{searchResults.filter(v => v.debt > 0).length}</p>
              </div>
            </motion.div>
          )}

          {hasSearched && searchResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 bg-black/40 border border-white/10 rounded-2xl text-center"
            >
              <AlertCircle className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60 text-lg">"{searchQuery}" adlı firma için {showOnlyDebts ? 'borçlu araç' : 'araç'} bulunamadı</p>
            </motion.div>
          )}

          {searchResults.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 border border-white/10 rounded-2xl p-6 hover:border-red-500/50 transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left side - Vehicle info */}
                  <div>
                    <div className="mb-4 flex items-center gap-4">
                      <img 
                        src={getCarLogoUrl(vehicle.brand)} 
                        alt={vehicle.brand}
                        className="w-16 h-16 object-contain bg-white/10 rounded-lg p-2"
                        onError={(e) => {
                          e.currentTarget.src = '/car_logo/other-car.svg';
                        }}
                      />
                      <div>
                        <p className="text-red-400 text-3xl font-bold">{vehicle.plate}</p>
                        <p className="text-white text-2xl font-bold mt-1">{vehicle.brand} {vehicle.model}</p>
                        <p className="text-white/60">Motor: {vehicle.engine} | Yıl: {vehicle.year}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-white/70"><strong>Müşteri:</strong> {vehicle.customer}</p>
                      <p className="text-white/70"><strong>Telefon:</strong> {vehicle.phone}</p>
                      <p className="text-white/70"><strong>Hizmet:</strong> {vehicle.serviceType}</p>
                      {vehicle.notes && <p className="text-white/70"><strong>Notlar:</strong> {vehicle.notes}</p>}
                    </div>
                  </div>

                  {/* Right side - Status and pricing */}
                  <div className="space-y-4">
                    {/* Status */}
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${getStatusColor(vehicle.status)} bg-opacity-20 border border-current border-opacity-30`}>
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(vehicle.status)}
                        <p className="text-white font-bold">{getStatusLabel(vehicle.status)}</p>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white/5 rounded-xl">
                        <p className="text-white/60 text-sm">Toplam Tutar</p>
                        <p className="text-white font-bold text-lg">₺{vehicle.totalCost.toLocaleString('tr-TR')}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl">
                        <p className="text-white/60 text-sm">Ödenen</p>
                        <p className="text-green-400 font-bold text-lg">₺{vehicle.paidAmount.toLocaleString('tr-TR')}</p>
                      </div>
                    </div>

                    {/* Debt */}
                    <div className={`p-3 rounded-xl ${vehicle.debt > 0 ? 'bg-red-500/20 border border-red-500/50' : 'bg-green-500/20 border border-green-500/50'}`}>
                      <p className={vehicle.debt > 0 ? 'text-red-400' : 'text-green-400'}>Cari Borç</p>
                      <p className={`text-2xl font-bold ${vehicle.debt > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        ₺{vehicle.debt.toLocaleString('tr-TR')}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        {/* Info Section */}
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 border border-blue-500/30 rounded-2xl p-6"
          >
            <h3 className="text-white font-bold text-lg mb-4">💳 Cari Borç Sorgulaması Nasıl Çalışır?</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>• Firma adı girerek o firmaya kayıtlı tüm araçları görün</li>
              <li>• "Sadece Borçlu Araçları Göster" seçeneği ile borçlu araçları filtreleyin</li>
              <li>• Toplam borç, araç sayısı ve borçlu araç sayısını görüntüleyin</li>
              <li>• Her araç için detaylı ödeme ve borç bilgilerini öğrenin</li>
            </ul>
          </motion.div>
        )}
      </main>
    </div>
  )
}
