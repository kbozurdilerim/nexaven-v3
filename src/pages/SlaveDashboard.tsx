import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { LogOut, FileText, MessageCircle, Upload, Clock, CheckCircle, Package } from 'lucide-react'

export default function SlaveDashboard() {
  const navigate = useNavigate()
  const { service } = useParams()
  const [userData, setUserData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'orders' | 'chat' | 'files'>('orders')

  useEffect(() => {
    // Check if user is logged in
    const corporateUser = localStorage.getItem('corporateUser')
    if (!corporateUser) {
      navigate('/login')
      return
    }
    setUserData(JSON.parse(corporateUser))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('corporateUser')
    navigate('/')
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-black/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Kurumsal Panel</h1>
            <p className="text-white/60 text-sm capitalize">{service || 'Nexaven'}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-medium">{userData.email}</p>
              <p className="text-white/60 text-sm">Kurumsal Müşteri</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 p-1 bg-white/5 rounded-xl border border-white/10">
          <TabButton
            active={activeTab === 'orders'}
            onClick={() => setActiveTab('orders')}
            icon={Package}
            label="Siparişlerim"
          />
          <TabButton
            active={activeTab === 'chat'}
            onClick={() => setActiveTab('chat')}
            icon={MessageCircle}
            label="Destek Chat"
          />
          <TabButton
            active={activeTab === 'files'}
            onClick={() => setActiveTab('files')}
            icon={FileText}
            label="Dosyalarım"
          />
        </div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'chat' && <ChatTab />}
          {activeTab === 'files' && <FilesTab />}
        </motion.div>
      </main>
    </div>
  )
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
        active
          ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  )
}

function OrdersTab() {
  const orders = [
    { id: '#ORD-001', service: 'ECU Tuning Stage 1', status: 'completed', date: '15.01.2026', price: '₺2.500' },
    { id: '#ORD-002', service: 'Dyno Test', status: 'processing', date: '16.01.2026', price: '₺1.200' },
    { id: '#ORD-003', service: 'Stage 2 Tuning', status: 'pending', date: '17.01.2026', price: '₺3.800' }
  ]

  return (
    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Siparişlerim</h2>
      <div className="space-y-4">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white font-bold">{order.id}</p>
                <p className="text-white/80">{order.service}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{order.price}</p>
                <p className="text-white/60 text-sm">{order.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {order.status === 'completed' && (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 text-sm">Tamamlandı</span>
                </>
              )}
              {order.status === 'processing' && (
                <>
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-500 text-sm">İşleniyor</span>
                </>
              )}
              {order.status === 'pending' && (
                <>
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-500 text-sm">Beklemede</span>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function ChatTab() {
  const [message, setMessage] = useState('')
  const [messages] = useState([
    { sender: 'admin', text: 'Merhaba! Size nasıl yardımcı olabilirim?', time: '10:30' },
    { sender: 'user', text: 'Stage 2 tuning hakkında bilgi almak istiyorum.', time: '10:32' },
    { sender: 'admin', text: 'Tabii ki! Stage 2 tuning ile %35-45 arası güç artışı sağlayabilirsiniz.', time: '10:35' }
  ])

  return (
    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[600px] flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-6">Destek Chat</h2>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                  : 'bg-white/10 text-white'
              }`}
            >
              <p>{msg.text}</p>
              <p className="text-xs mt-2 opacity-70">{msg.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesajınızı yazın..."
          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-500"
        />
        <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-xl text-white font-bold hover:shadow-lg transition-all">
          Gönder
        </button>
      </div>
    </div>
  )
}

function FilesTab() {
  const files = [
    { name: 'ecu_backup_original.bin', size: '512 KB', date: '15.01.2026', type: 'Original' },
    { name: 'ecu_stage1_tuned.bin', size: '512 KB', date: '15.01.2026', type: 'Tuned' },
    { name: 'dyno_test_report.pdf', size: '2.4 MB', date: '16.01.2026', type: 'Report' }
  ]

  return (
    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Dosyalarım</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 rounded-lg text-white font-bold hover:shadow-lg transition-all">
          <Upload className="w-5 h-5" />
          Dosya Yükle
        </button>
      </div>

      <div className="space-y-3">
        {files.map((file, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-red-600 to-red-500 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-white/60 text-sm">{file.size} • {file.date}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm">
              {file.type}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
