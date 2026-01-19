import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Users, MessageCircle, Upload, Check, X, Send, Download, Eye, Trash2, Plus, UserCheck } from 'lucide-react'
import CustomerApprovalSystem from '../components/CustomerApprovalSystem'
import EnhancedCustomerManagement from '../components/EnhancedCustomerManagement'

// Test data initialization
const initializeTestData = () => {
  // Initialize pending customers for approval system
  const pendingCustomers = [
    {
      id: '1',
      email: 'ahmet@teknikoto.com',
      companyName: 'Teknik Oto Servis',
      contactName: 'Ahmet Yılmaz',
      phone: '+90 532 123 4567',
      address: 'Atatürk Cad. No:123 Kadıköy/İstanbul',
      taxNumber: '1234567890',
      website: 'www.teknikoto.com',
      businessType: 'Oto Servis',
      requestedServices: ['ECU Tuning', 'DPF Delete', 'EGR Delete'],
      message: 'Merhaba, ECU tuning hizmetlerinizden faydalanmak istiyoruz. 15 yıllık tecrübemiz var.',
      documents: [
        { name: 'ticaret_sicil.pdf', type: 'application/pdf', size: 245760, uploadedAt: '2026-01-19T10:00:00Z' },
        { name: 'vergi_levhasi.jpg', type: 'image/jpeg', size: 156432, uploadedAt: '2026-01-19T10:05:00Z' }
      ],
      createdAt: '2026-01-19T09:30:00Z',
      status: 'pending' as const
    },
    {
      id: '2',
      email: 'fatma@speedgarage.com',
      companyName: 'Speed Garage',
      contactName: 'Fatma Demir',
      phone: '+90 533 987 6543',
      address: 'Bağdat Cad. No:456 Maltepe/İstanbul',
      businessType: 'Performance Tuning',
      requestedServices: ['Stage 1 Tuning', 'Stage 2 Tuning', 'Dyno Test'],
      message: 'Performance tuning konusunda uzmanlaşmış bir firmayız. Zorlu ECU ile çalışmak istiyoruz.',
      createdAt: '2026-01-18T14:20:00Z',
      status: 'pending' as const
    },
    {
      id: '3',
      email: 'mehmet@autoexpert.com',
      companyName: 'Auto Expert',
      contactName: 'Mehmet Kaya',
      phone: '+90 534 555 7788',
      address: 'Cumhuriyet Mah. Sanayi Sitesi No:78 Ankara',
      taxNumber: '9876543210',
      businessType: 'Oto Elektrik',
      requestedServices: ['ECU Repair', 'Immobilizer Delete'],
      message: 'ECU tamiri ve immobilizer silme konularında hizmet veriyoruz.',
      createdAt: '2026-01-17T11:45:00Z',
      status: 'pending' as const
    }
  ]

  // Initialize approved customers for management system
  const approvedCustomers = [
    {
      id: '4',
      email: 'ali@protuning.com',
      companyName: 'Pro Tuning Center',
      contactName: 'Ali Özkan',
      phone: '+90 535 111 2233',
      address: 'Kozyatağı Mah. Teknoloji Cad. No:12 İstanbul',
      taxNumber: '5555666677',
      website: 'www.protuning.com',
      businessType: 'Tuning Center',
      status: 'active' as const,
      createdAt: '2026-01-15T08:00:00Z',
      lastActivity: '2026-01-19T09:00:00Z',
      totalOrders: 25,
      totalSpent: 125000,
      creditLimit: 50000,
      paymentTerms: '30 gün',
      notes: 'VIP müşteri, öncelikli hizmet verilmeli',
      tags: ['VIP', 'Tuning Expert', 'High Volume'],
      priority: 'vip' as const
    },
    {
      id: '5',
      email: 'zeynep@motortech.com',
      companyName: 'Motor Tech Solutions',
      contactName: 'Zeynep Arslan',
      phone: '+90 536 444 5566',
      address: 'Ostim Sanayi Sitesi B Blok No:45 Ankara',
      businessType: 'Motor Tamiri',
      status: 'active' as const,
      createdAt: '2026-01-10T12:30:00Z',
      lastActivity: '2026-01-18T16:45:00Z',
      totalOrders: 12,
      totalSpent: 48000,
      creditLimit: 20000,
      paymentTerms: '15 gün',
      notes: 'Düzenli müşteri, zamanında ödeme yapıyor',
      tags: ['Regular Customer', 'Motor Repair'],
      priority: 'high' as const
    },
    {
      id: '6',
      email: 'can@speedworks.com',
      companyName: 'Speed Works',
      contactName: 'Can Yıldız',
      phone: '+90 537 777 8899',
      address: 'Atatürk OSB 5. Cad. No:23 Bursa',
      businessType: 'Performance Shop',
      status: 'active' as const,
      createdAt: '2026-01-05T14:15:00Z',
      lastActivity: '2026-01-16T10:20:00Z',
      totalOrders: 8,
      totalSpent: 32000,
      creditLimit: 15000,
      paymentTerms: '7 gün',
      notes: 'Yeni müşteri, potansiyeli yüksek',
      tags: ['New Customer', 'Performance'],
      priority: 'medium' as const
    }
  ]

  // Save to localStorage
  if (!localStorage.getItem('pendingCustomers_zorlu-ecu')) {
    localStorage.setItem('pendingCustomers_zorlu-ecu', JSON.stringify(pendingCustomers))
  }
  
  if (!localStorage.getItem('customers_zorlu-ecu')) {
    localStorage.setItem('customers_zorlu-ecu', JSON.stringify(approvedCustomers))
  }

  // Initialize some orders
  const orders = [
    {
      id: 'ORD001',
      userId: '4',
      plaka: '34ABC123',
      marka: 'BMW',
      model: '320d',
      yil: 2020,
      stage: 'Stage 1 ECU Tuning',
      iptaller: ['DPF Delete', 'EGR Delete'],
      pCodes: ['P0401', 'P2002'],
      status: 'completed' as const,
      createdAt: '2026-01-18T10:00:00Z',
      price: 8500,
      paid: 8500
    },
    {
      id: 'ORD002',
      userId: '5',
      plaka: '06XYZ789',
      marka: 'Audi',
      model: 'A4',
      yil: 2019,
      stage: 'Stage 2 ECU Tuning',
      iptaller: ['Downpipe', 'Cold Air Intake'],
      pCodes: ['P0171', 'P0174'],
      status: 'processing' as const,
      createdAt: '2026-01-19T08:30:00Z',
      price: 12000,
      paid: 6000
    },
    {
      id: 'ORD003',
      userId: '6',
      plaka: '16DEF456',
      marka: 'Mercedes',
      model: 'C220d',
      yil: 2021,
      stage: 'DPF Delete',
      iptaller: ['DPF Delete'],
      pCodes: ['P2002'],
      status: 'pending' as const,
      createdAt: '2026-01-19T11:15:00Z',
      price: 5500,
      paid: 0
    }
  ]

  if (!localStorage.getItem('orders_zorlu-ecu')) {
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customers' | 'orders' | 'approvals' | 'management' | 'chat' | 'files'>('dashboard')
  const [selectedCustomer, setSelectedCustomer] = useState<CorporateUser | null>(null)
  const [customers, setCustomers] = useState<CorporateUser[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [editingOrder, setEditingOrder] = useState<string | null>(null)
  const [orderFormData, setOrderFormData] = useState<Partial<Order>>({})

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
              { id: 'files', label: '📄 Dosyalar', icon: '📄' }
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
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                    >
                      <option value="pending">⏳ Beklemede</option>
                      <option value="processing">🔄 İşleniyor</option>
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
      </main>
    </div>
  )
}
