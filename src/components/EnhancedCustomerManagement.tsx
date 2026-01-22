import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Search, Filter, Plus, Edit2, Trash2, Eye, MessageCircle, 
  Phone, Mail, Building, Calendar, CreditCard, FileText, Download,
  CheckCircle, XCircle, Clock, AlertTriangle, Star, TrendingUp
} from 'lucide-react'

interface Customer {
  id: string
  email: string
  companyName: string
  contactName: string
  phone: string
  address?: string
  taxNumber?: string
  website?: string
  businessType?: string
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  createdAt: string
  lastActivity?: string
  totalOrders: number
  totalSpent: number
  creditLimit?: number
  paymentTerms?: string
  notes?: string
  tags: string[]
  priority: 'low' | 'medium' | 'high' | 'vip'
}

interface EnhancedCustomerManagementProps {
  service: string
}

export default function EnhancedCustomerManagement({ service }: EnhancedCustomerManagementProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | Customer['status']>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | Customer['priority']>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'company' | 'created' | 'spent' | 'orders'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    loadCustomers()
  }, [service])

  useEffect(() => {
    filterAndSortCustomers()
  }, [customers, searchTerm, statusFilter, priorityFilter, sortBy, sortOrder])

  const loadCustomers = () => {
    const savedCustomers = JSON.parse(localStorage.getItem(`customers_${service}`) || '[]')
    setCustomers(savedCustomers)
  }

  const saveCustomers = (updatedCustomers: Customer[]) => {
    setCustomers(updatedCustomers)
    localStorage.setItem(`customers_${service}`, JSON.stringify(updatedCustomers))
  }

  const filterAndSortCustomers = () => {
    let filtered = customers.filter(customer => {
      const matchesSearch = 
        customer.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)

      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || customer.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case 'name':
          aValue = a.contactName.toLowerCase()
          bValue = b.contactName.toLowerCase()
          break
        case 'company':
          aValue = a.companyName.toLowerCase()
          bValue = b.companyName.toLowerCase()
          break
        case 'created':
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        case 'spent':
          aValue = a.totalSpent
          bValue = b.totalSpent
          break
        case 'orders':
          aValue = a.totalOrders
          bValue = b.totalOrders
          break
        default:
          aValue = a.contactName.toLowerCase()
          bValue = b.contactName.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredCustomers(filtered)
  }

  const getStatusColor = (status: Customer['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
      case 'suspended': return 'bg-red-500/20 text-red-400 border-red-500/50'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  const getPriorityColor = (priority: Customer['priority']) => {
    switch (priority) {
      case 'vip': return 'bg-purple-500/20 text-purple-400 border-purple-500/50'
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  const getStatusIcon = (status: Customer['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'inactive': return <XCircle className="w-4 h-4" />
      case 'suspended': return <AlertTriangle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      default: return <XCircle className="w-4 h-4" />
    }
  }

  const getPriorityIcon = (priority: Customer['priority']) => {
    switch (priority) {
      case 'vip': return <Star className="w-4 h-4" />
      case 'high': return <TrendingUp className="w-4 h-4" />
      case 'medium': return <Calendar className="w-4 h-4" />
      case 'low': return <Users className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  const handleDeleteCustomer = (customerId: string) => {
    if (!confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) return
    
    const updated = customers.filter(c => c.id !== customerId)
    saveCustomers(updated)
    if (selectedCustomer?.id === customerId) {
      setSelectedCustomer(null)
    }
  }

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer)
    setShowEditModal(true)
  }

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    pending: customers.filter(c => c.status === 'pending').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    avgOrderValue: customers.length > 0 ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0) : 0
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-white/60 text-sm">Toplam Müşteri</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
              <p className="text-white/60 text-sm">Aktif Müşteri</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
              <p className="text-white/60 text-sm">Bekleyen</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-2xl font-bold text-white">₺{stats.totalRevenue.toLocaleString('tr-TR')}</p>
              <p className="text-white/60 text-sm">Toplam Ciro</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-black/40 border border-white/10 rounded-xl">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-orange-400" />
            <div>
              <p className="text-2xl font-bold text-white">₺{stats.avgOrderValue.toLocaleString('tr-TR')}</p>
              <p className="text-white/60 text-sm">Ort. Sipariş</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Müşteri ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="all" className="bg-gray-800 text-white">Tüm Durumlar</option>
              <option value="active" className="bg-gray-800 text-white">Aktif</option>
              <option value="inactive" className="bg-gray-800 text-white">İnaktif</option>
              <option value="suspended" className="bg-gray-800 text-white">Askıya Alınmış</option>
              <option value="pending" className="bg-gray-800 text-white">Bekleyen</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="all" className="bg-gray-800 text-white">Tüm Öncelikler</option>
              <option value="vip" className="bg-gray-800 text-white">VIP</option>
              <option value="high" className="bg-gray-800 text-white">Yüksek</option>
              <option value="medium" className="bg-gray-800 text-white">Orta</option>
              <option value="low" className="bg-gray-800 text-white">Düşük</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field as any)
                setSortOrder(order as any)
              }}
              className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="name-asc" className="bg-gray-800 text-white">İsim A-Z</option>
              <option value="name-desc" className="bg-gray-800 text-white">İsim Z-A</option>
              <option value="company-asc" className="bg-gray-800 text-white">Şirket A-Z</option>
              <option value="company-desc">Şirket Z-A</option>
              <option value="created-desc">En Yeni</option>
              <option value="created-asc">En Eski</option>
              <option value="spent-desc">En Çok Harcayan</option>
              <option value="spent-asc">En Az Harcayan</option>
              <option value="orders-desc">En Çok Sipariş</option>
              <option value="orders-asc">En Az Sipariş</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          Yeni Müşteri
        </button>
      </div>

      {/* Customer List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer List */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {filteredCustomers.length === 0 ? (
            <div className="text-center p-8 bg-black/40 border border-white/10 rounded-2xl">
              <Users className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">Müşteri bulunamadı</p>
            </div>
          ) : (
            filteredCustomers.map(customer => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedCustomer?.id === customer.id
                    ? 'bg-blue-500/10 border-blue-500/50'
                    : 'bg-black/40 border-white/10 hover:border-white/30'
                }`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-bold">{customer.contactName}</h3>
                    <p className="text-blue-400 text-sm">{customer.email}</p>
                    <p className="text-white/60 text-sm">{customer.companyName}</p>
                  </div>
                  <div className="flex gap-1">
                    <span className={`px-2 py-1 rounded text-xs border flex items-center gap-1 ${getStatusColor(customer.status)}`}>
                      {getStatusIcon(customer.status)}
                      {customer.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs border flex items-center gap-1 ${getPriorityColor(customer.priority)}`}>
                      {getPriorityIcon(customer.priority)}
                      {customer.priority}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-white/60">
                  <div className="flex gap-4">
                    <span>{customer.totalOrders} sipariş</span>
                    <span>₺{customer.totalSpent.toLocaleString('tr-TR')}</span>
                  </div>
                  <span>{new Date(customer.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>

                {customer.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {customer.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {customer.tags.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded">
                        +{customer.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Customer Detail */}
        <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
          {selectedCustomer ? (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedCustomer.contactName}</h2>
                  <div className="flex gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-lg text-sm border flex items-center gap-2 ${getStatusColor(selectedCustomer.status)}`}>
                      {getStatusIcon(selectedCustomer.status)}
                      {selectedCustomer.status}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-sm border flex items-center gap-2 ${getPriorityColor(selectedCustomer.priority)}`}>
                      {getPriorityIcon(selectedCustomer.priority)}
                      {selectedCustomer.priority}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCustomer(selectedCustomer)}
                    className="p-2 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400 hover:bg-blue-500/30"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCustomer(selectedCustomer.id)}
                    className="p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white/60 text-sm">Email</p>
                      <p className="text-white">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <Phone className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-white/60 text-sm">Telefon</p>
                      <p className="text-white">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <Building className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-white/60 text-sm">Şirket</p>
                      <p className="text-white">{selectedCustomer.companyName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="text-white/60 text-sm">Kayıt Tarihi</p>
                      <p className="text-white">{new Date(selectedCustomer.createdAt).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-2xl font-bold text-white">{selectedCustomer.totalOrders}</p>
                  <p className="text-white/60 text-sm">Toplam Sipariş</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-2xl font-bold text-white">₺{selectedCustomer.totalSpent.toLocaleString('tr-TR')}</p>
                  <p className="text-white/60 text-sm">Toplam Harcama</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-2xl font-bold text-white">
                    ₺{selectedCustomer.totalOrders > 0 ? (selectedCustomer.totalSpent / selectedCustomer.totalOrders).toLocaleString('tr-TR') : '0'}
                  </p>
                  <p className="text-white/60 text-sm">Ortalama Sipariş</p>
                </div>
              </div>

              {/* Additional Info */}
              {selectedCustomer.address && (
                <div className="mb-4 p-3 bg-white/5 rounded-lg">
                  <p className="text-white/60 text-sm mb-1">Adres</p>
                  <p className="text-white">{selectedCustomer.address}</p>
                </div>
              )}

              {selectedCustomer.notes && (
                <div className="mb-4 p-3 bg-white/5 rounded-lg">
                  <p className="text-white/60 text-sm mb-1">Notlar</p>
                  <p className="text-white">{selectedCustomer.notes}</p>
                </div>
              )}

              {/* Tags */}
              {selectedCustomer.tags.length > 0 && (
                <div className="mb-4">
                  <p className="text-white/60 text-sm mb-2">Etiketler</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-lg border border-blue-500/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-white/10">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-400 hover:bg-blue-500/30">
                  <MessageCircle className="w-4 h-4" />
                  Mesaj Gönder
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-500/30">
                  <FileText className="w-4 h-4" />
                  Sipariş Geçmişi
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-400 hover:bg-purple-500/30">
                  <Download className="w-4 h-4" />
                  Rapor İndir
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-white/60">
              <div className="text-center">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Detayları görmek için bir müşteri seçin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}