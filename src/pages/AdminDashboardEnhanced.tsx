import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { LogOut, Users, Settings, BarChart3, FileText, Shield, Bell, Plus, Trash2, Edit2, Check, X, MessageCircle, UserCheck } from 'lucide-react'
import CustomerApprovalSystem from '../components/CustomerApprovalSystem'
import EnhancedCustomerManagement from '../components/EnhancedCustomerManagement'

interface License {
  id: string
  userId: string
  type: 'basic' | 'pro' | 'enterprise'
  purchaseDate: string
  expiryDate: string
  status: 'active' | 'expired' | 'revoked'
  price: number
  features: string[]
}

interface User {
  id: string
  email: string
  name: string
  company: string
  joinDate: string
  licenses: string[]
  status: 'active' | 'inactive'
}

export default function AdminDashboardEnhanced() {
  const navigate = useNavigate()
  const [adminData, setAdminData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'licenses' | 'approvals' | 'customers' | 'settings'>('dashboard')
  const [users, setUsers] = useState<User[]>([])
  const [licenses, setLicenses] = useState<License[]>([])
  const [showNewLicenseModal, setShowNewLicenseModal] = useState(false)
  const [newLicense, setNewLicense] = useState<Partial<License>>({})
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [editingLicense, setEditingLicense] = useState<string | null>(null)

  const licenseTypes = {
    basic: { name: 'Basic', price: 99, color: 'from-blue-500 to-cyan-500', features: ['API Erişimi', 'Email Destek', '1 Proje'] },
    pro: { name: 'Pro', price: 299, color: 'from-purple-500 to-pink-500', features: ['API Erişimi', 'Email & Chat Destek', '5 Proje', 'Analytics'] },
    enterprise: { name: 'Enterprise', price: 999, color: 'from-orange-500 to-red-500', features: ['Özel API', '24/7 Destek', 'Sınırsız Proje', 'Analytics', 'Dedicated Manager'] }
  }

  useEffect(() => {
    const admin = localStorage.getItem('adminUser')
    if (!admin) {
      navigate('/')
      return
    }

    const adminData = JSON.parse(admin)
    setAdminData(adminData)
    loadData()
  }, [navigate])

  const loadData = () => {
    // Load real users from corporateUsers - no default test data
    const savedUsers = localStorage.getItem('nexaven_users') || '[]'
    setUsers(JSON.parse(savedUsers))

    // Load real licenses - no default test data
    const savedLicenses = localStorage.getItem('nexaven_licenses') || '[]'
    setLicenses(JSON.parse(savedLicenses))
  }

  const handleCreateLicense = () => {
    if (!selectedUser || !newLicense.type) return

    const license: License = {
      id: 'L' + Date.now(),
      userId: selectedUser,
      type: newLicense.type as any,
      purchaseDate: new Date().toISOString().split('T')[0],
      expiryDate: newLicense.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      price: licenseTypes[newLicense.type as keyof typeof licenseTypes]?.price || 0,
      features: licenseTypes[newLicense.type as keyof typeof licenseTypes]?.features || []
    }

    const updated = [...licenses, license]
    setLicenses(updated)
    localStorage.setItem('nexaven_licenses', JSON.stringify(updated))

    const updatedUsers = users.map(u =>
      u.id === selectedUser
        ? { ...u, licenses: [...u.licenses, license.id] }
        : u
    )
    setUsers(updatedUsers)
    localStorage.setItem('nexaven_users', JSON.stringify(updatedUsers))

    setShowNewLicenseModal(false)
    setNewLicense({})
    setSelectedUser('')
  }

  const handleRevokeLicense = (licenseId: string) => {
    if (!confirm('Lisansı iptal etmek istediğinize emin misiniz?')) return

    const updated = licenses.map(l =>
      l.id === licenseId ? { ...l, status: 'revoked' as const } : l
    )
    setLicenses(updated)
    localStorage.setItem('nexaven_licenses', JSON.stringify(updated))
  }

  const handleLogout = () => {
    localStorage.removeItem('adminUser')
    navigate('/')
  }

  const activeLicenses = licenses.filter(l => l.status === 'active').length
  const totalRevenue = licenses.filter(l => l.status === 'active').reduce((sum, l) => sum + l.price, 0)
  const activeLicensesRevenue = licenses.reduce((sum, l) => sum + (l.status === 'active' ? l.price : 0), 0)

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Nexaven Core - Admin Panel</h1>
            <p className="text-white/60 text-sm">Yönetim Kontrol Merkezi</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-medium">{adminData.email}</p>
              <p className="text-white/60 text-sm">Yönetici</p>
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

      {/* Navigation Tabs */}
      <div className="border-b border-white/10 backdrop-blur-xl bg-black/10 sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-2">
            {[
              { id: 'dashboard', label: '📊 Kontrol Paneli' },
              { id: 'users', label: '👥 Kullanıcılar' },
              { id: 'licenses', label: '🔐 Lisanslar' },
              { id: 'approvals', label: '✅ Onaylar' },
              { id: 'customers', label: '🏢 Müşteriler' },
              { id: 'settings', label: '⚙️ Ayarlar' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
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
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Toplam Kullanıcı', value: users.length, icon: Users, color: 'from-blue-500 to-cyan-500' },
                { label: 'Aktif Lisans', value: activeLicenses, icon: Shield, color: 'from-green-500 to-emerald-500' },
                { label: 'Aylık Gelir', value: `₺${(activeLicensesRevenue / 12).toLocaleString('tr-TR')}`, icon: BarChart3, color: 'from-purple-500 to-pink-500' },
                { label: 'Toplam Gelir', value: `₺${activeLicensesRevenue.toLocaleString('tr-TR')}`, icon: FileText, color: 'from-orange-500 to-red-500' }
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity`} />
                    <div className="relative p-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/30 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                      <p className="text-white/60 text-sm">{stat.label}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">Son Aktiviteler</h2>
              <div className="space-y-4">
                {[...licenses]
                  .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
                  .slice(0, 5)
                  .map((license) => {
                    const user = users.find(u => u.id === license.userId)
                    return (
                      <div key={license.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                          <p className="text-white font-medium">{user?.email || 'Bilinmeyen Kullanıcı'}</p>
                          <p className="text-white/60 text-sm">{licenseTypes[license.type]?.name} Lisansı - {license.status}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">₺{license.price}</p>
                          <p className="text-white/40 text-sm">{new Date(license.purchaseDate).toLocaleDateString('tr-TR')}</p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </motion.div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {users.map(user => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-2xl bg-black/60 border border-white/10 hover:border-blue-500/50 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-bold text-lg">{user.name}</p>
                    <p className="text-blue-400">{user.email}</p>
                    <p className="text-white/60 text-sm">{user.company}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className={`px-3 py-1 rounded-lg ${user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {user.status === 'active' ? '✓ Aktif' : '✕ İnaktif'}
                      </span>
                      <span className="px-3 py-1 bg-white/10 text-white/60 rounded-lg">
                        {new Date(user.joinDate).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-sm mb-2">Lisanslar</p>
                    <p className="text-2xl font-bold text-white">{user.licenses.length}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Licenses Tab */}
        {activeTab === 'licenses' && (
          <div className="space-y-4">
            {/* New License Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewLicenseModal(true)}
              className="w-full py-4 rounded-xl border-2 border-dashed border-blue-500/30 hover:border-blue-500/50 text-blue-400 font-bold transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Yeni Lisans Ekle
            </motion.button>

            {/* License List */}
            {licenses.map(license => {
              const user = users.find(u => u.id === license.userId)
              const licenseType = licenseTypes[license.type]
              const isExpired = new Date(license.expiryDate) < new Date()

              return (
                <motion.div
                  key={license.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-2xl border transition-all ${
                    license.status === 'revoked'
                      ? 'bg-red-500/10 border-red-500/30'
                      : isExpired
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-black/60 border-white/10 hover:border-blue-500/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-white font-bold text-lg">{licenseType?.name}</p>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          license.status === 'revoked' ? 'bg-red-500/20 text-red-400' :
                          isExpired ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {license.status === 'revoked' ? '✕ İptal' :
                           isExpired ? '⚠️ Süresi Doldu' :
                           '✓ Aktif'}
                        </span>
                      </div>
                      <p className="text-blue-400 mb-1">{user?.email}</p>
                      <p className="text-white/60 text-sm mb-3">{user?.name}</p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {license.features.map(feature => (
                          <span key={feature} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded">
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* Dates */}
                      <div className="flex gap-4 text-sm text-white/60">
                        <span>Başlangıç: {new Date(license.purchaseDate).toLocaleDateString('tr-TR')}</span>
                        <span>Bitiş: {new Date(license.expiryDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-white mb-4">₺{license.price}</p>
                      {license.status !== 'revoked' && (
                        <button
                          onClick={() => handleRevokeLicense(license.id)}
                          className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-all"
                        >
                          <Trash2 className="w-4 h-4 inline mr-2" />
                          İptal Et
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Approvals Tab */}
        {activeTab === 'approvals' && (
          <CustomerApprovalSystem
            service="nexaven-core"
            onApprove={(customerId) => {
              console.log('Customer approved:', customerId)
              // Handle approval logic
            }}
            onReject={(customerId, reason) => {
              console.log('Customer rejected:', customerId, reason)
              // Handle rejection logic
            }}
          />
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <EnhancedCustomerManagement service="nexaven-core" />
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* License Types */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/60 border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Lisans Türleri</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(licenseTypes).map(([key, type]) => (
                  <div key={key} className={`p-6 rounded-xl bg-gradient-to-br ${type.color} bg-opacity-20 border border-current border-opacity-30`}>
                    <p className="text-white font-bold text-lg mb-2">{type.name}</p>
                    <p className="text-3xl font-bold text-white mb-4">₺{type.price}</p>
                    <ul className="space-y-2 text-white/80 text-sm">
                      {type.features.map(feature => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* System Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/60 border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">Sistem Bilgileri</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Platform</span>
                  <span className="text-white font-bold">Nexaven Core</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Versiyon</span>
                  <span className="text-white font-bold">v3.0</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-white/60">Toplam Kullanıcı</span>
                  <span className="text-white font-bold">{users.length}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-white/60">Aktif Lisans</span>
                  <span className="text-white font-bold">{activeLicenses}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      {/* New License Modal */}
      {showNewLicenseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-white/20 rounded-2xl p-6 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Yeni Lisans Ekle</h2>

            <div className="space-y-4">
              {/* User Select */}
              <div>
                <label className="block text-white/60 text-sm font-semibold mb-2">Kullanıcı Seç</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="" className="bg-gray-800 text-white">Seçiniz...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id} className="bg-gray-800 text-white">
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* License Type */}
              <div>
                <label className="block text-white/60 text-sm font-semibold mb-2">Lisans Türü</label>
                <div className="space-y-2">
                  {Object.entries(licenseTypes).map(([key, type]) => (
                    <label key={key} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer">
                      <input
                        type="radio"
                        name="license-type"
                        value={key}
                        checked={newLicense.type === key}
                        onChange={(e) => setNewLicense({ ...newLicense, type: e.target.value as any })}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="text-white font-semibold">{type.name}</p>
                        <p className="text-white/60 text-sm">₺{type.price}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-white/60 text-sm font-semibold mb-2">Bitiş Tarihi (Opsiyonel)</label>
                <input
                  type="date"
                  value={newLicense.expiryDate || ''}
                  onChange={(e) => setNewLicense({ ...newLicense, expiryDate: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateLicense}
                  className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
                >
                  <Check className="w-4 h-4 inline mr-2" />
                  Ekle
                </button>
                <button
                  onClick={() => {
                    setShowNewLicenseModal(false)
                    setNewLicense({})
                    setSelectedUser('')
                  }}
                  className="flex-1 py-2 bg-white/10 text-white rounded-lg font-bold hover:bg-white/20 transition-all"
                >
                  <X className="w-4 h-4 inline mr-2" />
                  İptal
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
