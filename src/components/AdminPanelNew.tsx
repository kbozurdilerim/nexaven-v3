import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, LogOut, Settings, DollarSign, MessageCircle, Upload, Trash2, CheckCircle, Clock, Send } from 'lucide-react'

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
  adminRole: 'zorlu' | 'assetto' | 'ahmet'
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, adminRole }) => {
  const adminTitle = adminRole === 'zorlu' ? 'Zorlu ECU' : adminRole === 'assetto' ? 'Assetto Corsa' : 'Ahmet KANAR'
  const [activeTab, setActiveTab] = useState('pricing')
  const [chatMessages, setChatMessages] = useState<any[]>([
    { id: 1, sender: 'customer', name: 'Yahya Öner', message: 'Merhaba, stage 1 hakkında bilgi almak istiyorum', timestamp: '14:30' },
    { id: 2, sender: 'admin', name: 'Admin', message: 'Merhaba Yahya! Stage 1 tuning hakkında detaylı bilgi vermek istiyorum. Aracınızın modelini söyleyebilir misiniz?', timestamp: '14:31' },
    { id: 3, sender: 'customer', name: 'Yahya Öner', message: '2018 BMW 320i', timestamp: '14:32' }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([
    { id: 1, name: 'BMW_320i_original.bin', size: '2.4 MB', uploadDate: '2026-01-15', status: 'waiting', customer: 'Yahya Öner', plate: '34ABC123' },
    { id: 2, name: 'Ford_Focus_original.bin', size: '1.8 MB', uploadDate: '2026-01-14', status: 'processing', customer: 'Mehmet Yılmaz', plate: '35XYZ789' }
  ])
  const [transactions] = useState<any[]>([
    { id: 1, customer: 'Yahya Öner', service: 'Stage 1 ECU', amount: 1600, date: '2026-01-15', status: 'completed', plate: '34ABC123' },
    { id: 2, customer: 'Mehmet Yılmaz', service: 'DPF Delete', amount: 850, date: '2026-01-14', status: 'pending', plate: '35XYZ789' },
    { id: 3, customer: 'Ahmet Demir', service: 'Stage 2 ECU', amount: 2200, date: '2026-01-10', status: 'completed', plate: '34DEF456' }
  ])
  const [pricingData] = useState({
    zorlu: {
      oncesi2019: { sadece_iptal: 1100, stage1: 1600, stage1_only: 1100 },
      sonrasi2019: { sadece_iptal: 1350, stage1: 1850, stage1_only: 1350 },
      sadece_iptal: { price: 850, stage1: 1350 }
    }
  })

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, {
        id: chatMessages.length + 1,
        sender: 'admin',
        name: 'Admin',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }])
      setNewMessage('')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      const file = files[0]
      setUploadedFiles([...uploadedFiles, {
        id: uploadedFiles.length + 1,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        uploadDate: new Date().toLocaleDateString('tr-TR'),
        status: 'waiting',
        customer: 'Müşteri Adı',
        plate: '34ABC123'
      }])
    }
  }

  const handleFileDelete = (fileId: number) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId))
  }

  const handleProcessFile = (fileId: number) => {
    setUploadedFiles(uploadedFiles.map(f => 
      f.id === fileId ? { ...f, status: 'processing' } : f
    ))
  }

  const handleCompleteFile = (fileId: number) => {
    setUploadedFiles(uploadedFiles.map(f => 
      f.id === fileId ? { ...f, status: 'completed' } : f
    ))
  }

  const renderChat = () => (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white mb-4">💬 Admin Sohbeti</h3>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-96 overflow-y-auto">
        <div className="space-y-4">
          {chatMessages.map((msg: any) => (
            <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                msg.sender === 'admin'
                  ? 'bg-orange-500/30 border border-orange-500/50'
                  : 'bg-white/10 border border-white/20'
              }`}>
                <p className={`text-sm font-semibold mb-1 ${msg.sender === 'admin' ? 'text-orange-400' : 'text-blue-400'}`}>
                  {msg.name}
                </p>
                <p className="text-white text-sm">{msg.message}</p>
                <p className="text-white/40 text-xs mt-1">{msg.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Mesaj yazın..."
          className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-orange-500 focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white font-bold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Gönder
        </button>
      </div>
    </div>
  )

  const renderFileManagement = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white mb-4">📤 Dosya Yönetimi</h3>
      
      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
        <label className="flex items-center justify-center gap-3 cursor-pointer">
          <Upload className="w-6 h-6 text-blue-400" />
          <span className="text-white font-semibold">ECU Dosyası Yükleyin</span>
          <input
            type="file"
            accept=".bin,.hex"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="space-y-3">
        {uploadedFiles.map((file: any) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-semibold text-white">{file.name}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    file.status === 'completed'
                      ? 'bg-green-500/20 text-green-400'
                      : file.status === 'processing'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {file.status === 'completed' ? '✓ Tamamlandı' : file.status === 'processing' ? '⏳ İşleniyor' : '⏱ Bekleniyor'}
                  </span>
                </div>
                <p className="text-sm text-white/60 mb-1">Müşteri: {file.customer} ({file.plate})</p>
                <p className="text-sm text-white/50">{file.size} • Yüklenme: {file.uploadDate}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleProcessFile(file.id)}
                  disabled={file.status !== 'waiting'}
                  className="p-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-yellow-400 transition-all"
                  title="İşlemeye Başla"
                >
                  <Clock className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCompleteFile(file.id)}
                  disabled={file.status !== 'processing'}
                  className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-green-400 transition-all"
                  title="Tamamla"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleFileDelete(file.id)}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderTransactions = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white mb-4">💳 İşlem Geçmişi</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10">
            <tr>
              <th className="px-4 py-3 text-white/80 font-semibold">Müşteri</th>
              <th className="px-4 py-3 text-white/80 font-semibold">Plaka</th>
              <th className="px-4 py-3 text-white/80 font-semibold">Hizmet</th>
              <th className="px-4 py-3 text-white/80 font-semibold">Tutar</th>
              <th className="px-4 py-3 text-white/80 font-semibold">Tarih</th>
              <th className="px-4 py-3 text-white/80 font-semibold">Durum</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx: any) => (
              <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-white">{tx.customer}</td>
                <td className="px-4 py-3 text-white/70">{tx.plate}</td>
                <td className="px-4 py-3 text-white/70">{tx.service}</td>
                <td className="px-4 py-3 text-orange-400 font-semibold">₺{tx.amount}</td>
                <td className="px-4 py-3 text-white/70">{tx.date}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    tx.status === 'completed'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {tx.status === 'completed' ? '✓ Tamamlandı' : '⏳ Beklemede'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
          <p className="text-green-400 text-sm font-semibold">Toplam Gelir</p>
          <p className="text-2xl font-bold text-green-400">₺5,650</p>
        </div>
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
          <p className="text-yellow-400 text-sm font-semibold">Beklemede</p>
          <p className="text-2xl font-bold text-yellow-400">₺850</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
          <p className="text-blue-400 text-sm font-semibold">İşlem Sayısı</p>
          <p className="text-2xl font-bold text-blue-400">3</p>
        </div>
      </div>
    </div>
  )

  const renderPricing = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white mb-4">Fiyatlandırma Yönetimi</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2019 Öncesi */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h4 className="font-bold text-white mb-4">2019 ÖNCESİ</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Sadece İPTAL</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={pricingData.zorlu.oncesi2019.sadece_iptal}
                  className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white"
                />
                <span className="text-orange-400">₺</span>
                <button className="p-2 rounded bg-orange-500/20 hover:bg-orange-500/30">
                  <Save className="w-4 h-4 text-orange-400" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">+ STAGE1</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={pricingData.zorlu.oncesi2019.stage1}
                  className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white"
                />
                <span className="text-red-400">₺</span>
                <button className="p-2 rounded bg-red-500/20 hover:bg-red-500/30">
                  <Save className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sadece İPTAL */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h4 className="font-bold text-white mb-4">SADECE İPTAL</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Fiyat</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={pricingData.zorlu.sadece_iptal.price}
                  className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white"
                />
                <span className="text-orange-400">₺</span>
                <button className="p-2 rounded bg-orange-500/20 hover:bg-orange-500/30">
                  <Save className="w-4 h-4 text-orange-400" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">+ STAGE1</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  defaultValue={pricingData.zorlu.sadece_iptal.stage1}
                  className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white"
                />
                <span className="text-yellow-400">₺</span>
                <button className="p-2 rounded bg-yellow-500/20 hover:bg-yellow-500/30">
                  <Save className="w-4 h-4 text-yellow-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'pricing':
        return renderPricing()
      case 'chat':
        return renderChat()
      case 'files':
        return renderFileManagement()
      case 'transactions':
        return renderTransactions()
      case 'settings':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white mb-4">⚙️ Ayarlar</h3>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 mb-2">Sistem Adı</label>
                  <input
                    type="text"
                    defaultValue="Zorlu ECU"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-2">İletişim Email</label>
                  <input
                    type="email"
                    defaultValue="admin@zorluecu.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
                <button className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl text-white font-bold transition-all">
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-white/20 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white">Admin Panel — {adminTitle}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {([
                { id: 'pricing', label: 'Fiyatlandırma', icon: DollarSign, color: 'purple' },
                { id: 'chat', label: 'Sohbet', icon: MessageCircle, color: 'blue' },
                { id: 'files', label: 'Dosyalar', icon: Upload, color: 'cyan' },
                { id: 'transactions', label: 'İşlemler', icon: DollarSign, color: 'green' },
                { id: 'settings', label: 'Ayarlar', icon: Settings, color: 'purple' }
              ] as const).map((tab) => {
                const Icon = tab.icon
                const bgColor = {
                  purple: activeTab === tab.id ? 'bg-purple-500' : 'bg-white/10',
                  blue: activeTab === tab.id ? 'bg-blue-500' : 'bg-white/10',
                  cyan: activeTab === tab.id ? 'bg-cyan-500' : 'bg-white/10',
                  green: activeTab === tab.id ? 'bg-green-500' : 'bg-white/10'
                }[tab.color]
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap text-sm ${bgColor} ${
                      activeTab === tab.id ? 'text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Content */}
            <div className="mb-8">
              {renderContent()}
            </div>

            {/* Footer */}
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl text-white font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Çıkış Yap
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AdminPanel
