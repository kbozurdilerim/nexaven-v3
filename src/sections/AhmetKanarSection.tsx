import { motion } from 'framer-motion'
import { Award, Star, Server, Network, Shield, Zap, Sparkles, Trophy, HardDrive, MonitorPlay } from 'lucide-react'

const AhmetKanarSection = () => {
  const services = [
    {
      icon: Server,
      title: 'NXD Diskless Sistem',
      description: 'Network boot çözümü ile disksiz bilgisayar yönetimi',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Network,
      title: 'Merkezi Yönetim',
      description: 'Tek noktadan tüm bilgisayarları yönetin',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Shield,
      title: 'Güvenlik & Koruma',
      description: 'Virüs ve zararlı yazılımlara karşı tam koruma',
      color: 'from-purple-600 to-indigo-500'
    },
    {
      icon: Zap,
      title: 'Hızlı Performans',
      description: 'SSD hızında network boot teknolojisi',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: HardDrive,
      title: 'Tasarruf',
      description: 'Disk maliyetlerinden %100 tasarruf',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: MonitorPlay,
      title: 'İnternet Cafe Çözümü',
      description: 'Oyun salonları için optimize edilmiş sistem',
      color: 'from-cyan-500 to-teal-500'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="inline-flex items-center gap-3 mb-6"
        >
          <Award className="w-20 h-20 text-purple-500" />
          <Trophy className="w-20 h-20 text-pink-500" />
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            Ahmet Kanar
          </span>
        </h1>
        <p className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          NXD Diskless Premium
        </p>
        <p className="text-xl text-white/70 max-w-3xl mx-auto">
          NXD Diskless sisteminin Türkiye'deki tek yetkili distribütörü
        </p>
        <div className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-full">
          <p className="text-white/90 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Türkiye'nin #1 NXD Çözüm Ortağı
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {services.map((service, index) => {
          const Icon = service.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity`} />
              
              <div className="relative p-6 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 group-hover:border-white/30 transition-all h-full">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-white">{service.title}</h3>
                <p className="text-white/70 text-sm">{service.description}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="p-8 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <Server className="w-8 h-8 text-purple-400" />
            <h3 className="text-3xl font-bold text-white">NXD Diskless Nedir?</h3>
          </div>
          
          <div className="space-y-4 text-white/80">
            <p>
              NXD Diskless, bilgisayarların sabit disk olmadan çalışmasını sağlayan devrim niteliğinde bir teknolojidir.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <span>Tüm veriler merkezi sunucuda güvende</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <span>Anında sistem güncellemesi ve kurulumu</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <span>%100 disk arıza koruması</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <span>Düşük maliyet, yüksek verimlilik</span>
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="p-8 rounded-3xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-8 h-8 text-pink-400" />
            <h3 className="text-3xl font-bold text-white">Referanslarımız</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'GameZone İnternet Cafe', location: 'İstanbul', count: '50+ Bilgisayar' },
              { name: 'CyberArena Gaming', location: 'Ankara', count: '80+ Bilgisayar' },
              { name: 'PixelClub Esports', location: 'İzmir', count: '100+ Bilgisayar' }
            ].map((ref, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500/50 transition-colors"
              >
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold">{ref.name}</div>
                  <div className="text-pink-400 text-sm">{ref.location}</div>
                  <div className="text-white/60 text-sm">{ref.count}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-xl mb-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold text-purple-400 mb-2">2000+</div>
            <div className="text-white/70">Aktif Bilgisayar</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-pink-400 mb-2">150+</div>
            <div className="text-white/70">İnternet Cafe</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-purple-400 mb-2">99.9%</div>
            <div className="text-white/70">Uptime</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-pink-400 mb-2">24/7</div>
            <div className="text-white/70">Teknik Destek</div>
          </div>
        </div>
      </motion.div>

      {/* Pricing Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="mb-16"
      >
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Üyelik Seçenekleri
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Package */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4 }}
            className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all group"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <div className="text-5xl font-bold text-purple-400 mb-2">₺15.000</div>
              <p className="text-white/60">Tek Seferlik</p>
            </div>
            
            <ul className="space-y-3 mb-8 text-white/80">
              <li className="flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-500" />
                10 Bilgisayarlık Lisans
              </li>
              <li className="flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-500" />
                Kurulum & Eğitim
              </li>
              <li className="flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-500" />
                3 Ay Destek
              </li>
              <li className="flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-500" />
                Temel Özellikler
              </li>
            </ul>
          </motion.div>

          {/* Premium Package */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="relative p-8 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500 hover:border-purple-400 transition-all group scale-105"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-bold">
              Önerilen
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
              <div className="text-5xl font-bold text-purple-400 mb-2">₺40.000</div>
              <p className="text-white/60">Tek Seferlik</p>
            </div>
            
            <ul className="space-y-3 mb-8 text-white">
              <li className="flex items-center gap-2">
                <Network className="w-5 h-5 text-purple-400" />
                50 Bilgisayarlık Lisans
              </li>
              <li className="flex items-center gap-2">
                <Network className="w-5 h-5 text-purple-400" />
                Gelişmiş Kurulum
              </li>
              <li className="flex items-center gap-2">
                <Network className="w-5 h-5 text-purple-400" />
                1 Yıl Premium Destek
              </li>
              <li className="flex items-center gap-2">
                <Network className="w-5 h-5 text-purple-400" />
                Tüm Özellikler
              </li>
              <li className="flex items-center gap-2">
                <Network className="w-5 h-5 text-purple-400" />
                Özel Entegrasyonlar
              </li>
            </ul>
          </motion.div>

          {/* Pro Package */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6 }}
            className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-pink-500/50 transition-all group"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <div className="text-5xl font-bold text-pink-400 mb-2">Özel Teklif</div>
              <p className="text-white/60">100+ Bilgisayar</p>
            </div>
            
            <ul className="space-y-3 mb-8 text-white/80">
              <li className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                Sınırsız Lisans
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                Özel Sunucu Kurulumu
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                Ömür Boyu Destek
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                Özel Yazılım Geliştirme
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                7/24 Teknik Ekip
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default AhmetKanarSection
