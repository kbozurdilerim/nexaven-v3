import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { LogOut, Download, Eye, Send, X, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface Order {
  id: string
  userId: string
  plaka: string
  marka: string
  model: string
  yil: number
  stage: string
  iptaller?: string[]
  pCodes?: string[]
  status: 'pending' | 'processing' | 'completed'
  price?: number
  paid?: number
  createdAt: string
}

export default function ZorluEcuSlaveDashboard() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'orders' | 'chat' | 'files' | 'account'>('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetail, setShowOrderDetail] = useState(false)


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

    // Siparişleri yükle
    const allOrders = JSON.parse(localStorage.getItem('orders_zorlu-ecu') || '[]')
    const userOrders = allOrders.filter((o: Order) => o.userId === user.id)
    setOrders(userOrders)

    // Chat mesajlarını yükle
    const messages = JSON.parse(localStorage.getItem(`chat_${user.id}`) || '[]')
    setChatMessages(messages)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('corporateUser')
    navigate('/')
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !userData) return

    const message = {
      id: Date.now().toString(),
      userId: userData.id,
      sender: 'customer',
      text: newMessage,
      timestamp: new Date().toISOString()
    }

    const updated = [...chatMessages, message]
    setChatMessages(updated)
    localStorage.setItem(`chat_${userData.id}`, JSON.stringify(updated))
    setNewMessage('')
  }

  const handleOrderDetail = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderDetail(true)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && selectedOrder) {
      // Dosya yükleme simülasyonu
      const message = {
        id: Date.now().toString(),
        userId: userData.id,
        sender: 'customer',
        text: `Dosya yüklendi: ${file.name}`,
        timestamp: new Date().toISOString()
      }
      const updated = [...chatMessages, message]
      setChatMessages(updated)
      localStorage.setItem(`chat_${userData.id}`, JSON.stringify(updated))
    }
  }

  const getTotalDebt = () => {
    return orders.reduce((sum, order) => {
      const debt = (order.price || 0) - (order.paid || 0)
      return sum + debt
    }, 0)
  }

  const getTotalPaid = () => {
    return orders.reduce((sum, order) => sum + (order.paid || 0), 0)
  }

  if (!userData) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">{userData.companyName}</h1>
            <p className="text-white/60 text-sm mt-1">{userData.contactName}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Çıkış Yap
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10 overflow-x-auto">
          {[
            { id: 'orders', label: 'Siparişlerim', icon: '📦' },
            { id: 'chat', label: 'Chat', icon: '💬' },
            { id: 'files', label: 'Dosyalar', icon: '📁' },
            { id: 'account', label: 'Hesap', icon: '👤' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-b-2 border-red-500 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                <p>Henüz siparişiniz bulunmamaktadır.</p>
              </div>
            ) : (
              orders.map(order => (
                <motion.div
                  key={order.id}
                  whileHover={{ scale: 1.01 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold">{order.marka} {order.model} ({order.yil})</h3>
                      <p className="text-white/60 text-sm">Plaka: {order.plaka}</p>
                      <div className="flex gap-4 mt-2 text-sm flex-wrap">
                        <span className="text-blue-400">Stage: {order.stage}</span>
                        <span className={order.status === 'completed' ? 'text-green-400' : order.status === 'processing' ? 'text-yellow-400' : 'text-gray-400'}>
                          {order.status === 'completed' ? '✓ Tamamlandı' : order.status === 'processing' ? '⏳ İşleniyor' : '⏳ Beklemede'}
                        </span>
                        {order.price && <span className="text-purple-400">Fiyat: {order.price} TL</span>}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleOrderDetail(order)}
                      className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all text-sm flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Detay
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Admin ile İletişim</h2>
            
            {/* Messages */}
            <div className="bg-white/5 rounded-lg p-4 h-96 overflow-y-auto mb-4 space-y-3">
              {chatMessages.length === 0 ? (
                <p className="text-white/60 text-center py-8">Henüz mesaj bulunmamaktadır</p>
              ) : (
                chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        msg.sender === 'customer'
                          ? 'bg-red-600/50 text-white'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs text-white/50 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Mesaj yazın..."
                className="flex-grow bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:border-red-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={sendMessage}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-all"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-6">Dosya Yönetimi</h2>
            
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white/5 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold">{order.marka} {order.model}</p>
                      <p className="text-white/60 text-sm">Plaka: {order.plaka}</p>
                    </div>
                    {order.status === 'completed' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-all text-sm flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        İndir
                      </motion.button>
                    )}
                  </div>

                  {order.status === 'processing' && (
                    <div className="bg-white/5 p-3 rounded-lg">
                      <label className="block text-sm text-white/60 mb-2">Dosya Yükle</label>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-red-600 file:text-white hover:file:bg-red-700"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Account Info */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Hesap Bilgileri</h2>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/60 mb-1">Şirket Adı</p>
                    <p className="font-bold">{userData.companyName}</p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">İletişim Kişisi</p>
                    <p className="font-bold">{userData.contactName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/60 mb-1">Email</p>
                    <p className="font-bold text-sm break-all">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">Telefon</p>
                    <p className="font-bold">{userData.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-white/60 text-sm mb-2">Toplam Sipariş Tutarı</p>
                <p className="text-3xl font-bold text-blue-400">
                  {orders.reduce((sum, o) => sum + (o.price || 0), 0)} TL
                </p>
              </div>
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-white/60 text-sm mb-2">Ödenen Tutar</p>
                <p className="text-3xl font-bold text-green-400">{getTotalPaid()} TL</p>
              </div>
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-white/60 text-sm mb-2">Kalan Borç</p>
                <p className={`text-3xl font-bold ${getTotalDebt() > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {getTotalDebt()} TL
                </p>
              </div>
            </div>

            {/* Orders Summary */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Sipariş Özeti</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Toplam Sipariş</span>
                  <span className="font-bold">{orders.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Tamamlanan</span>
                  <span className="font-bold text-green-400">{orders.filter(o => o.status === 'completed').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">İşlenmekte Olan</span>
                  <span className="font-bold text-yellow-400">{orders.filter(o => o.status === 'processing').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Beklemede</span>
                  <span className="font-bold text-gray-400">{orders.filter(o => o.status === 'pending').length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        <AnimatePresence>
          {showOrderDetail && selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowOrderDetail(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold">Sipariş Detayları</h2>
                  <button onClick={() => setShowOrderDetail(false)} className="text-white/60 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-white/60">Araç Marka</p><p className="font-bold">{selectedOrder.marka}</p></div>
                    <div><p className="text-white/60">Model</p><p className="font-bold">{selectedOrder.model}</p></div>
                    <div><p className="text-white/60">Yıl</p><p className="font-bold">{selectedOrder.yil}</p></div>
                    <div><p className="text-white/60">Plaka</p><p className="font-bold">{selectedOrder.plaka}</p></div>
                  </div>

                  <div>
                    <p className="text-white/60 mb-2">Stage</p>
                    <p className="font-bold text-purple-400">{selectedOrder.stage}</p>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-white/60">Toplam Fiyat</p><p className="font-bold text-green-400">{selectedOrder.price || '-'} TL</p></div>
                      <div><p className="text-white/60">Ödenen Tutar</p><p className="font-bold text-yellow-400">{selectedOrder.paid || 0} TL</p></div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-white/60 mb-2">Durumu</p>
                    <div className="flex items-center gap-2">
                      {selectedOrder.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-400" />}
                      {selectedOrder.status === 'processing' && <Clock className="w-5 h-5 text-yellow-400" />}
                      {selectedOrder.status === 'pending' && <AlertCircle className="w-5 h-5 text-gray-400" />}
                      <span className="capitalize">
                        {selectedOrder.status === 'completed' ? 'Tamamlandı' : selectedOrder.status === 'processing' ? 'İşleniyor' : 'Beklemede'}
                      </span>
                    </div>
                  </div>

                  {selectedOrder.status === 'completed' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="w-full mt-4 px-4 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Modlu Dosyayı İndir
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
