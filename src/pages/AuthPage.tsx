import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, Building2, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { getAdminAccounts } from '../utils/testData'

type AuthMode = 'login' | 'register'

interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  companyName: string
  contactName: string
  phone: string
}

export default function AuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { service: serviceParam } = useParams()
  
  // URL'den service parametresini al (önce URL path'inden, sonra query string'den)
  const service = serviceParam || searchParams.get('service') || 'nexaven-core'
  
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [registerStep, setRegisterStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  // Register form state
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    contactName: '',
    phone: ''
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Get admin accounts from test data
    const adminAccounts = getAdminAccounts()
    const serviceAdmin = adminAccounts[service]
    
    // Admin login kontrolü - sadece ilgili servisin admini girebilir
    if (serviceAdmin && loginData.email === serviceAdmin.email && loginData.password === serviceAdmin.password) {
      // Admin bilgisini localStorage'a kaydet
      localStorage.setItem('adminUser', JSON.stringify({
        email: serviceAdmin.email,
        role: 'admin',
        service: service,
        loginTime: new Date().toISOString()
      }))
      navigate(`/${service}/admin/dashboard`)
    } else if (loginData.email && loginData.password) {
      // Kurumsal hesap kontrolü - her servis kendi kullanıcılarını yönetir
      const existingUsers = JSON.parse(localStorage.getItem(`corporateUsers_${service}`) || '[]')
      const user = existingUsers.find((u: any) => u.email === loginData.email && u.password === loginData.password && u.approved === true)
      
      if (user) {
        localStorage.setItem('corporateUser', JSON.stringify({
          email: loginData.email,
          role: 'slave',
          service: service,
          loginTime: new Date().toISOString()
        }))
        navigate(`/${service}/slave/dashboard`)
      } else {
        alert('Geçersiz kullanıcı bilgileri! Lütfen önce kayıt olun.')
      }
    } else {
      alert('Email ve şifre gereklidir!')
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (registerStep === 1) {
      // Validate step 1
      if (registerData.email && registerData.password === registerData.confirmPassword) {
        setRegisterStep(2)
      } else {
        alert('Lütfen geçerli bilgiler girin ve şifrelerin eşleştiğinden emin olun!')
      }
    } else {
      // Submit registration - her servis için ayrı kayıt
      const existingUsers = JSON.parse(localStorage.getItem(`corporateUsers_${service}`) || '[]')
      existingUsers.push({
        email: registerData.email,
        password: registerData.password,
        companyName: registerData.companyName,
        contactName: registerData.contactName,
        phone: registerData.phone,
        service: service,
        approved: false,
        createdAt: new Date().toISOString()
      })
      localStorage.setItem(`corporateUsers_${service}`, JSON.stringify(existingUsers))
      
      setSubmitted(true)
      setTimeout(() => {
        navigate('/')
      }, 3000)
    }
  }

  const getTitle = () => {
    if (service === 'nexaven-core') return 'Nexaven Core'
    if (service === 'zorlu-ecu') return 'Zorlu ECU'
    if (service === 'ahmet-kanar') return 'Ahmet KANAR'
    return 'Giriş Yap'
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="mb-6 inline-block"
          >
            <CheckCircle className="w-24 h-24 text-green-500" />
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-3">Başvuru Gönderildi!</h2>
          <p className="text-white/70 mb-6">
            Kurumsal hesabınız yönetici onayı beklemektedir. Onay aldıktan sonra giriş yapabileceksiniz.
          </p>

          <p className="text-sm text-white/50">
            Ana sayfaya yönlendiriliyorsunuz...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent mb-2">
              {getTitle()}
            </h1>
            <p className="text-white/70">Giriş yapın veya kurumsal hesap oluşturun</p>
          </motion.div>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 mb-8 p-1 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
          <button
            onClick={() => {
              setMode('login')
              setRegisterStep(1)
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              mode === 'login'
                ? 'bg-red-600/50 text-white backdrop-blur-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              mode === 'register'
                ? 'bg-red-600/50 text-white backdrop-blur-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Kayıt Ol
          </button>
        </div>

        {/* Login Form */}
        {mode === 'login' && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleLogin}
            className="space-y-4"
          >
            <div>
              <label className="block text-white/80 text-sm mb-2">E-mail Adresi</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-red-400/50" />
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  placeholder="example@company.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none transition-colors user-select-none"
                  style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-red-400/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none transition-colors user-select-none"
                  style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-lg text-white font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center justify-center gap-2"
            >
              Giriş Yap
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleRegister}
            className="space-y-4"
          >
            {/* Step 1: Account Info */}
            {registerStep === 1 && (
              <>
                <div>
                  <label className="block text-white/80 text-sm mb-2">E-mail Adresi</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-red-400/50" />
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      placeholder="example@company.com"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none transition-colors user-select-none"
                      style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Şifre</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-red-400/50" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="w-full pl-12 pr-12 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none transition-colors user-select-none"
                      style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Şifre Tekrarı</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-red-400/50" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="w-full pl-12 pr-12 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none transition-colors user-select-none"
                      style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}
                    />
                  </div>
                  {registerData.password !== registerData.confirmPassword && registerData.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">Şifreler eşleşmiyor</p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-lg text-white font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all"
                >
                  Devam Et
                </motion.button>
              </>
            )}

            {/* Step 2: Company Info */}
            {registerStep === 2 && (
              <>
                <div>
                  <label className="block text-white/80 text-sm mb-2">Şirket Adı</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-3.5 w-5 h-5 text-red-400/50" />
                    <input
                      type="text"
                      value={registerData.companyName}
                      onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
                      placeholder="Şirketinizin adı"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none transition-colors user-select-none"
                      style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">İletişim Kişisi Adı</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-red-400/50" />
                    <input
                      type="text"
                      value={registerData.contactName}
                      onChange={(e) => setRegisterData({ ...registerData, contactName: e.target.value })}
                      placeholder="Adınız soyadınız"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none transition-colors user-select-none"
                      style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">Telefon Numarası</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 w-5 h-5 text-red-400/50" />
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      placeholder="+90 (555) 123-4567"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:border-red-500 focus:outline-none transition-colors user-select-none"
                      style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    type="button"
                    onClick={() => setRegisterStep(1)}
                    className="flex-1 py-3 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-white font-bold hover:bg-white/20 transition-all"
                  >
                    Geri
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-lg text-white font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all"
                  >
                    Kayıt Ol
                  </motion.button>
                </div>
              </>
            )}
          </motion.form>
        )}

        {/* Footer */}
        <p className="text-center text-white/50 text-xs mt-8" style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}>
          Tüm hakları saklıdır © 2026 Nexaven
        </p>
      </motion.div>
    </div>
  )
}
