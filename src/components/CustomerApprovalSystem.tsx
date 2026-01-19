import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Eye, MessageCircle, Phone, Mail, Building, Calendar, AlertCircle } from 'lucide-react'

interface PendingCustomer {
  id: string
  email: string
  companyName: string
  contactName: string
  phone: string
  address?: string
  taxNumber?: string
  website?: string
  businessType?: string
  requestedServices: string[]
  message?: string
  documents?: {
    name: string
    type: string
    size: number
    uploadedAt: string
  }[]
  createdAt: string
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
}

interface CustomerApprovalSystemProps {
  service: string
  onApprove: (customerId: string) => void
  onReject: (customerId: string, reason: string) => void
}

export default function CustomerApprovalSystem({ service, onApprove, onReject }: CustomerApprovalSystemProps) {
  const [pendingCustomers, setPendingCustomers] = useState<PendingCustomer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<PendingCustomer | null>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    loadPendingCustomers()
  }, [service])

  const loadPendingCustomers = () => {
    const customers = JSON.parse(localStorage.getItem(`pendingCustomers_${service}`) || '[]')
    setPendingCustomers(customers)
  }

  const handleApprove = (customerId: string) => {
    const updated = pendingCustomers.map(c =>
      c.id === customerId ? { ...c, status: 'approved' as const } : c
    )
    setPendingCustomers(updated)
    localStorage.setItem(`pendingCustomers_${service}`, JSON.stringify(updated))

    // Also update the user in corporateUsers to approved status
    const corporateUsers = JSON.parse(localStorage.getItem(`corporateUsers_${service}`) || '[]')
    const updatedCorporateUsers = corporateUsers.map((u: any) =>
      u.id === customerId ? { ...u, approved: true } : u
    )
    localStorage.setItem(`corporateUsers_${service}`, JSON.stringify(updatedCorporateUsers))

    // Add to approved customers list for management system
    const approvedCustomer = pendingCustomers.find(c => c.id === customerId)
    if (approvedCustomer) {
      const existingCustomers = JSON.parse(localStorage.getItem(`customers_${service}`) || '[]')
      const newCustomer = {
        id: approvedCustomer.id,
        email: approvedCustomer.email,
        companyName: approvedCustomer.companyName,
        contactName: approvedCustomer.contactName,
        phone: approvedCustomer.phone,
        address: approvedCustomer.address,
        taxNumber: approvedCustomer.taxNumber,
        website: approvedCustomer.website,
        businessType: approvedCustomer.businessType,
        status: 'active' as const,
        createdAt: approvedCustomer.createdAt,
        lastActivity: new Date().toISOString(),
        totalOrders: 0,
        totalSpent: 0,
        creditLimit: 10000,
        paymentTerms: '30 gün',
        notes: 'Yeni onaylanmış müşteri',
        tags: ['New Customer'],
        priority: 'medium' as const
      }
      existingCustomers.push(newCustomer)
      localStorage.setItem(`customers_${service}`, JSON.stringify(existingCustomers))
    }

    onApprove(customerId)
    setSelectedCustomer(null)
  }

  const handleReject = () => {
    if (!selectedCustomer || !rejectionReason.trim()) return

    const updated = pendingCustomers.map(c =>
      c.id === selectedCustomer.id 
        ? { ...c, status: 'rejected' as const, rejectionReason } 
        : c
    )
    setPendingCustomers(updated)
    localStorage.setItem(`pendingCustomers_${service}`, JSON.stringify(updated))

    // Also remove from corporateUsers or mark as rejected
    const corporateUsers = JSON.parse(localStorage.getItem(`corporateUsers_${service}`) || '[]')
    const updatedCorporateUsers = corporateUsers.filter((u: any) => u.id !== selectedCustomer.id)
    localStorage.setItem(`corporateUsers_${service}`, JSON.stringify(updatedCorporateUsers))

    onReject(selectedCustomer.id, rejectionReason)
    setShowRejectModal(false)
    setRejectionReason('')
    setSelectedCustomer(null)
  }

  const filteredCustomers = pendingCustomers.filter(c => {
    if (filter === 'all') return true
    return c.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/50'
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/50'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'approved': return '✅'
      case 'rejected': return '❌'
      default: return '❓'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Müşteri Onaylama Sistemi</h2>
          <p className="text-white/60">Bekleyen müşteri başvurularını inceleyin ve onaylayın</p>
        </div>
        
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Tümü', count: pendingCustomers.length },
            { key: 'pending', label: 'Bekleyen', count: pendingCustomers.filter(c => c.status === 'pending').length },
            { key: 'approved', label: 'Onaylanan', count: pendingCustomers.filter(c => c.status === 'approved').length },
            { key: 'rejected', label: 'Reddedilen', count: pendingCustomers.filter(c => c.status === 'rejected').length }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === f.key
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-4">
          {filteredCustomers.length === 0 ? (
            <div className="text-center p-8 bg-black/40 border border-white/10 rounded-2xl">
              <AlertCircle className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">Bu kategoride müşteri bulunmuyor</p>
            </div>
          ) : (
            filteredCustomers.map(customer => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                  selectedCustomer?.id === customer.id
                    ? 'bg-blue-500/10 border-blue-500/50'
                    : 'bg-black/40 border-white/10 hover:border-white/30'
                }`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">{customer.contactName}</h3>
                    <p className="text-blue-400">{customer.email}</p>
                    <p className="text-white/60 text-sm">{customer.companyName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg border text-sm font-semibold ${getStatusColor(customer.status)}`}>
                    {getStatusIcon(customer.status)} {customer.status === 'pending' ? 'Bekliyor' : customer.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {customer.requestedServices.map(service => (
                    <span key={service} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded">
                      {service}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm text-white/60">
                  <span>{new Date(customer.createdAt).toLocaleDateString('tr-TR')}</span>
                  <div className="flex gap-2">
                    <Phone className="w-4 h-4" />
                    <Mail className="w-4 h-4" />
                    <Building className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
          {selectedCustomer ? (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedCustomer.contactName}</h3>
                  <span className={`px-3 py-1 rounded-lg border text-sm font-semibold ${getStatusColor(selectedCustomer.status)}`}>
                    {getStatusIcon(selectedCustomer.status)} {selectedCustomer.status === 'pending' ? 'Bekliyor' : selectedCustomer.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                  </span>
                </div>
                {selectedCustomer.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(selectedCustomer.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-500/30 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      Onayla
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-all"
                    >
                      <X className="w-4 h-4" />
                      Reddet
                    </button>
                  </div>
                )}
              </div>

              {/* Customer Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-white/60 text-sm">Email</p>
                        <p className="text-white font-semibold">{selectedCustomer.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Phone className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-white/60 text-sm">Telefon</p>
                        <p className="text-white font-semibold">{selectedCustomer.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Building className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white/60 text-sm">Şirket</p>
                        <p className="text-white font-semibold">{selectedCustomer.companyName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Calendar className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-white/60 text-sm">Başvuru Tarihi</p>
                        <p className="text-white font-semibold">{new Date(selectedCustomer.createdAt).toLocaleDateString('tr-TR')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                {selectedCustomer.address && (
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-sm mb-1">Adres</p>
                    <p className="text-white">{selectedCustomer.address}</p>
                  </div>
                )}

                {selectedCustomer.taxNumber && (
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-sm mb-1">Vergi Numarası</p>
                    <p className="text-white font-mono">{selectedCustomer.taxNumber}</p>
                  </div>
                )}

                {selectedCustomer.website && (
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-sm mb-1">Website</p>
                    <a href={selectedCustomer.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                      {selectedCustomer.website}
                    </a>
                  </div>
                )}

                {/* Requested Services */}
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-white/60 text-sm mb-2">Talep Edilen Hizmetler</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.requestedServices.map(service => (
                      <span key={service} className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-lg border border-blue-500/50">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Message */}
                {selectedCustomer.message && (
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-sm mb-2">Mesaj</p>
                    <p className="text-white">{selectedCustomer.message}</p>
                  </div>
                )}

                {/* Documents */}
                {selectedCustomer.documents && selectedCustomer.documents.length > 0 && (
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-white/60 text-sm mb-2">Yüklenen Belgeler</p>
                    <div className="space-y-2">
                      {selectedCustomer.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-white/5 rounded">
                          <div>
                            <p className="text-white text-sm font-semibold">{doc.name}</p>
                            <p className="text-white/60 text-xs">{(doc.size / 1024).toFixed(2)} KB</p>
                          </div>
                          <button className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded hover:bg-blue-500/30">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                {selectedCustomer.status === 'rejected' && selectedCustomer.rejectionReason && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm font-semibold mb-1">Red Nedeni</p>
                    <p className="text-white">{selectedCustomer.rejectionReason}</p>
                  </div>
                )}
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

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">Müşteri Başvurusunu Reddet</h3>
              <p className="text-white/60 mb-4">
                {selectedCustomer?.contactName} adlı müşteriyi reddetmek istediğinize emin misiniz?
              </p>
              
              <textarea
                placeholder="Red nedeni (zorunlu)"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none resize-none"
                rows={4}
              />
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg font-bold hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4 inline mr-2" />
                  Reddet
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(false)
                    setRejectionReason('')
                  }}
                  className="flex-1 py-2 bg-white/10 text-white rounded-lg font-bold hover:bg-white/20 transition-all"
                >
                  İptal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}