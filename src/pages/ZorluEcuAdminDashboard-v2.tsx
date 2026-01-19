import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Users, MessageCircle, Upload, Check, X, Send, Download, Eye } from 'lucide-react'

interface CorporateUser {
  id: string
  email: string
  companyName: string
  contactName: string
  phone: string
  approved: boolean
  createdAt: string
}

interface Order {
  id: string
  userId: string
  plaka: string
  marka: string
  model: string
  yil: number
  stage: string
  iptaller: string[]
  pCodes: string[]
  status: 'pending' | 'processing' | 'completed'
  createdAt: string
  price?: number
  paid?: number
}

interface ChatMessage {
  id: string
  userId: string
  sender: 'admin' | 'customer'
  text: string
  timestamp: string
}

export default function ZorluEcuAdminDashboard() {
  const navigate = useNavigate()
  const [adminUser, setAdminUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'customers' | 'orders' | 'chat' | 'files'>('customers')
  const [selectedCustomer, setSelectedCustomer] = useState<CorporateUser | null>(null)
  const [customers, setCustomers] = useState<CorporateUser[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [priceInput, setPriceInput] = useState('')

  useEffect(() => {
    const admin = localStorage.getItem('adminUser')
    if (!admin) {
      navigate('/')
      return
    }

    const adminData = JSON.parse(admin)
    if (adminData.service !== 'zorlu-ecu') {
      alert('Bu panele erişim yetkiniz yok!')
      navigate('/')
      return
    }

    setAdminUser(adminData)
    loadCustomers()
    loadOrders()
  }, [navigate])

  const loadCustomers = () => {
    const users = JSON.parse(localStorage.getItem('corporateUsers_zorlu-ecu') || '[]')
    setCustomers(users.filter((u: any) => u.approved))
  }

  const loadOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem('orders_zorlu-ecu') || '[]')
    setOrders(allOrders)
  }

  const handleSelectCustomer = (customer: CorporateUser) => {
    setSelectedCustomer(customer)
    const custMessages = JSON.parse(localStorage.getItem(`chat_${customer.id}`) || '[]')
    setChatMessages(custMessages)
  }

  const sendChatMessage = () => {
    if (!chatInput.trim() || !selectedCustomer) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: selectedCustomer.id,
      sender: 'admin',
      text: chatInput,
      timestamp: new Date().toISOString()
    }

    const updatedMessages = [...chatMessages, newMessage]
    setChatMessages(updatedMessages)
    localStorage.setItem(`chat_${selectedCustomer.id}`, JSON.stringify(updatedMessages))
    setChatInput('')
  }

  const handleOrderDetail = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderDetail(true)
  }

  const handleSendFile = (order: Order) => {
    setSelectedOrder(order)
    setShowPriceModal(true)
  }

  const submitPrice = () => {
    if (!selectedOrder || !priceInput) return

    const updatedOrders = orders.map(o =>
      o.id === selectedOrder.id
        ? { ...o, price: parseFloat(priceInput), status: 'processing' as const }
        : o
    )

    setOrders(updatedOrders)
    localStorage.setItem('orders_zorlu-ecu', JSON.stringify(updatedOrders))
    
    // Send price message to customer
    if (selectedCustomer) {
      const priceMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: selectedCustomer.id,
        sender: 'admin',
        text: `Siparişiniz için fiyat: ${priceInput} TL`,
        timestamp: new Date().toISOString()
      }
      const updatedMessages = [...chatMessages, priceMessage]
      setChatMessages(updatedMessages)
      localStorage.setItem(`chat_${selectedCustomer.id}`, JSON.stringify(updatedMessages))
    }

    setShowPriceModal(false)
    setPriceInput('')
  }

  if (!adminUser) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Zorlu ECU Admin Panel</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              localStorage.removeItem('adminUser')
              navigate('/')
            }}
            className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Çıkış Yap
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          {[
            { id: 'customers', label: 'Müşteriler', icon: Users },
            { id: 'orders', label: 'Siparişler', icon: Upload },
            { id: 'chat', label: 'Chat', icon: MessageCircle },
            { id: 'files', label: 'Dosyalar', icon: Download }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'border-b-2 border-red-500 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer List */}
            <div className="lg:col-span-1">
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Müşteriler ({customers.length})</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {customers.map(customer => (
                    <motion.button
                      key={customer.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleSelectCustomer(customer)}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        selectedCustomer?.id === customer.id
                          ? 'bg-red-600/50 border border-red-500'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <p className="font-bold text-sm">{customer.companyName}</p>
                      <p className="text-xs text-white/60">{customer.contactName}</p>
                      <p className="text-xs text-white/50">{customer.email}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer Details */}
            {selectedCustomer && (
              <div className="lg:col-span-2">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-4">Müşteri Detayları</h2>
                  <div className="space-y-3 text-sm">
                    <p><span className="text-white/60">Şirket:</span> {selectedCustomer.companyName}</p>
                    <p><span className="text-white/60">İletişim:</span> {selectedCustomer.contactName}</p>
                    <p><span className="text-white/60">Email:</span> {selectedCustomer.email}</p>
                    <p><span className="text-white/60">Telefon:</span> {selectedCustomer.phone}</p>
                    <p><span className="text-white/60">Kayıt Tarihi:</span> {new Date(selectedCustomer.createdAt).toLocaleDateString('tr-TR')}</p>
                  </div>

                  {/* Customer Orders Summary */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="font-bold mb-3">Son Siparişler</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {orders.filter(o => o.userId === selectedCustomer.id).slice(0, 3).map(order => (
                        <div key={order.id} className="bg-white/5 p-3 rounded-lg text-xs">
                          <p className="font-bold">{order.marka} {order.model} ({order.yil})</p>
                          <p className="text-white/60">Plaka: {order.plaka}</p>
                          <p className="text-yellow-400">Stage: {order.stage}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map(order => (
              <motion.div
                key={order.id}
                whileHover={{ scale: 1.01 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <h3 className="text-lg font-bold">{order.marka} {order.model} ({order.yil})</h3>
                    <p className="text-white/60 text-sm">Plaka: {order.plaka}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-blue-400">Stage: {order.stage}</span>
                      <span className={order.status === 'completed' ? 'text-green-400' : order.status === 'processing' ? 'text-yellow-400' : 'text-gray-400'}>
                        {order.status === 'completed' ? 'Tamamlandı' : order.status === 'processing' ? 'İşleniyor' : 'Beklemede'}
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
            ))}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && selectedCustomer && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Chat - {selectedCustomer.companyName}</h2>
            
            {/* Messages */}
            <div className="bg-white/5 rounded-lg p-4 h-96 overflow-y-auto mb-4 space-y-3">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.sender === 'admin'
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
              ))}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Mesaj yazın..."
                className="flex-grow bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:border-red-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={sendChatMessage}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-all"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Dosya Yönetimi</h2>
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-white/5 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{order.marka} {order.model}</p>
                      <p className="text-white/60 text-sm">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleSendFile(order)}
                      className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-all text-sm"
                    >
                      Modlu Dosya Gönder
                    </motion.button>
                  </div>
                </div>
              ))}
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

                  <div>
                    <p className="text-white/60 mb-2">İptaller</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedOrder.iptaller.map(iptali => (
                        <span key={iptali} className="bg-red-600/50 px-3 py-1 rounded-full text-xs">
                          {iptali}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-white/60 mb-2">P-Code İptalleri</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedOrder.pCodes.map(code => (
                        <span key={code} className="bg-blue-600/50 px-3 py-1 rounded-full text-xs">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedOrder.price && (
                    <div className="border-t border-white/10 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-white/60">Toplam Fiyat</p><p className="font-bold text-green-400">{selectedOrder.price} TL</p></div>
                        <div><p className="text-white/60">Ödenen Tutar</p><p className="font-bold text-yellow-400">{selectedOrder.paid || 0} TL</p></div>
                      </div>
                    </div>
                  )}

                  {selectedOrder.status === 'processing' && (
                    <div className="pt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="w-full px-4 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Download className="w-5 h-5" />
                        Modlu Dosyayı İndir
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Price Modal */}
        <AnimatePresence>
          {showPriceModal && selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowPriceModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-6">Fiyat Belirle</h2>
                <div className="space-y-4">
                  <p className="text-white/60 text-sm">{selectedOrder.marka} {selectedOrder.model}</p>
                  <input
                    type="number"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    placeholder="Fiyat (TL)"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-red-500"
                  />
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setShowPriceModal(false)}
                      className="flex-1 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                    >
                      İptal
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={submitPrice}
                      className="flex-1 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Gönder
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
