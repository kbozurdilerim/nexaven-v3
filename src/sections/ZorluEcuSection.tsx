import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Cpu, BarChart3, Wrench, Shield, Sparkles, X, Search, CheckCircle, Clock, AlertCircle, LogOut, MessageCircle, Upload, Calendar, Send, File, TrendingUp, DollarSign } from 'lucide-react'

const ZorluEcuSection = () => {
  const navigate = useNavigate()
  const [currentView, setCurrentView] = useState<'main' | 'query' | 'admin' | 'corporate' | 'vehicle'>('main')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null)
  const [showAppointmentForm, setShowAppointmentForm] = useState(false)
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [corporateLoggedIn, setCorporateLoggedIn] = useState(false)
  const [vehicleSearchResult, setVehicleSearchResult] = useState<any>(null)
  const [vehicleFormData, setVehicleFormData] = useState({
    plaka: '',
    isim: '',
    soyisim: '',
    telefon: ''
  })
  
  // Corporate chat state
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'admin', text: 'Merhaba! Dosya yüklemek için buradaysınız?', time: '10:30' },
    { id: 2, sender: 'user', text: 'Evet, BMW 320i için ECU dosyası yüklemek istiyorum', time: '10:32' }
  ])
  const [corporateChatInput, setCorporateChatInput] = useState('')
  const uploadedFiles = [
    { id: 1, name: 'BMW_320i_Original.bin', size: '2.5MB', status: 'processing', date: '2026-01-18' }
  ]

  // Initialize sample data in localStorage on mount
  useEffect(() => {
    const existingData = localStorage.getItem('zorlu_vehicles')
    if (!existingData) {
      const sampleVehicles = [
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
      localStorage.setItem('zorlu_vehicles', JSON.stringify(sampleVehicles))
      console.log('✅ Örnek araç verileri localStorage\'a kaydedildi:', sampleVehicles)
    } else {
      console.log('✅ Mevcut araç verileri yüklendi:', JSON.parse(existingData))
    }
  }, [])

  // Load vehicles from localStorage
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

  // Handlers

  const handleVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Load all vehicles from storage
    const vehicles = loadVehicles()
    
    // Normalize input data for matching
    const inputPlate = vehicleFormData.plaka.toUpperCase().replace(/\s+/g, ' ').trim()
    const inputCustomer = `${vehicleFormData.isim} ${vehicleFormData.soyisim}`.toLowerCase().trim()
    const inputPhone = vehicleFormData.telefon.replace(/\s+/g, '').replace(/[-()\s]/g, '')
    
    console.log('🔍 Arama Yapılıyor...')
    console.log('Girilen Plaka:', inputPlate)
    console.log('Girilen Müşteri:', inputCustomer)
    console.log('Girilen Telefon:', inputPhone)
    console.log('Toplam Kayıt:', vehicles.length)
    
    // Find matching vehicle - exact match required
    const matchedVehicle = vehicles.find((v: any) => {
      const vehiclePlate = v.plate.toUpperCase().replace(/\s+/g, ' ').trim()
      const vehicleCustomer = v.customer.toLowerCase().trim()
      const vehiclePhone = v.phone.replace(/\s+/g, '').replace(/[-()\s]/g, '')
      
      console.log(`Kontrol: ${v.plate} | ${v.customer} | ${v.phone}`)
      console.log(`Normalize: ${vehiclePlate} === ${inputPlate} ? ${vehiclePlate === inputPlate}`)
      console.log(`Müşteri: ${vehicleCustomer} === ${inputCustomer} ? ${vehicleCustomer === inputCustomer}`)
      console.log(`Telefon: ${vehiclePhone} === ${inputPhone} ? ${vehiclePhone === inputPhone}`)
      
      // Match by plate AND (customer name OR phone)
      return vehiclePlate === inputPlate && 
             (vehicleCustomer === inputCustomer || vehiclePhone === inputPhone)
    })
    
    if (!matchedVehicle) {
      console.log('❌ Eşleşme bulunamadı!')
      alert(`❌ Girdiğiniz bilgilerle eşleşen araç kaydı bulunamadı.\n\nGirilen:\n- Plaka: ${inputPlate}\n- Müşteri: ${inputCustomer}\n- Telefon: ${inputPhone}\n\nLütfen bilgilerinizi kontrol edin.`)
      return
    }
    
    console.log('✅ Eşleşme bulundu:', matchedVehicle)
    
    // Map status to Turkish
    const getStatusLabel = (status: string) => {
      switch (status) {
        case 'completed': return 'Tamamlandı'
        case 'processing': return 'İşleniyor'
        case 'pending': return 'Beklemede'
        default: return 'Bilinmiyor'
      }
    }
    
    // Format result with matched vehicle data
    setVehicleSearchResult({
      plaka: matchedVehicle.plate,
      isim: vehicleFormData.isim,
      soyisim: vehicleFormData.soyisim,
      telefon: matchedVehicle.phone,
      aracBilgi: `${matchedVehicle.brand} ${matchedVehicle.model} (${matchedVehicle.year}) - Motor: ${matchedVehicle.engine}`,
      yapılanIslemler: [
        {
          islem: matchedVehicle.serviceType,
          tarih: '15.01.2026',
          durum: getStatusLabel(matchedVehicle.status)
        }
      ],
      toplamUcret: `₺${matchedVehicle.totalCost.toLocaleString('tr-TR')}`,
      odenenmiktar: `₺${matchedVehicle.paidAmount.toLocaleString('tr-TR')}`,
      kalanBorc: `₺${matchedVehicle.debt.toLocaleString('tr-TR')}`,
      suankiDurum: matchedVehicle.notes || 'İşlem devam ediyor.'
    })
  }

  const handleAppointmentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowAppointmentForm(false)
    // In production, this would send via API/WhatsApp
    alert('Randevu talebiniz alındı. Size dönüş yapacağız.')
  }

  // FAQ Data
  const faqData = [
    {
      id: 1,
      question: 'Aracımda DPF problemi var',
      answer: 'DPF (Dizel Partikül Filtresi) problemi genellikle filtre tıkanıklığından kaynaklanır. Biz DPF silme işlemi gerçekleştiriyoruz ve motorunuzu daha ekonomik hale getiriyoruz. İşlem süresi yaklaşık 2-3 saat.'
    },
    {
      id: 2,
      question: 'EGR Kapısı hatasını almıyorum',
      answer: 'EGR Kapısı Kalıcı Hatası (P0404 vb.) genellikle algılayıcı arızası veya mekanik sorundandır. ECU tuning ile bu hatayı ortadan kaldırabiliriz.'
    },
    {
      id: 3,
      question: 'Turbo basıncı düşük',
      answer: 'Turbo basıncı düşüklüğü turbo arızası veya boost konektörü sorunundan kaynaklanabilir. ECU tuning ile turbo performansını optimize edebiliriz.'
    },
    {
      id: 4,
      question: 'Yakıt tüketimi çok yüksek',
      answer: 'Yüksek yakıt tüketimi motorun yanlış ayarından kaynaklanabilir. ECU remapping ile yakıt konsümpsiyonunu %20-30 oranında düşürebiliriz.'
    },
    {
      id: 5,
      question: 'Motor güç kaybı yaşıyorum',
      answer: 'Motor güç kaybı çeşitli sebeplerden kaynaklanabilir. Diagnostik yaparak sorunu tespit eder ve Stage tuning ile çözebiliriz. +30-40% güç artışı sağlıyoruz.'
    },
    {
      id: 6,
      question: 'Check Engine ışığı sürekli yanıyor',
      answer: 'Check Engine ışığı motor yönetim sisteminde arıza olduğunu gösterir. Hata kodunu okuyup sistemin düzenlenmesini sağlıyoruz.'
    }
  ]

  // Derived search results based on query
  const searchResults = searchQuery
    ? faqData.filter((item) =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  

  const services = [
    {
      icon: Zap,
      title: 'ECU Remapping',
      description: 'Profesyonel motor yazılımı optimizasyonu',
      color: 'from-red-600 to-red-500'
    },
    {
      icon: Cpu,
      title: 'Stage Tuning',
      description: 'Stage 1, 2, 3 performans paketleri',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: BarChart3,
      title: 'Dyno Test',
      description: 'Profesyonel güç ve tork ölçümü',
      color: 'from-pink-500 to-red-500'
    },
    {
      icon: Wrench,
      title: 'Pop & Bang',
      description: 'Özel egzoz sesi ayarları',
      color: 'from-red-600 to-pink-600'
    },
    {
      icon: Shield,
      title: 'Emisyon & Güvenlik',
      description: 'DPF/EGR çözümleri ve güvenlik ayarları',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Sparkles,
      title: 'Özel Ayarlar',
      description: 'Launch Control, Pop-Bang, Anti-Lag',
      color: 'from-pink-500 to-red-500'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
        className="inline-block mb-6 text-center w-full"
      >
        <Zap className="w-24 h-24 text-red-600 mx-auto" />
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-red-600 via-red-500 to-pink-600 bg-clip-text text-transparent">
          Zorlu ECU
        </h1>
        <p className="text-3xl md:text-4xl font-bold text-white mb-4">Feel The Fast Power</p>
        <p className="text-xl text-white/70 max-w-3xl mx-auto">Aracınızın gizli gücünü ortaya çıkarın</p>
      </motion.div>

  {/* Main View - Services + Buttons */}
  {currentView === 'main' && (
        <>
          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity`} />
                  
                  <div className="relative p-6 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 group-hover:border-red-500/50 transition-all">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2 text-white">{service.title}</h3>
                    <p className="text-white/70">{service.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Info Boxes */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          >
            <div className="p-8 rounded-3xl bg-gradient-to-br from-red-600/20 to-red-500/20 border border-red-500/30 backdrop-blur-xl">
              <h3 className="text-3xl font-bold text-white mb-4">Neden Zorlu ECU?</h3>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  10+ yıl tecrübe
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  5000+ başarılı uygulama
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  Profesyonel ekipman
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  Garanti belgesi
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-pink-500/20 to-red-500/20 border border-red-500/30 backdrop-blur-xl">
              <h3 className="text-3xl font-bold text-white mb-4">Performans Artışı</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/80">Güç Artışı</span>
                    <span className="text-red-400 font-bold">+30-40%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 1, delay: 1 }}
                      className="h-full bg-gradient-to-r from-red-600 to-red-500"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/80">Tork Artışı</span>
                    <span className="text-red-400 font-bold">+35-45%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "80%" }}
                      transition={{ duration: 1, delay: 1.2 }}
                      className="h-full bg-gradient-to-r from-pink-500 to-red-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto"
          >
            {/* Cari Borç Sorgula Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/cari-borc-sorgula')}
              className="p-6 rounded-3xl bg-gradient-to-br from-orange-600/20 to-orange-500/20 border border-orange-500/50 hover:border-orange-500 transition-all"
            >
              <DollarSign className="w-10 h-10 text-orange-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-1">Cari Borç Sorgula</h3>
              <p className="text-white/70 text-sm">Firma adı ile borç sorgula</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentView('vehicle')}
              className="p-6 rounded-3xl bg-gradient-to-br from-red-600/20 to-red-500/20 border border-red-500/50 hover:border-red-500 transition-all"
            >
              <TrendingUp className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-1">Araç Bilgisi</h3>
              <p className="text-white/70 text-sm">Aracınızın durumunu sor</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentView('query')}
              className="p-6 rounded-3xl bg-gradient-to-br from-red-600/20 to-pink-500/20 border border-red-600/50 hover:border-red-500 transition-all"
            >
              <MessageCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-1">Sıkça Sorulanlar</h3>
              <p className="text-white/70 text-sm">Sorunuzu arayın</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentView('admin')}
              className="p-6 rounded-3xl bg-gradient-to-br from-red-600/20 to-red-500/20 border border-red-500/50 hover:border-red-500 transition-all"
            >
              <LogOut className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-1">Giriş Yap</h3>
              <p className="text-white/70 text-sm">Panele erişin</p>
            </motion.button>
          </motion.div>
        </>
      )}

      {/* Vehicle Search View */}
      {currentView === 'vehicle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => {
                setCurrentView('main')
                setVehicleSearchResult(null)
                setVehicleFormData({ plaka: '', isim: '', soyisim: '', telefon: '' })
              }}
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
            >
              ← Geri Dön
            </button>
            
            <button
              onClick={() => {
                const vehicles = loadVehicles()
                console.log('📦 Toplam Kayıt:', vehicles.length)
                console.table(vehicles)
                alert(`📦 LocalStorage'da ${vehicles.length} araç kaydı var.\n\nDetayları görmek için Console'u açın (F12)`)
              }}
              className="px-6 py-3 bg-blue-500/20 border border-blue-500/50 rounded-full text-white hover:bg-blue-500/30 transition-all"
            >
              🔍 Verileri Göster
            </button>

            <button
              onClick={() => {
                if (confirm('⚠️ TÜM ARAÇ VERİLERİ SİLİNECEK!\n\nEmin misiniz?')) {
                  localStorage.removeItem('zorlu_vehicles')
                  alert('✅ Veriler silindi. Sayfa yenilenecek.')
                  window.location.reload()
                }
              }}
              className="px-6 py-3 bg-red-500/20 border border-red-500/50 rounded-full text-white hover:bg-red-500/30 transition-all"
            >
              🗑️ Verileri Sıfırla
            </button>
          </div>

          {!vehicleSearchResult ? (
            <form onSubmit={handleVehicleSubmit} className="space-y-4">
              <h2 className="text-3xl font-bold text-white mb-6">Araç Bilgi Sorgulama</h2>
              
              <div>
                <label className="block text-white/80 mb-2">Plaka</label>
                <input
                  type="text"
                  required
                  value={vehicleFormData.plaka}
                  onChange={(e) => setVehicleFormData({ ...vehicleFormData, plaka: e.target.value.toUpperCase() })}
                  placeholder="34 ABC 123"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 mb-2">İsim</label>
                  <input
                    type="text"
                    required
                    value={vehicleFormData.isim}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, isim: e.target.value })}
                    placeholder="Adınız"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2">Soyisim</label>
                  <input
                    type="text"
                    required
                    value={vehicleFormData.soyisim}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, soyisim: e.target.value })}
                    placeholder="Soyadınız"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-2">Telefon Numarası</label>
                <input
                  type="tel"
                  required
                  value={vehicleFormData.telefon}
                  onChange={(e) => setVehicleFormData({ ...vehicleFormData, telefon: e.target.value })}
                  placeholder="0555 123 45 67"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-xl text-white font-bold text-lg hover:shadow-2xl hover:shadow-red-500/50 transform hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Sorgula
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-2xl bg-gradient-to-br from-red-600/20 to-red-500/20 border border-red-500/30">
                <h3 className="text-2xl font-bold text-white mb-4">Müşteri Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-white/80">
                  <div><span className="text-red-400">Plaka:</span> {vehicleSearchResult.plaka}</div>
                  <div><span className="text-red-400">İsim:</span> {vehicleSearchResult.isim} {vehicleSearchResult.soyisim}</div>
                  <div><span className="text-red-400">Telefon:</span> {vehicleSearchResult.telefon}</div>
                  <div><span className="text-red-400">Araç:</span> {vehicleSearchResult.aracBilgi}</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">Yapılan İşlemler</h3>
                <div className="space-y-3">
                  {vehicleSearchResult.yapılanIslemler.map((islem: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        {islem.durum === 'Tamamlandı' ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : (
                          <Clock className="w-6 h-6 text-yellow-400 animate-pulse" />
                        )}
                        <div>
                          <div className="text-white font-medium">{islem.islem}</div>
                          <div className="text-white/60 text-sm">{islem.tarih}</div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        islem.durum === 'Tamamlandı' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {islem.durum}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
                <h3 className="text-2xl font-bold text-white mb-4">Ücretlendirme</h3>
                <div className="space-y-2 text-white/80">
                  <div className="flex justify-between">
                    <span>Toplam Ücret:</span>
                    <span className="text-white font-bold">{vehicleSearchResult.toplamUcret}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ödenen Miktar:</span>
                    <span className="text-green-400 font-bold">{vehicleSearchResult.odenenmiktar}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/20">
                    <span>Kalan Borç:</span>
                    <span className="text-red-400 font-bold">{vehicleSearchResult.kalanBorc}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-blue-400 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Şuanki Durum</h3>
                    <p className="text-white/80">{vehicleSearchResult.suankiDurum}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setVehicleSearchResult(null)
                  setVehicleFormData({ plaka: '', isim: '', soyisim: '', telefon: '' })
                }}
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white font-bold hover:bg-white/20 transition-all"
              >
                Yeni Sorgulama
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Query View - Aracımın Nesi Var */}
      {currentView === 'query' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="max-w-3xl mx-auto"
        >
          <button
            onClick={() => {
              setCurrentView('main')
              setSearchQuery('')
              setSelectedAnswer(null)
            }}
            className="mb-6 px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
          >
            ← Geri Dön
          </button>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-4 w-6 h-6 text-red-400" />
            <input
              type="text"
              placeholder="Aracınız hakkındaki sorunu yazın..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedAnswer(item)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all ${
                    selectedAnswer?.id === item.id
                      ? 'bg-gradient-to-r from-red-500/30 to-red-500/30 border-2 border-red-500'
                      : 'bg-white/5 border border-white/20 hover:border-red-500/50'
                  }`}
                >
                  <h4 className="text-lg font-bold text-white mb-2">{item.question}</h4>
                  {selectedAnswer?.id === item.id && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-white/80 mb-4"
                    >
                      {item.answer}
                    </motion.p>
                  )}
                </motion.div>
              ))}
            </div>
          ) : searchQuery && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">Sonuç bulunamadı. Lütfen farklı bir arama yapın.</p>
            </div>
          )}

          {/* Appointment Button */}
          {selectedAnswer && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setShowAppointmentForm(true)}
              className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-2xl text-white font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all"
            >
              Randevu Oluştur
            </motion.button>
          )}

          {/* Appointment Form Modal */}
          <AnimatePresence>
            {showAppointmentForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowAppointmentForm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-white/20 p-8 max-w-md w-full"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white">Randevu Oluştur</h3>
                    <button
                      onClick={() => setShowAppointmentForm(false)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Adınız"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      name="surname"
                      placeholder="Soyadınız"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Telefon Numarası"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      name="plate"
                      placeholder="Plaka (34ABC123)"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
                    />
                    <input
                      type="date"
                      name="date"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:border-red-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-xl text-white font-bold hover:shadow-lg transition-all"
                    >
                      WhatsApp'a Gönder
                    </button>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Technician View */}
      {currentView === 'admin' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto"
        >
          <button
            onClick={() => setCurrentView('main')}
            className="mb-6 px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
          >
            ← Geri Dön
          </button>

          {!adminLoggedIn ? (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/30">
              <h3 className="text-2xl font-bold text-white mb-6">Teknisyen Girişi</h3>
              <input
                type="password"
                placeholder="Teknisyen Kodu"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && (e.currentTarget.value === 'technician123')) {
                    setAdminLoggedIn(true)
                  }
                }}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none mb-4"
              />
              <button
                onClick={(e) => {
                  const input = (e.currentTarget.previousElementSibling as HTMLInputElement)
                  if (input.value === 'technician123') {
                    setAdminLoggedIn(true)
                  }
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all"
              >
                Giriş Yap
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
                <p className="text-green-400 font-bold mb-4">✓ Teknisyen Paneline Hoşgeldiniz</p>
                <button
                  onClick={() => {
                    setAdminLoggedIn(false)
                    setCurrentView('main')
                  }}
                  className="px-6 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-all"
                >
                  Çıkış Yap
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-white/5 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-4">🔧 Araç Yönetimi</h4>
                <p className="text-white/70 mb-4">Araç sorgu paneline gitmek için lütfen aşağıdaki butona tıklayın</p>
                <a 
                  href="/zorlu-ecu/technician/dashboard"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-lg text-white font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all"
                >
                  Araç Paneline Git
                </a>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Corporate View */}
      {currentView === 'corporate' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto"
        >
          <button
            onClick={() => setCurrentView('main')}
            className="mb-6 px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
          >
            ← Geri Dön
          </button>

          {!corporateLoggedIn ? (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/30">
              <h3 className="text-2xl font-bold text-white mb-6">Kurumsal Girişi</h3>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none mb-4"
              />
              <input
                type="password"
                placeholder="Şifre"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none mb-4"
              />
              <button
                onClick={() => setCorporateLoggedIn(true)}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all"
              >
                Giriş Yap
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
                <p className="text-green-400 font-bold mb-4">✓ Kurumsal Panele Hoşgeldiniz</p>
                <button
                  onClick={() => {
                    setCorporateLoggedIn(false)
                    setCurrentView('main')
                  }}
                  className="px-6 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-all"
                >
                  Çıkış Yap
                </button>
              </div>

              {/* Corporate Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chat Section */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <MessageCircle className="w-6 h-6 text-red-400" />
                    Admin ile Chat
                  </h4>
                  
                  <div className="bg-black/40 rounded-2xl p-4 h-72 overflow-y-auto mb-4 space-y-3">
                    {chatMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: msg.sender === 'user' ? 10 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs px-4 py-2 rounded-xl ${
                          msg.sender === 'user'
                            ? 'bg-red-600/50 text-white rounded-br-none'
                            : 'bg-white/10 text-white/80 rounded-bl-none'
                        }`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs text-white/50 mt-1">{msg.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Mesaj yazın..."
                      value={corporateChatInput}
                      onChange={(e) => setCorporateChatInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && corporateChatInput.trim()) {
                          setChatMessages([...chatMessages, {
                            id: chatMessages.length + 1,
                            sender: 'user',
                            text: corporateChatInput,
                            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                          }])
                          setCorporateChatInput('')
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none text-sm"
                    />
                    <button
                      onClick={() => {
                        if (corporateChatInput.trim()) {
                          setChatMessages([...chatMessages, {
                            id: chatMessages.length + 1,
                            sender: 'user',
                            text: corporateChatInput,
                            time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                          }])
                          setCorporateChatInput('')
                        }
                      }}
                      className="px-3 py-2 bg-red-600/50 hover:bg-red-600/70 rounded-lg text-white transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Upload className="w-6 h-6 text-red-400" />
                    Dosya Yükleme
                  </h4>

                  <div className="border-2 border-dashed border-red-500/50 rounded-2xl p-6 text-center mb-4 hover:border-red-500 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-red-400 mx-auto mb-2 opacity-50" />
                    <p className="text-white/70 text-sm">ECU dosyası yüklemek için tıklayın</p>
                    <p className="text-white/50 text-xs mt-1">.bin, .hex dosyaları desteklenir</p>
                  </div>

                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <File className="w-5 h-5 text-red-400" />
                            <div className="text-left">
                              <p className="text-white text-sm font-medium">{file.name}</p>
                              <p className="text-white/50 text-xs">{file.size} • {file.date}</p>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs ${
                            file.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            file.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {file.status === 'completed' ? '✓ Tamamlandı' :
                             file.status === 'processing' ? '⏳ İşleniyor' :
                             '⬆ Yükleniyor'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Orders History */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-red-400" />
                  İşlem Geçmişi
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-3 text-white/70 font-medium">İşlem</th>
                        <th className="text-left py-3 px-3 text-white/70 font-medium">Tarih</th>
                        <th className="text-left py-3 px-3 text-white/70 font-medium">Durum</th>
                        <th className="text-right py-3 px-3 text-white/70 font-medium">Ücret</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 1, name: 'Stage 1 ECU Remapping', date: '2026-01-15', status: 'completed', price: '₺2,500' },
                        { id: 2, name: 'Dyno Test', date: '2026-01-17', status: 'completed', price: '₺1,500' },
                        { id: 3, name: 'Pop & Bang Ayarı', date: '2026-01-18', status: 'processing', price: '₺1,200' }
                      ].map((order) => (
                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-3 text-white">{order.name}</td>
                          <td className="py-3 px-3 text-white/70">{order.date}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              order.status === 'completed' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {order.status === 'completed' ? '✓ Tamamlandı' : '⏳ İşleniyor'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right text-white font-medium">{order.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default ZorluEcuSection
