import { motion } from 'framer-motion'
import { Server, Users, Gauge, Trophy, Clock, Globe } from 'lucide-react'

const AssettoCorsaSection = () => {
  const features = [
    {
      icon: Server,
      title: 'Yüksek Performans',
      description: 'Ultra düşük ping ve maksimum performans'
    },
    {
      icon: Users,
      title: '100+ Aktif Oyuncu',
      description: 'Büyük ve aktif topluluk'
    },
    {
      icon: Gauge,
      title: 'Özel Modlar',
      description: 'Özel araç ve pist modları'
    },
    {
      icon: Trophy,
      title: 'Turnuvalar',
      description: 'Düzenli yarış etkinlikleri'
    },
    {
      icon: Clock,
      title: '7/24 Aktif',
      description: 'Kesintisiz hizmet'
    },
    {
      icon: Globe,
      title: 'Global Erişim',
      description: 'Dünya çapında düşük ping'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-20" style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent drop-shadow-lg" style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}>
          Nexaven Assetto Corsa
        </h1>
        <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto" style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}>
          Türkiye'nin en gelişmiş ve profesyonel Assetto Corsa yarış sunucusu
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105"
              style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-white" style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}>{feature.title}</h3>
                <p className="text-white/70" style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}>{feature.description}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Pricing Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-16"
      >
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Üyelik Paketleri
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Package */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 transition-all group"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Ücretsiz</h3>
              <div className="text-5xl font-bold text-cyan-400 mb-2">₺0</div>
              <p className="text-white/60">/ ay</p>
            </div>
            
            <ul className="space-y-3 mb-8 text-white/80">
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-500" />
                </div>
                Genel sunuculara erişim
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-500" />
                </div>
                Temel araç paketi
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-500" />
                </div>
                Topluluk desteği
              </li>
            </ul>
          </motion.div>

          {/* Premium Package */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="relative p-8 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500 hover:border-cyan-400 transition-all group scale-105"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full text-white text-sm font-bold">
              Popüler
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <div className="text-5xl font-bold text-cyan-400 mb-2">₺99</div>
              <p className="text-white/60">/ ay</p>
            </div>
            
            <ul className="space-y-3 mb-8 text-white">
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                Tüm özellikler
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                VIP sunucular
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                Özel araç modları
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                Öncelikli destek
              </li>
            </ul>
          </motion.div>

          {/* Pro Package */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 transition-all group"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="text-5xl font-bold text-blue-400 mb-2">₺199</div>
              <p className="text-white/60">/ ay</p>
            </div>
            
            <ul className="space-y-3 mb-8 text-white/80">
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                Premium özellikleri
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                Özel turnuvalara katılım
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                Sınırsız setup paylaşımı
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                1-on-1 koçluk
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold text-cyan-400 mb-2">500+</div>
            <div className="text-white/70">Toplam Yarış</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-cyan-400 mb-2">99.9%</div>
            <div className="text-white/70">Uptime</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-cyan-400 mb-2">5ms</div>
            <div className="text-white/70">Ortalama Ping</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AssettoCorsaSection
