import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { LogOut, FileText, MessageCircle, Upload, Clock, CheckCircle, Package, Zap, Download } from 'lucide-react'

export default function ZorluEcuSlaveDashboard() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'orders' | 'chat' | 'files'>('orders')
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    const corporateUser = localStorage.getItem('corporateUser')
    if (!corporateUser) {
      navigate('/login')
      return
    }
    const user = JSON.parse(corporateUser)
    if (user.service !== 'zorlu-ecu') {
      alert('Bu panele erişim yetkiniz yok!')
      navigate('/')
      return
    }
    setUserData(user)

    // Chat mesajlarını yükle
    const messages = JSON.parse(localStorage.getItem('adminChat_zorlu-ecu') || '[]')
    setChatMessages(messages)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('corporateUser')
    navigate('/')
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return
    const message = {
      sender: 'user',
      text: newMessage,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
    const updated = [...chatMessages, message]
    setChatMessages(updated)
    localStorage.setItem('adminChat_zorlu-ecu', JSON.stringify(updated))
    setNewMessage('')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      alert('Dosya yüklendi: ' + e.target.files[0].name)
    }
  }

  if (!userData) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              Zorlu ECU Kurumsal Panel
            </h1>
            <p className="text-white/60 text-sm">Motor Performans Hizmetleri</p>
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
            label="Dosya Yönetimi"
          />
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'chat' && <ChatTab messages={chatMessages} newMessage={newMessage} setNewMessage={setNewMessage} onSend={sendMessage} />}
          {activeTab === 'files' && <FilesTab onFileUpload={handleFileUpload} selectedFile={selectedFile} />}
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
    {
      id: '#ECU-001',
      service: 'ECU Stage 1 Remapping',
      vehicle: 'BMW 335i',
      status: 'completed',
      date: '15.01.2026',
      price: '₺3.500',
      power: '+45 HP',
      torque: '+60 Nm'
    },
    {
      id: '#ECU-002',
      service: 'Dyno Test & Analiz',
      vehicle: 'Audi A4 2.0 TDI',
      status: 'processing',
      date: '16.01.2026',
      price: '₺1.500',
      power: '-',
      torque: '-'
    },
    {
      id: '#ECU-003',
      service: 'Stage 2 Tuning',
      vehicle: 'VW Golf GTI',
      status: 'pending',
      date: '17.01.2026',
      price: '₺5.200',
      power: 'Bekliyor',
      torque: 'Bekliyor'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Siparişlerim</h2>
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-white font-bold text-lg">{order.id}</p>
                    {order.status === 'completed' && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Tamamlandı
                      </span>
                    )}
                    {order.status === 'processing' && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                        <Clock className="w-4 h-4" />
                        İşleniyor
                      </span>
                    )}
                    {order.status === 'pending' && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                        <Clock className="w-4 h-4" />
                        Beklemede
                      </span>
                    )}
                  </div>
                  <p className="text-white/80 text-lg mb-1">{order.service}</p>
                  <p className="text-white/60">Araç: {order.vehicle}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-xl">{order.price}</p>
                  <p className="text-white/60 text-sm">{order.date}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-white/40 text-xs">Güç Artışı</p>
                    <p className="text-white font-bold">{order.power}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-white/40 text-xs">Tork Artışı</p>
                    <p className="text-white font-bold">{order.torque}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ChatTab({ messages, newMessage, setNewMessage, onSend }: any) {
  return (
    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[600px] flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-6">Destek Chat</h2>
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">Henüz mesaj yok. İlk mesajı gönderin!</p>
          </div>
        ) : (
          messages.map((msg: any, index: number) => (
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
                <p className="font-medium mb-1 text-sm opacity-70">
                  {msg.sender === 'user' ? 'Siz' : 'Admin'}
                </p>
                <p>{msg.text}</p>
                <p className="text-xs mt-2 opacity-70">{msg.time}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSend()}
          placeholder="Mesajınızı yazın..."
          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-500"
        />
        <button
          onClick={onSend}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-xl text-white font-bold hover:shadow-lg transition-all"
        >
          Gönder
        </button>
      </div>
    </div>
  )
}

function FilesTab({ onFileUpload, selectedFile }: any) {
  const files = [
    { name: 'bmw_335i_original_backup.bin', size: '512 KB', date: '15.01.2026', type: 'Original Backup', status: 'completed' },
    { name: 'bmw_335i_stage1_remapped.bin', size: '512 KB', date: '15.01.2026', type: 'Stage 1 Remap', status: 'completed' },
    { name: 'dyno_test_results.pdf', size: '2.4 MB', date: '16.01.2026', type: 'Dyno Report', status: 'completed' }
  ]

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Dosya Yükle</h2>
        <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-red-500/50 transition-all">
          <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <p className="text-white/60 mb-4">
            ECU dosyanızı buraya sürükleyin veya tıklayın
          </p>
          <input
            type="file"
            onChange={onFileUpload}
            accept=".bin,.hex,.map"
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-xl text-white font-bold cursor-pointer hover:shadow-lg transition-all"
          >
            Dosya Seç
          </label>
          {selectedFile && (
            <p className="text-green-400 mt-4">Seçili: {selectedFile.name}</p>
          )}
        </div>
      </div>

      {/* Files List */}
      <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Dosyalarım</h2>
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
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm">
                  {file.type}
                </span>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-white" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
