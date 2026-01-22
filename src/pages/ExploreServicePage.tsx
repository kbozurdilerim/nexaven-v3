import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import AssettoCorsaSection from '../sections/AssettoCorsaSection'
import ZorluEcuSection from '../sections/ZorluEcuSection'
import AhmetKanarSection from '../sections/AhmetKanarSection'
import { Sparkles } from '../components/ui/sparkles'
import { LogIn, X, Mail, Lock, User, Phone, Building2, Eye, EyeOff, MapPin, FileText, Globe, Briefcase, MessageCircle } from 'lucide-react'
import { getAdminAccounts } from '../utils/testData'

type TabType = 'assetto' | 'zorlu' | 'ahmet'
type AuthMode = 'login' | 'register'

export default function ExploreServicePage() {
  const { service } = useParams()
  const navigate = useNavigate()
  const [theme] = useState<'dark' | 'light'>('dark')
  const [activeTab, setActiveTab] = useState<TabType>('assetto')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [registerStep, setRegisterStep] = useState(1)

  // Login state
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  
  // Register state
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    contactName: '',
    phone: '',
    address: '',
    taxNumber: '',
    website: '',
    businessType: '',
    message: ''
  })

  useEffect(() => {
    // Map service to tab
    if (service === 'nexaven-core') setActiveTab('assetto')
    else if (service === 'zorlu-ecu') setActiveTab('zorlu')
    else if (service === 'ahmet-kanar') setActiveTab('ahmet')
    else navigate('/')
  }, [service, navigate])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    const adminAccounts = getAdminAccounts()
    const serviceKey: 'nexaven-core' | 'zorlu-ecu' | 'ahmet-kanar' = (service as any) || 'nexaven-core'
    const serviceAdmin = adminAccounts[serviceKey]
    
    console.log('=== GİRİŞ DEBUGİ ===')
    console.log('Service:', service)
    console.log('Girilen email:', loginData.email)
    console.log('Girilen şifre:', loginData.password)
    console.log('Admin hesabı:', serviceAdmin)
    
    // Admin login kontrolü
    if (serviceAdmin && loginData.email === serviceAdmin.email && loginData.password === serviceAdmin.password) {
      console.log('✅ Admin girişi başarılı!')
      localStorage.setItem('adminUser', JSON.stringify({
        email: serviceAdmin.email,
        role: 'admin',
        service: service,
        loginTime: new Date().toISOString()
      }))
      navigate(`/${service}/admin/dashboard`)
      return
    }
    
    // Corporate user login
    const existingUsers = JSON.parse(localStorage.getItem(`corporateUsers_${service}`) || '[]')
    console.log('Kayıtlı kullanıcı sayısı:', existingUsers.length)
    console.log('Kayıtlı kullanıcılar:', existingUsers.map((u: any) => ({ email: u.email, approved: u.approved })))
    
    const user = existingUsers.find((u: any) => 
      u.email === loginData.email && 
      u.password === loginData.password
    )
    
    if (!user) {
      console.log('❌ Kullanıcı bulunamadı')
      // Check if user exists but wrong password
      const userWithEmail = existingUsers.find((u: any) => u.email === loginData.email)
      if (userWithEmail) {
        if (!userWithEmail.approved) {
          alert('❌ Hesabınız henüz onaylanmamış!\n\n⏳ Yönetici onayını bekliyor.\n📧 Onay durumu email ile bildirilecektir.')
        } else {
          alert('❌ Şifre hatalı!\n\n💡 Şifrenizi kontrol edin.')
        }
      } else {
        if (existingUsers.length > 0) {
          alert('❌ Bu email ile kayıtlı kullanıcı bulunamadı!\n\n📝 Yeni kayıt oluşturun veya email adresinizi kontrol edin.')
        } else {
          alert('❌ Henüz kayıtlı kullanıcı yok.\n\n📝 Lütfen önce kayıt olun.')
        }
      }
      return
    }
    
    console.log('Bulunan kullanıcı:', user)
    
    if (user.approved !== true) {
      console.log('❌ Hesap onaylanmamış')
      alert('❌ Hesabınız henüz onaylanmamış!\n\n⏳ Yönetici onayını bekliyor.\n📧 Onay durumu email ile bildirilecektir.')
      return
    }
    
    // Başarılı giriş
    console.log('✅ Müşteri girişi başarılı!')
    localStorage.setItem('corporateUser', JSON.stringify({
      id: user.id,
      email: user.email,
      companyName: user.companyName,
      contactName: user.contactName,
      phone: user.phone,
      role: 'slave',
      service: service,
      loginTime: new Date().toISOString()
    }))
    navigate(`/${service}/slave/dashboard`)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (registerStep === 1) {
      if (registerData.email && registerData.password === registerData.confirmPassword && registerData.password.length >= 6) {
        setRegisterStep(2)
      } else {
        alert('Lütfen geçerli bilgiler girin! Şifreler eşleşmeli ve en az 6 karakter olmalı.')
      }
    } else if (registerStep === 2) {
      if (registerData.companyName && registerData.contactName && registerData.phone) {
        setRegisterStep(3)
      } else {
        alert('Lütfen tüm zorunlu alanları doldurun!')
      }
    } else {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem(`corporateUsers_${service}`) || '[]')
      const existingPending = JSON.parse(localStorage.getItem(`pendingCustomers_${service}`) || '[]')
      
      const emailExists = existingUsers.some((u: any) => u.email === registerData.email) ||
                         existingPending.some((u: any) => u.email === registerData.email)
      
      if (emailExists) {
        alert('Bu email adresi ile zaten bir başvuru var!')
        return
      }

      // Create new pending customer for approval system
      const newPendingCustomer = {
        id: Date.now().toString(),
        email: registerData.email,
        companyName: registerData.companyName,
        contactName: registerData.contactName,
        phone: registerData.phone,
        address: registerData.address || '',
        taxNumber: registerData.taxNumber || '',
        website: registerData.website || '',
        businessType: registerData.businessType || (service === 'zorlu-ecu' ? 'ECU Tuning' : service === 'assetto-corsa' ? 'Sim Racing' : 'Automotive'),
        requestedServices: service === 'zorlu-ecu' ? ['ECU Tuning'] : service === 'assetto-corsa' ? ['Sim Racing'] : ['Automotive Services'],
        message: registerData.message || `${service} hizmetlerinden faydalanmak istiyorum.`,
        documents: [],
        createdAt: new Date().toISOString(),
        status: 'pending' as const
      }

      // Also create user record with password for login system
      const newUser = {
        id: newPendingCustomer.id,
        email: registerData.email,
        password: registerData.password,
        companyName: registerData.companyName,
        contactName: registerData.contactName,
        phone: registerData.phone,
        service: service,
        approved: false,
        createdAt: new Date().toISOString()
      }

      // Save to both systems
      existingPending.push(newPendingCustomer)
      existingUsers.push(newUser)
      
      localStorage.setItem(`pendingCustomers_${service}`, JSON.stringify(existingPending))
      localStorage.setItem(`corporateUsers_${service}`, JSON.stringify(existingUsers))
      
      alert('✅ Başvurunuz başarıyla alındı!\n\n📋 Başvuru Detayları:\n• Email: ' + registerData.email + '\n• Şirket: ' + registerData.companyName + '\n• İletişim: ' + registerData.contactName + '\n\n⏳ Yönetici onayından sonra giriş yapabileceksiniz.\n📧 Onay durumu email ile bildirilecektir.')
      setShowAuthModal(false)
      setRegisterStep(1)
      setRegisterData({
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        contactName: '',
        phone: '',
        address: '',
        taxNumber: '',
        website: '',
        businessType: '',
        message: ''
      })
    }
  }

  // Servis bazlı renk teması
  const getColorTheme = () => {
    if (service === 'nexaven-core') {
      return {
        gradient: 'from-cyan-500 to-blue-600',
        glow: 'shadow-cyan-500/50',
        border: 'border-cyan-500/50',
        focus: 'focus:border-cyan-500',
        text: 'text-cyan-400'
      }
    } else if (service === 'zorlu-ecu') {
      return {
        gradient: 'from-red-600 to-pink-600',
        glow: 'shadow-red-500/50',
        border: 'border-red-500/50',
        focus: 'focus:border-red-500',
        text: 'text-red-400'
      }
    } else {
      return {
        gradient: 'from-purple-600 to-pink-600',
        glow: 'shadow-purple-500/50',
        border: 'border-purple-500/50',
        focus: 'focus:border-purple-500',
        text: 'text-purple-400'
      }
    }
  }

  const colorTheme = getColorTheme()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden" style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0),rgba(0,0,0,0.8))]" />
      
      <Sparkles
        density={800}
        className="absolute inset-0 w-full h-full pointer-events-none"
        color={theme === "dark" ? "#ffffff" : "#000000"}
        size={1.5}
        opacity={0.3}
      />

      {/* Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <div className="relative">
            {/* Back and Login Buttons */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
                style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}
              >
                ← Geri Dön
              </motion.button>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all flex items-center gap-2"
                style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}
              >
                <LogIn className="w-5 h-5" />
                Giriş Yap
              </motion.button>
            </div>
            
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {activeTab === 'assetto' && <AssettoCorsaSection />}
              {activeTab === 'zorlu' && <ZorluEcuSection />}
              {activeTab === 'ahmet' && <AhmetKanarSection />}
            </motion.div>
          </div>
        </AnimatePresence>
      </div>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="relative w-full max-w-md">
                {/* Close Button */}
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="absolute -top-4 -right-4 w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Form Container */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                  {/* Tabs */}
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => { setAuthMode('login'); setRegisterStep(1) }}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                        authMode === 'login'
                          ? `bg-gradient-to-r ${colorTheme.gradient} text-white`
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      Giriş Yap
                    </button>
                    <button
                      onClick={() => { setAuthMode('register'); setRegisterStep(1) }}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                        authMode === 'register'
                          ? `bg-gradient-to-r ${colorTheme.gradient} text-white`
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      Kayıt Ol
                    </button>
                  </div>

                  {/* Login Form */}
                  {authMode === 'login' && (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                          type="email"
                          placeholder="E-posta"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 ${colorTheme.focus} focus:outline-none`}
                          required
                        />
                      </div>
                      
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Şifre"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className={`w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 ${colorTheme.focus} focus:outline-none`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      <button
                        type="submit"
                        className={`w-full py-4 bg-gradient-to-r ${colorTheme.gradient} rounded-xl text-white font-bold hover:shadow-lg ${colorTheme.glow} transition-all`}
                      >
                        Giriş Yap
                      </button>
                    </form>
                  )}

                  {/* Register Form */}
                  {authMode === 'register' && (
                    <form onSubmit={handleRegister} className="space-y-4">
                      {/* Progress Indicator */}
                      <div className="flex items-center justify-center mb-6">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            registerStep >= 1 ? `bg-gradient-to-r ${colorTheme.gradient} text-white` : 'bg-white/10 text-white/40'
                          }`}>
                            1
                          </div>
                          <div className={`w-8 h-1 ${registerStep >= 2 ? `bg-gradient-to-r ${colorTheme.gradient}` : 'bg-white/10'}`} />
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            registerStep >= 2 ? `bg-gradient-to-r ${colorTheme.gradient} text-white` : 'bg-white/10 text-white/40'
                          }`}>
                            2
                          </div>
                          <div className={`w-8 h-1 ${registerStep >= 3 ? `bg-gradient-to-r ${colorTheme.gradient}` : 'bg-white/10'}`} />
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            registerStep >= 3 ? `bg-gradient-to-r ${colorTheme.gradient} text-white` : 'bg-white/10 text-white/40'
                          }`}>
                            3
                          </div>
                        </div>
                      </div>

                      {/* Step Labels */}
                      <div className="text-center mb-4">
                        <p className="text-white font-semibold">
                          {registerStep === 1 && 'Hesap Bilgileri'}
                          {registerStep === 2 && 'İletişim Bilgileri'}
                          {registerStep === 3 && 'Ek Bilgiler'}
                        </p>
                        <p className="text-white/60 text-sm">
                          Adım {registerStep} / 3
                        </p>
                      </div>
                      {registerStep === 1 && (
                        <>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                              type="email"
                              placeholder="E-posta"
                              value={registerData.email}
                              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 ${colorTheme.focus} focus:outline-none`}
                              required
                            />
                          </div>
                          
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Şifre"
                              value={registerData.password}
                              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                              className={`w-full pl-12 pr-12 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 ${colorTheme.focus} focus:outline-none`}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>

                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Şifre Tekrar"
                              value={registerData.confirmPassword}
                              onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 ${colorTheme.focus} focus:outline-none`}
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            className={`w-full py-4 bg-gradient-to-r ${colorTheme.gradient} rounded-xl text-white font-bold hover:shadow-lg ${colorTheme.glow} transition-all`}
                          >
                            Devam Et
                          </button>
                        </>
                      )}

                      {registerStep === 2 && (
                        <>
                          <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                              type="text"
                              placeholder="Şirket Adı *"
                              value={registerData.companyName}
                              onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
                              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 ${colorTheme.focus} focus:outline-none`}
                              required
                            />
                          </div>

                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                              type="text"
                              placeholder="İletişim Kişisi *"
                              value={registerData.contactName}
                              onChange={(e) => setRegisterData({ ...registerData, contactName: e.target.value })}
                              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 ${colorTheme.focus} focus:outline-none`}
                              required
                            />
                          </div>

                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                              type="tel"
                              placeholder="Telefon *"
                              value={registerData.phone}
                              onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 ${colorTheme.focus} focus:outline-none`}
                              required
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setRegisterStep(1)}
                              className="flex-1 py-4 bg-white/5 border border-white/20 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
                            >
                              Geri
                            </button>
                            <button
                              type="submit"
                              className={`flex-1 py-4 bg-gradient-to-r ${colorTheme.gradient} rounded-xl text-white font-bold hover:shadow-lg ${colorTheme.glow} transition-all`}
                            >
                              Devam
                            </button>
                          </div>
                        </>
                      )}

                      {registerStep === 3 && (
                        <>
                          <div className="text-center mb-4">
                            <h3 className="text-white font-bold text-lg mb-2">Ek Bilgiler</h3>
                            <p className="text-white/60 text-sm">Bu bilgiler onay sürecini hızlandırır (opsiyonel)</p>
                          </div>

                          <div className="relative">
                            <MapPin className="absolute left-4 top-4 w-5 h-5 text-white/40" />
                            <textarea
                              placeholder="Adres (opsiyonel)"
                              value={registerData.address}
                              onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 ${colorTheme.focus} focus:outline-none resize-none`}
                              rows={2}
                            />
                          </div>

                          <div className="relative">
                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                              type="text"
                              placeholder="Vergi Numarası (opsiyonel)"
                              value={registerData.taxNumber}
                              onChange={(e) => setRegisterData({ ...registerData, taxNumber: e.target.value })}
                              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 ${colorTheme.focus} focus:outline-none`}
                            />
                          </div>

                          <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                              type="url"
                              placeholder="Website (opsiyonel)"
                              value={registerData.website}
                              onChange={(e) => setRegisterData({ ...registerData, website: e.target.value })}
                              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 ${colorTheme.focus} focus:outline-none`}
                            />
                          </div>

                          <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <select
                              value={registerData.businessType}
                              onChange={(e) => setRegisterData({ ...registerData, businessType: e.target.value })}
                              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-gray-800 backdrop-blur-sm border border-gray-600 text-white ${colorTheme.focus} focus:outline-none`}
                            >
                              <option value="" className="bg-gray-800 text-white">İş Türü Seçin (opsiyonel)</option>
                              {service === 'zorlu-ecu' && (
                                <>
                                  <option value="Oto Servis" className="bg-gray-800 text-white">Oto Servis</option>
                                  <option value="ECU Tuning" className="bg-gray-800 text-white">ECU Tuning</option>
                                  <option value="Performance Tuning" className="bg-gray-800 text-white">Performance Tuning</option>
                                  <option value="Oto Elektrik" className="bg-gray-800 text-white">Oto Elektrik</option>
                                  <option value="Motor Tamiri" className="bg-gray-800 text-white">Motor Tamiri</option>
                                  <option value="Diğer" className="bg-gray-800 text-white">Diğer</option>
                                </>
                              )}
                              {service === 'assetto-corsa' && (
                                <>
                                  <option value="Sim Racing">Sim Racing</option>
                                  <option value="Gaming Center">Gaming Center</option>
                                  <option value="Eğitim">Eğitim</option>
                                  <option value="Yarış Takımı">Yarış Takımı</option>
                                  <option value="Diğer">Diğer</option>
                                </>
                              )}
                              {service === 'ahmet-kanar' && (
                                <>
                                  <option value="Otomotiv">Otomotiv</option>
                                  <option value="Teknoloji">Teknoloji</option>
                                  <option value="Danışmanlık">Danışmanlık</option>
                                  <option value="Diğer">Diğer</option>
                                </>
                              )}
                            </select>
                          </div>

                          <div className="relative">
                            <MessageCircle className="absolute left-4 top-4 w-5 h-5 text-white/40" />
                            <textarea
                              placeholder="Mesajınız (opsiyonel) - Hangi hizmetlerden faydalanmak istediğinizi belirtin"
                              value={registerData.message}
                              onChange={(e) => setRegisterData({ ...registerData, message: e.target.value })}
                              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 ${colorTheme.focus} focus:outline-none resize-none`}
                              rows={3}
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setRegisterStep(2)}
                              className="flex-1 py-4 bg-white/5 border border-white/20 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
                            >
                              Geri
                            </button>
                            <button
                              type="submit"
                              className={`flex-1 py-4 bg-gradient-to-r ${colorTheme.gradient} rounded-xl text-white font-bold hover:shadow-lg ${colorTheme.glow} transition-all`}
                            >
                              Başvuru Gönder
                            </button>
                          </div>
                        </>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 backdrop-blur-xl bg-black/20 py-6 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/60 text-sm" style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}>
            2026 Copyright Nexaven | Yahya Öner
          </p>
        </div>
      </footer>
    </div>
  )
}
