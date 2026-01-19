import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Cpu, BarChart3, Wrench, Shield, Sparkles, X, Search, CheckCircle, Clock, AlertCircle, LogOut, MessageCircle, Upload, Calendar } from 'lucide-react'

const ZorluEcuSection = () => {
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

  const searchResults = searchQuery.trim() 
    ? faqData.filter(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
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
      title: 'DPF/EGR Delete',
      description: 'Emisyon sistemi optimizasyonu',
      color: 'from-red-500 to-orange-600'
    },
    {
      icon: Sparkles,
      title: 'Launch Control',
      description: 'Yarış başlangıç sistemi',
      color: 'from-orange-600 to-red-600'
    }
  ]

  const handleVehicleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setVehicleSearchResult({
      plaka: vehicleFormData.plaka,
      isim: vehicleFormData.isim,
      soyisim: vehicleFormData.soyisim,
      telefon: vehicleFormData.telefon,
      aracBilgi: '2020 BMW 320i - 2.0L Turbo',
      yapılanIslemler: [
        { tarih: '15.01.2026', islem: 'Stage 1 ECU Remapping', durum: 'Tamamlandı' },
        { tarih: '10.01.2026', islem: 'Dyno Test', durum: 'Tamamlandı' },
        { tarih: '17.01.2026', islem: 'Pop & Bang Ayarı', durum: 'Devam Ediyor' }
      ],
      toplamUcret: '₺4,500',
      odenenmiktar: '₺3,000',
      kalanBorc: '₺1,500',
      suankiDurum: 'Pop & Bang ayarları yapılıyor. Tahmini tamamlanma: 18.01.2026'
    })
  }

  const handleAppointmentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const appointmentData = {
      name: formData.get('name'),
      surname: formData.get('surname'),
      phone: formData.get('phone'),
      date: formData.get('date'),
      plate: formData.get('plate'),
      problem: selectedAnswer?.question,
      timestamp: new Date().toLocaleString('tr-TR')
    }
    
    const message = `${formData.get('plate')} ${formData.get('name')} ${formData.get('surname')} ${formData.get('date')} İçin Randevu Oluşturdum\n\nSorun: ${selectedAnswer?.question}`
    const whatsappUrl = `https://wa.me/905321566966?text=${encodeURIComponent(message)}`
    
    console.log('Randevu Verileri:', appointmentData)
    window.location.href = whatsappUrl
    
    setShowAppointmentForm(false)
    setSearchQuery('')
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="inline-block mb-6"
        >
          <Zap className="w-24 h-24 text-red-600" />
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-red-600 via-red-500 to-pink-600 bg-clip-text text-transparent">
          Zorlu ECU
        </h1>
        <p className="text-3xl md:text-4xl font-bold text-white mb-4">
          Feel The Fast Power
        </p>
        <p className="text-xl text-white/70 max-w-3xl mx-auto">
          Aracınızın gizli gücünü ortaya çıkarın
        </p>
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
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentView('vehicle')}
              className="p-8 rounded-3xl bg-gradient-to-br from-red-600/20 to-red-500/20 border border-red-500/50 hover:border-red-500 transition-all"
            >
              <Search className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Araç Bilgisi</h3>
              <p className="text-white/70">Aracınızın durumunu sorgulayın</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentView('query')}
              className="p-8 rounded-3xl bg-gradient-to-br from-red-600/20 to-pink-500/20 border border-red-600/50 hover:border-red-500 transition-all"
            >
              <MessageCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Aracımın Nesi Var?</h3>
              <p className="text-white/70">Sorununuzu arayın ve çözüm bulun</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentView('admin')}
              className="p-8 rounded-3xl bg-gradient-to-br from-red-600/20 to-red-500/20 border border-red-500/50 hover:border-red-500 transition-all"
            >
              <LogOut className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Admin / Kurumsal</h3>
              <p className="text-white/70">Giriş paneline erişin</p>
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
          <button
            onClick={() => {
              setCurrentView('main')
              setVehicleSearchResult(null)
              setVehicleFormData({ plaka: '', isim: '', soyisim: '', telefon: '' })
            }}
            className="mb-6 px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
          >
            ← Geri Dön
          </button>

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

          <h2 className="text-3xl font-bold text-white mb-6">Aracımın Nesi Var?</h2>

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

      {/* Admin View */}
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
              <h3 className="text-2xl font-bold text-white mb-6">Admin Girişi</h3>
              <input
                type="password"
                placeholder="Admin Kodu"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && (e.currentTarget.value === 'admin123')) {
                    setAdminLoggedIn(true)
                  }
                }}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none mb-4"
              />
              <button
                onClick={(e) => {
                  const input = (e.currentTarget.previousElementSibling as HTMLInputElement)
                  if (input.value === 'admin123') {
                    setAdminLoggedIn(true)
                  }
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-xl text-white font-bold hover:shadow-lg transition-all"
              >
                Giriş Yap
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
                <p className="text-green-400 font-bold mb-4">✓ Admin Paneline Hoşgeldiniz</p>
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
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default ZorluEcuSection
