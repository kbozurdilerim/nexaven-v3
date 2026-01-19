import { useState } from 'react'
import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Server, Zap, Award } from 'lucide-react'
import { Link } from 'react-router-dom'
import AssettoCorsaSection from '../sections/AssettoCorsaSection'
import ZorluEcuSection from '../sections/ZorluEcuSection'
import AhmetKanarSection from '../sections/AhmetKanarSection'
import { Sparkles } from '../components/ui/sparkles'
// Production mode: fixed admin accounts are handled elsewhere; no test data

type TabType = 'assetto' | 'zorlu' | 'ahmet' | null

// Typewriter effect component with blinking cursor before typing
function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [startTyping, setStartTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Blink cursor 3 times before starting
  React.useEffect(() => {
    const blinkCount = 6 // 3 tam yanıp-sönme
    let count = 0
    const blinkInterval = setInterval(() => {
      setShowCursor(prev => !prev)
      count++
      if (count >= blinkCount) {
        clearInterval(blinkInterval)
        setShowCursor(true)
        setStartTyping(true)
      }
    }, 500) // Her 500ms'de yanıp sönsün
    
    return () => clearInterval(blinkInterval)
  }, [])

  // Start typing after blinking
  React.useEffect(() => {
    if (!startTyping) return
    
    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1))
      }, 150) // Daha yavaş yazma hızı
      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [displayedText, text, startTyping])

  return (
    <span className="font-bold text-white relative inline-block">
      <span className="relative z-10 text-white">
        {displayedText}
      </span>
      {!isComplete && showCursor && (
        <span className="text-white">_</span>
      )}
    </span>
  )
}

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<TabType>(null)
  const [theme] = useState<'dark' | 'light'>('dark')

  // No test data initialization - production ready

  const services = [
    {
      id: 'assetto' as TabType,
      name: 'Nexaven | Core',
      subtitle: 'Size Özel Türkiyenin En Gelişmiş',
      description: 'Assetto Corsa sunucuları için profesyonel hosting ve yönetim çözümleri',
      icon: Server,
      color: 'from-blue-500 to-cyan-500',
      loginUrl: '/login?service=nexaven-core'
    },
    {
      id: 'zorlu' as TabType,
      name: 'Zorlu Ecu | Remapping',
      subtitle: 'Feel The Fast Power',
      description: 'Motor performans yazılımı, ECU tuning ve chip tuning hizmetleri',
      icon: Zap,
      color: 'from-red-600 to-red-500',
      loginUrl: '/login?service=zorlu-ecu'
    },
    {
      id: 'ahmet' as TabType,
      name: 'Ahmet KANAR | NXD',
      subtitle: 'NXD Diskless',
      description: 'Diskless sistem çözümleri ve network boot teknolojileri',
      icon: Award,
      color: 'from-purple-500 to-pink-500',
      loginUrl: '/login?service=ahmet-kanar'
    }
  ]

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
        {!activeTab ? (
          <div className="container mx-auto px-4 py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-6xl md:text-8xl font-bold mb-4" style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}>
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                  <motion.span
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      backgroundImage: 'linear-gradient(90deg, #22d3ee, #a855f7, #ec4899, #22d3ee)',
                      backgroundSize: '200% 100%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Nexaven
                  </motion.span>
                </span>
              </h1>
              <p className="text-2xl md:text-3xl mb-12 neon-text-slogan" style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}>
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                  <TypewriterText text="Engineered To Be Slient... Built To Dominate..." />
                </span>
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="group relative cursor-pointer"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity`} />
                    
                    <div className="relative p-10 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 group-hover:border-white/30 transition-all h-full flex flex-col">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text" style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}>
                        {service.name}
                      </h3>
                      <p className="text-sm text-white/60 mb-2" style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}>{service.subtitle}</p>
                      <p className="text-white/70 mb-6 flex-grow" style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}>{service.description}</p>
                      
                      <div className="flex gap-3">
                        <Link to={`/${service.id === 'assetto' ? 'nexaven-core' : service.id === 'zorlu' ? 'zorlu-ecu' : 'ahmet-kanar'}/kesfet`} className="w-full">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className={`w-full px-4 py-2 bg-gradient-to-r ${service.color} rounded-lg text-white font-bold hover:shadow-lg transition-all text-sm`}
                            style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}
                          >
                            Keşfet
                          </motion.button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <div className="relative">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setActiveTab(null)}
                className="absolute top-4 left-4 z-20 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
                style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}
              >
                ← Geri Dön
              </motion.button>
              
              {activeTab === 'assetto' && (
                <motion.div
                  key="assetto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <AssettoCorsaSection />
                </motion.div>
              )}
              
              {activeTab === 'zorlu' && (
                <motion.div
                  key="zorlu"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <ZorluEcuSection />
                </motion.div>
              )}
              
              {activeTab === 'ahmet' && (
                <motion.div
                  key="ahmet"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <AhmetKanarSection />
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        )}
      </div>

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
