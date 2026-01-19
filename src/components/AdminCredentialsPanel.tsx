import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'

interface AdminCredentialsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminCredentialsPanel({ isOpen, onClose }: AdminCredentialsPanelProps) {
  const [copied, setCopied] = useState<string>('')
  const [showCustomers, setShowCustomers] = useState(false)

  const credentials = [
    {
      service: 'Nexaven Core',
      email: 'admin@nexavencore.com',
      password: 'NexavenAdmin2026!',
      color: 'from-cyan-500 to-blue-600',
      customers: [
        { email: 'racing@speedteam.com', password: 'Demo1234', company: 'Speed Racing Team' },
        { email: 'info@simracingpro.com', password: 'Demo1234', company: 'SimRacing Pro League' }
      ]
    },
    {
      service: 'Zorlu ECU',
      email: 'admin@zorluecu.com',
      password: 'ZorluECU2026!',
      color: 'from-red-600 to-pink-600',
      customers: [
        { email: 'test.customer@autotuning.com', password: 'Demo1234', company: 'Auto Tuning Services' },
        { email: 'info@performancegarage.com.tr', password: 'Demo1234', company: 'Performance Garage' },
        { email: 'contact@ecu-master.com', password: 'Demo1234', company: 'ECU Master' }
      ]
    },
    {
      service: 'Ahmet KANAR',
      email: 'admin@ahmetkanar.com',
      password: 'AhmetKanar2026!',
      color: 'from-purple-600 to-pink-600',
      customers: [
        { email: 'contact@luxurydetail.com', password: 'Demo1234', company: 'Luxury Detail Studio' },
        { email: 'info@autocare-istanbul.com', password: 'Demo1234', company: 'AutoCare Istanbul' }
      ]
    }
  ]

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(''), 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-2xl">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute -top-4 -right-4 w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-2">🔐 Admin Hesapları</h2>
                <p className="text-white/60 mb-6">Her servisin kendine özel admin hesabı bulunmaktadır.</p>

                {/* Tab Buttons */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setShowCustomers(false)}
                    className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all ${
                      !showCustomers
                        ? 'bg-white/10 text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    👨‍💼 Admin
                  </button>
                  <button
                    onClick={() => setShowCustomers(true)}
                    className={`flex-1 py-2 px-4 rounded-lg font-bold transition-all ${
                      showCustomers
                        ? 'bg-white/10 text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    👥 Müşteriler
                  </button>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">{!showCustomers ? (
                  // Admin Credentials
                  credentials.map((cred, index) => (
                    <motion.div
                      key={cred.service}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                      <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${cred.color} text-white font-bold text-sm mb-4`}>
                        {cred.service}
                      </div>

                      <div className="space-y-3">
                        {/* Email */}
                        <div>
                          <label className="text-white/60 text-sm block mb-1">Email</label>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white font-mono text-sm">
                              {cred.email}
                            </code>
                            <button
                              onClick={() => copyToClipboard(cred.email, `${cred.service}-email`)}
                              className="p-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-all"
                              title="Kopyala"
                            >
                              {copied === `${cred.service}-email` ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : (
                                <Copy className="w-5 h-5 text-white/60" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Password */}
                        <div>
                          <label className="text-white/60 text-sm block mb-1">Şifre</label>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white font-mono text-sm">
                              {cred.password}
                            </code>
                            <button
                              onClick={() => copyToClipboard(cred.password, `${cred.service}-password`)}
                              className="p-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-all"
                              title="Kopyala"
                            >
                              {copied === `${cred.service}-password` ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : (
                                <Copy className="w-5 h-5 text-white/60" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  // Customer Credentials
                  credentials.map((cred, index) => (
                    <motion.div
                      key={cred.service}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                      <div className={`inline-block px-4 py-1 rounded-full bg-gradient-to-r ${cred.color} text-white font-bold text-sm mb-4`}>
                        {cred.service}
                      </div>

                      <div className="space-y-3">
                        {cred.customers.map((customer, idx) => (
                          <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <p className="text-white/80 font-bold mb-2">{customer.company}</p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <code className="flex-1 px-3 py-1 bg-white/5 rounded text-white/70 font-mono text-xs">
                                  {customer.email}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(customer.email, `${cred.service}-${idx}-email`)}
                                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded transition-all"
                                >
                                  {copied === `${cred.service}-${idx}-email` ? (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <Copy className="w-4 h-4 text-white/60" />
                                  )}
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <code className="flex-1 px-3 py-1 bg-white/5 rounded text-white/70 font-mono text-xs">
                                  {customer.password}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(customer.password, `${cred.service}-${idx}-pass`)}
                                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded transition-all"
                                >
                                  {copied === `${cred.service}-${idx}-pass` ? (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <Copy className="w-4 h-4 text-white/60" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))
                )}
                </div>

                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <p className="text-yellow-400 text-sm">
                    <strong>⚠️ Not:</strong> Bu hesaplar sadece test amaçlıdır. Üretim ortamında güçlü şifreler kullanın.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
