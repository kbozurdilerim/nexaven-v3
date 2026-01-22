import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Users, MessageCircle, Upload, Check, X, Send, Download, Eye, Trash2, Plus, UserCheck, Bot, Monitor, Zap, Brain } from 'lucide-react'
import CustomerApprovalSystem from '../components/CustomerApprovalSystem'
import EnhancedCustomerManagement from '../components/EnhancedCustomerManagement'
import OllamaChat from '../components/OllamaChat'
import AITrainingSystem from '../components/AITrainingSystem'

// Test data initialization - Only if no real data exists
const initializeTestData = () => {
  // Only initialize if no pending customers exist
  const existingPending = JSON.parse(localStorage.getItem('pendingCustomers_zorlu-ecu') || '[]')
  const existingCustomers = JSON.parse(localStorage.getItem('customers_zorlu-ecu') || '[]')
  
  // Don't override real data - only add if completely empty
  if (existingPending.length === 0 && existingCustomers.length === 0) {
    // Initialize minimal test data only for demo purposes
    const pendingCustomers = [
      {
        id: 'demo-1',
        email: 'demo@example.com',
        companyName: 'Demo Oto Servis',
        contactName: 'Demo Kullanıcı',
        phone: '+90 500 000 0000',
        address: 'Demo Adres',
        businessType: 'Demo',
        requestedServices: ['Demo Service'],
        message: 'Bu demo veridir - gerçek kayıtlar burada görünecek.',
        createdAt: '2026-01-19T09:30:00Z',
        status: 'pending' as const
      }
    ]

    localStorage.setItem('pendingCustomers_zorlu-ecu', JSON.stringify(pendingCustomers))
  }

  // Initialize orders only if empty
  const existingOrders = JSON.parse(localStorage.getItem('orders_zorlu-ecu') || '[]')
  if (existingOrders.length === 0) {
    const orders = [
      {
        id: 'DEMO001',
        userId: 'demo-1',
        plaka: 'DEMO123',
        marka: 'Demo',
        model: 'Test',
        yil: 2024,
        stage: 'Demo Stage',
        iptaller: ['Demo'],
        pCodes: ['DEMO'],
        status: 'pending' as const,
        createdAt: '2026-01-19T11:15:00Z',
        price: 0,
        paid: 0
      }
    ]
    localStorage.setItem('orders_zorlu-ecu', JSON.stringify(orders))
  }
}

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

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: string
  uploadedBy: string
}

export default function ZorluEcuAdminDashboardEnhanced() {
  const navigate = useNavigate()
  const [adminUser, setAdminUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customers' | 'orders' | 'approvals' | 'management' | 'chat' | 'files' | 'ai-ecu' | 'ai-training'>('dashboard')
  const [selectedCustomer, setSelectedCustomer] = useState<CorporateUser | null>(null)
  const [customers, setCustomers] = useState<CorporateUser[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [editingOrder, setEditingOrder] = useState<string | null>(null)
  const [orderFormData, setOrderFormData] = useState<Partial<Order>>({})
  const [currentECUFile, setCurrentECUFile] = useState<File | null>(null)

  useEffect(() => {
    const admin = localStorage.getItem('adminUser')
    if (!admin) {
      navigate('/')
      return
    }

    const adminData = JSON.parse(admin)
    if (adminData.service !== 'zorlu-ecu') {
      navigate('/')
      return
    }

    setAdminUser(adminData)
    
    // Initialize test data
    initializeTestData()
    
    loadCustomers()
    loadOrders()
    loadFiles()
  }, [navigate])

  const loadCustomers = () => {
    const users = JSON.parse(localStorage.getItem('corporateUsers_zorlu-ecu') || '[]')
    const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers_zorlu-ecu') || '[]')
    setCustomers([...users.filter((u: any) => u.approved), ...pendingUsers.filter((u: any) => !u.approved)])
  }

  const loadOrders = () => {
    const allOrders = JSON.parse(localStorage.getItem('orders_zorlu-ecu') || '[]')
    setOrders(allOrders)
  }

  const loadFiles = () => {
    const files = JSON.parse(localStorage.getItem('files_zorlu-ecu') || '[]')
    setUploadedFiles(files)
  }

  const handleApproveCustomer = (customerId: string) => {
    const users = JSON.parse(localStorage.getItem('corporateUsers_zorlu-ecu') || '[]')
    const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers_zorlu-ecu') || '[]')
    
    const userToApprove = pendingUsers.find((u: any) => u.id === customerId)
    if (userToApprove) {
      userToApprove.approved = true
      users.push(userToApprove)
      const updatedPending = pendingUsers.filter((u: any) => u.id !== customerId)
      
      localStorage.setItem('corporateUsers_zorlu-ecu', JSON.stringify(users))
      localStorage.setItem('pendingUsers_zorlu-ecu', JSON.stringify(updatedPending))
      loadCustomers()
    }
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files) return

    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      uploadedBy: adminUser.email
    }))

    const allFiles = [...uploadedFiles, ...newFiles]
    setUploadedFiles(allFiles)
    localStorage.setItem('files_zorlu-ecu', JSON.stringify(allFiles))
  }

  const handleDeleteFile = (fileId: string) => {
    const filtered = uploadedFiles.filter(f => f.id !== fileId)
    setUploadedFiles(filtered)
    localStorage.setItem('files_zorlu-ecu', JSON.stringify(filtered))
  }

  const handleECUCommand = (command: string, data?: any) => {
    console.log('ECU Command:', command, data)
    // Handle ECU commands from AI chat
    
    switch (command) {
      case 'upload':
        setCurrentECUFile(data)
        break
      case 'analyze':
        // Handle ECU file analysis
        console.log('Analyzing ECU file:', currentECUFile)
        break
      case 'stage1':
      case 'stage2':
      case 'stage3':
        // Handle stage tuning
        console.log(`Applying ${command} tuning`)
        break
      case 'optimize':
        // Handle optimization
        console.log('Optimizing ECU parameters')
        break
      default:
        console.log('Unknown ECU command:', command)
    }
  }

  const handleECUFileProcessed = (file: any) => {
    console.log('ECU File Processed:', file)
    // Handle processed ECU file
  }

  const handleUpdateOrder = () => {
    if (!selectedOrder || !editingOrder) return

    const updated = orders.map(o =>
      o.id === editingOrder
        ? {
            ...o,
            ...orderFormData,
            status: (orderFormData.status || o.status) as any
          }
        : o
    )

    setOrders(updated)
    localStorage.setItem('orders_zorlu-ecu', JSON.stringify(updated))
    setEditingOrder(null)
    setOrderFormData({})
    loadOrders()
  }

  const handleLogout = () => {
    localStorage.removeItem('adminUser')
    navigate('/')
  }

  const stats = [
    {
      label: 'Toplam Müşteri',
      value: customers.length,
      color: 'from-blue-500 to-cyan-500',
      icon: '👥'
    },
    {
      label: 'Toplam Sipariş',
      value: orders.length,
      color: 'from-green-500 to-emerald-500',
      icon: '📋'
    },
    {
      label: 'Mesajlar',
      value: chatMessages.length,
      color: 'from-purple-500 to-pink-500',
      icon: '💬'
    },
    {
      label: 'Yüklenen Dosya',
      value: uploadedFiles.length,
      color: 'from-orange-500 to-red-500',
      icon: '📄'
    }
  ]

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-red-500/20 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Zorlu ECU Admin Panel</h1>
            <p className="text-red-400 text-sm">Yönetim Kontrol Merkezi</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Çıkış Yap
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-white/10 backdrop-blur-xl bg-black/10 sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-2">
            {[
              { id: 'dashboard', label: '📊 Kontrol Paneli', icon: '📊' },
              { id: 'customers', label: '👥 Müşteriler', icon: '👥' },
              { id: 'orders', label: '📋 Siparişler', icon: '📋' },
              { id: 'approvals', label: '✅ Onaylar', icon: '✅' },
              { id: 'management', label: '🏢 Müşteri Yönetimi', icon: '🏢' },
              { id: 'chat', label: '💬 Mesajlar', icon: '💬' },
              { id: 'files', label: '📄 Dosyalar', icon: '📄' },
              { id: 'ai-ecu', label: '🤖 AI ECU Tuning', icon: '🤖' },
              { id: 'ai-training', label: '🧠 AI Öğretme', icon: '🧠' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                    : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-red-500/50 transition-all"
                >
                  <p className="text-4xl mb-2">{stat.icon}</p>
                  <p className="text-white/60 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-black/40 border border-white/10"
            >
              <h2 className="text-xl font-bold text-white mb-4">Son Aktiviteler</h2>
              <div className="space-y-3">
                {orders.slice(-5).map(order => (
                  <div key={order.id} className="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">{order.plaka} - {order.marka} {order.model}</p>
                      <p className="text-white/60 text-sm">{order.stage} - {order.status}</p>
                    </div>
                    <span className="text-white/40 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            {customers.map(customer => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-red-500/50 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white font-bold text-lg">{customer.contactName}</p>
                    <p className="text-red-400">{customer.email}</p>
                    <p className="text-white/60 text-sm">{customer.companyName}</p>
                    <p className="text-white/60 text-sm">{customer.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    {!customer.approved && (
                      <button
                        onClick={() => handleApproveCustomer(customer.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-500/30 transition-all"
                      >
                        <Check className="w-4 h-4" />
                        Onayla
                      </button>
                    )}
                    <button
                      onClick={() => handleSelectCustomer(customer)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Mesaj Gönder
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className={`px-3 py-1 rounded-lg ${customer.approved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {customer.approved ? '✓ Onaylandı' : '⏳ Bekleniyor'}
                  </span>
                  <span className="px-3 py-1 bg-white/10 text-white/60 rounded-lg">
                    {new Date(customer.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </motion.div>
            ))}
            {customers.length === 0 && (
              <div className="text-center p-8 text-white/60">Henüz müşteri yok</div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map(order => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-red-500/50 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white font-bold text-lg">{order.plaka}</p>
                    <p className="text-red-400">{order.marka} {order.model} ({order.yil})</p>
                    <p className="text-white/60 text-sm">{order.stage}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingOrder(order.id)
                        setSelectedOrder(order)
                        setOrderFormData(order)
                      }}
                      className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all"
                    >
                      ✏️ Düzenle
                    </button>
                  </div>
                </div>

                {editingOrder === order.id ? (
                  <div className="space-y-3 mb-4">
                    <select
                      value={orderFormData.status || order.status}
                      onChange={(e) => setOrderFormData({ ...orderFormData, status: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
                    >
                      <option value="pending" className="bg-gray-800 text-white">⏳ Beklemede</option>
                      <option value="processing" className="bg-gray-800 text-white">🔄 İşleniyor</option>
                      <option value="completed" className="bg-gray-800 text-white">✅ Tamamlandı</option>
                    </select>
                      <option value="completed">✅ Tamamlandı</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Fiyat"
                      value={orderFormData.price || order.price || ''}
                      onChange={(e) => setOrderFormData({ ...orderFormData, price: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40"
                    />
                    <input
                      type="number"
                      placeholder="Ödenen"
                      value={orderFormData.paid || order.paid || ''}
                      onChange={(e) => setOrderFormData({ ...orderFormData, paid: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateOrder}
                        className="flex-1 px-3 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-500/30"
                      >
                        ✓ Kaydet
                      </button>
                      <button
                        onClick={() => setEditingOrder(null)}
                        className="flex-1 px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30"
                      >
                        ✕ İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className={`px-3 py-1 rounded-lg ${
                      order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {order.status === 'completed' ? '✅ Tamamlandı' :
                       order.status === 'processing' ? '🔄 İşleniyor' :
                       '⏳ Beklemede'}
                    </span>
                    {order.price && <span className="px-3 py-1 bg-white/10 text-white/60 rounded-lg">₺{order.price.toLocaleString('tr-TR')}</span>}
                  </div>
                )}
              </motion.div>
            ))}
            {orders.length === 0 && (
              <div className="text-center p-8 text-white/60">Henüz sipariş yok</div>
            )}
          </div>
        )}

        {/* Approvals Tab */}
        {activeTab === 'approvals' && (
          <CustomerApprovalSystem
            service="zorlu-ecu"
            onApprove={(customerId) => {
              handleApproveCustomer(customerId)
            }}
            onReject={(customerId, reason) => {
              console.log('Customer rejected:', customerId, reason)
              // Handle rejection logic
            }}
          />
        )}

        {/* Management Tab */}
        {activeTab === 'management' && (
          <EnhancedCustomerManagement service="zorlu-ecu" />
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer List */}
            <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10 bg-white/5">
                <p className="text-white font-bold">Müşteriler</p>
              </div>
              <div className="overflow-y-auto max-h-96">
                {customers.map(customer => (
                  <button
                    key={customer.id}
                    onClick={() => handleSelectCustomer(customer)}
                    className={`w-full p-4 border-b border-white/10 text-left transition-all ${
                      selectedCustomer?.id === customer.id
                        ? 'bg-red-500/20 border-l-4 border-l-red-500'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <p className="text-white font-semibold text-sm">{customer.contactName}</p>
                    <p className="text-white/60 text-xs">{customer.email}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-2 bg-black/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
              {selectedCustomer ? (
                <>
                  <div className="p-4 border-b border-white/10 bg-white/5">
                    <p className="text-white font-bold">{selectedCustomer.contactName}</p>
                    <p className="text-white/60 text-sm">{selectedCustomer.email}</p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-96">
                    {chatMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.sender === 'admin'
                              ? 'bg-red-500/20 border border-red-500/50 text-red-100'
                              : 'bg-blue-500/20 border border-blue-500/50 text-blue-100'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 p-4 flex gap-2">
                    <input
                      type="text"
                      placeholder="Mesaj yaz..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
                    />
                    <button
                      onClick={sendChatMessage}
                      className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-96 text-white/60">
                  Müşteri seçin
                </div>
              )}
            </div>
          </div>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="space-y-4">
            {/* Upload Area */}
            <div className="p-8 border-2 border-dashed border-red-500/30 rounded-2xl text-center hover:border-red-500/50 transition-all cursor-pointer bg-black/40">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                <Upload className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-white font-bold mb-1">Dosya Yükle</p>
                <p className="text-white/60 text-sm">Tıklayarak veya sürükleyerek dosya yükleyin</p>
              </label>
            </div>

            {/* Files List */}
            <div className="space-y-3">
              {uploadedFiles.map(file => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-black/40 border border-white/10 rounded-2xl flex justify-between items-center"
                >
                  <div>
                    <p className="text-white font-semibold">{file.name}</p>
                    <p className="text-white/60 text-sm">
                      {(file.size / 1024).toFixed(2)} KB • {new Date(file.uploadedAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-2 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400 hover:bg-blue-500/30">
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {uploadedFiles.length === 0 && (
              <div className="text-center p-8 text-white/60">Henüz dosya yok</div>
            )}
          </div>
        )}

        {/* AI ECU Tuning Tab */}
        {activeTab === 'ai-ecu' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">🤖 AI Destekli ECU Tuning</h2>
              <p className="text-white/60">External Ollama AI ile profesyonel ECU yazılım geliştirme</p>
            </div>

            {/* Single AI Chat Panel - Full Width */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">ECU AI Asistanı</h3>
                  <p className="text-white/60 text-sm">External Ollama (72.62.178.51:32768) ile güçlendirilmiş yapay zeka</p>
                </div>
              </div>
              
              <OllamaChat 
                onECUCommand={handleECUCommand}
                ecuFile={currentECUFile}
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              {[
                {
                  title: '🚗 Yeni ECU Projesi',
                  description: 'Yeni araç için ECU tuning başlat',
                  action: () => setActiveTab('ai-ecu'),
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  title: '⚡ Hızlı Stage 1',
                  description: 'Otomatik Stage 1 ayarları uygula',
                  action: () => console.log('Quick Stage 1'),
                  color: 'from-green-500 to-emerald-500'
                },
                {
                  title: '🔧 Özel Tuning',
                  description: 'Manuel parametre ayarlama',
                  action: () => console.log('Custom Tuning'),
                  color: 'from-purple-500 to-pink-500'
                },
                {
                  title: '📊 Performans Analizi',
                  description: 'Tuning sonuçlarını analiz et',
                  action: () => console.log('Performance Analysis'),
                  color: 'from-orange-500 to-red-500'
                }
              ].map((action, index) => (
                <motion.button
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={action.action}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${action.color} hover:shadow-lg hover:shadow-current/25 transition-all text-left`}
                >
                  <h4 className="text-white font-bold text-lg mb-2">{action.title}</h4>
                  <p className="text-white/80 text-sm">{action.description}</p>
                </motion.button>
              ))}
            </div>

            {/* System Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {[
                { 
                  label: 'External Ollama AI', 
                  status: 'connected', 
                  info: 'http://72.62.178.51:32768',
                  icon: <Bot className="w-5 h-5" />
                },
                { 
                  label: 'ECU Processing', 
                  status: 'ready', 
                  info: 'AI-powered tuning ready',
                  icon: <Zap className="w-5 h-5" />
                }
              ].map(service => (
                <div key={service.label} className="p-4 bg-black/40 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      service.status === 'connected' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {service.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{service.label}</span>
                        <div className={`w-2 h-2 rounded-full ${
                          service.status === 'connected' ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                      </div>
                      <p className="text-white/60 text-sm">{service.info}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Training System Tab */}
        {activeTab === 'ai-training' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">🧠 AI Öğretme & Modlama Sistemi</h2>
              <p className="text-white/60">Orijinal ECU dosyalarını yükleyin, AI ile öğretin ve modlayın</p>
            </div>

            <AITrainingSystem />
          </div>
        )}
      </main>
    </div>
  )
}
