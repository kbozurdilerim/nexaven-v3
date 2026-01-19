import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Glitchy404 } from '../components/ui/glitchy-404'
import { Sparkles } from '../components/ui/sparkles'

export default function NotFound() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(15)
  const [theme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center relative overflow-hidden" style={{ userSelect: 'none', WebkitUserSelect: 'none' } as any}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0),rgba(0,0,0,0.8))]" />
      
      <Sparkles
        density={800}
        className="absolute inset-0 w-full h-full pointer-events-none"
        color={theme === "dark" ? "#ffffff" : "#000000"}
        size={1.5}
        opacity={0.3}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center px-4 relative z-10"
      >
        {/* Glitch 404 Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <Glitchy404 />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-6"
        >
          <p className="text-2xl md:text-3xl font-bold text-white mb-3">
            Sayfa Bulunamadı
          </p>

          <p className="text-lg text-white/70 mb-8 max-w-md mx-auto">
            Aradığınız sayfa mevcut değil veya kaldırılmış olabilir.
          </p>
        </motion.div>

        {/* Auto Redirect Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-sm text-white/50 font-mono"
        >
          <p>Otomatik olarak <span className="text-red-400 font-bold">{countdown}</span> saniye içinde ana sayfaya dönülecek...</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
