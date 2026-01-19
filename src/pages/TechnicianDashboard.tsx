import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { LogOut, Plus, Edit2, Trash2, DollarSign, AlertCircle, CheckCircle, Clock, Search, X } from 'lucide-react'
import { getDefaultVehicles } from '../utils/testData'

interface Vehicle {
  id: string
  plate: string
  brand: string
  model: string
  year: number
  engine: string
  customer: string
  phone: string
  status: 'completed' | 'processing' | 'pending'
  totalCost: number
  paidAmount: number
  debt: number
  serviceType: string
  notes: string
}

export default function TechnicianDashboard() {
  const navigate = useNavigate()
  const { service } = useParams()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [activeTab, setActiveTab] = useState<'vehicles' | 'add' | 'debt'>('vehicles')
  const [searchPlate, setSearchPlate] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Vehicle>>({})
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('zorlu_vehicles')
    if (saved) {
      setVehicles(JSON.parse(saved))
    } else {
      const defaults = getDefaultVehicles()
      setVehicles(defaults as unknown as Vehicle[])
      localStorage.setItem('zorlu_vehicles', JSON.stringify(defaults))
    }
  }, [])

  const saveVehicles = (newVehicles: Vehicle[]) => {
    setVehicles(newVehicles)
    localStorage.setItem('zorlu_vehicles', JSON.stringify(newVehicles))
  }

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault()
    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      plate: formData.plate || '',
      brand: formData.brand || '',
      model: formData.model || '',
      year: formData.year || new Date().getFullYear(),
      engine: formData.engine || '',
      customer: formData.customer || '',
      phone: formData.phone || '',
      status: (formData.status as any) || 'pending',
      totalCost: formData.totalCost || 0,
      paidAmount: formData.paidAmount || 0,
      debt: (formData.totalCost || 0) - (formData.paidAmount || 0),
      serviceType: formData.serviceType || '',
      notes: formData.notes || ''
    }
    saveVehicles([...vehicles, newVehicle])
    setFormData({})
    setShowAddForm(false)
  }

  const handleUpdateVehicle = (id: string, updated: Partial<Vehicle>) => {
    const newVehicles = vehicles.map(v =>
      v.id === id
        ? {
            ...v,
            ...updated,
            debt: (updated.totalCost || v.totalCost) - (updated.paidAmount || v.paidAmount)
          }
        : v
    )
    saveVehicles(newVehicles)
    setEditingId(null)
  }

  const handleDeleteVehicle = (id: string) => {
    if (confirm('Bu aracı silmek istediğinize emin misiniz?')) {
      saveVehicles(vehicles.filter(v => v.id !== id))
    }
  }

  const handleLogout = () => {
    navigate('/')
  }

  const filteredVehicles = vehicles.filter(v =>
    v.plate.toLowerCase().includes(searchPlate.toLowerCase()) ||
    v.customer.toLowerCase().includes(searchPlate.toLowerCase())
  )

  const totalDebt = vehicles.reduce((sum, v) => sum + v.debt, 0)
  const completedCount = vehicles.filter(v => v.status === 'completed').length
  const processingCount = vehicles.filter(v => v.status === 'processing').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-black/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Teknisyen Paneli</h1>
            <p className="text-white/60 text-sm">Zorlu ECU Araç Yönetimi</p>
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

      {/* Stats */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30"
          >
            <p className="text-blue-400 text-sm font-semibold mb-1">Toplam Araç</p>
            <p className="text-3xl font-bold text-white">{vehicles.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30"
          >
            <p className="text-green-400 text-sm font-semibold mb-1">Tamamlanan</p>
            <p className="text-3xl font-bold text-white">{completedCount}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/30"
          >
            <p className="text-yellow-400 text-sm font-semibold mb-1">İşleniyor</p>
            <p className="text-3xl font-bold text-white">{processingCount}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30"
          >
            <p className="text-red-400 text-sm font-semibold mb-1">Cari Borç</p>
            <p className="text-3xl font-bold text-white">₺{totalDebt.toLocaleString('tr-TR')}</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-white/5 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'vehicles'
                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Araçlar
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'add'
                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Araç Ekle
          </button>
          <button
            onClick={() => setActiveTab('debt')}
            className={`flex-1 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'debt'
                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Borç Sorgulaması
          </button>
        </div>

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Plaka veya müşteri adı ile ara..."
                value={searchPlate}
                onChange={(e) => setSearchPlate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="grid gap-4">
              {filteredVehicles.map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-red-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-white mb-1">
                        {vehicle.brand} {vehicle.model} ({vehicle.year})
                      </p>
                      <p className="text-red-400 font-bold text-lg">{vehicle.plate}</p>
                      <p className="text-white/70 mt-1">Motor: {vehicle.engine}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(vehicle.id)
                          setFormData(vehicle)
                        }}
                        className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-all"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {editingId === vehicle.id ? (
                    <EditVehicleForm
                      vehicle={vehicle}
                      onSave={(updated) => {
                        handleUpdateVehicle(vehicle.id, updated)
                      }}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-white/60 text-sm mb-1">Müşteri</p>
                        <p className="text-white font-semibold">{vehicle.customer}</p>
                        <p className="text-white/60 text-xs">{vehicle.phone}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm mb-1">Hizmet</p>
                        <p className="text-white font-semibold">{vehicle.serviceType}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm mb-1">Durum</p>
                        <div className="flex items-center gap-2">
                          {vehicle.status === 'completed' && (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 font-semibold">Tamamlandı</span>
                            </>
                          )}
                          {vehicle.status === 'processing' && (
                            <>
                              <Clock className="w-4 h-4 text-yellow-400" />
                              <span className="text-yellow-400 font-semibold">İşleniyor</span>
                            </>
                          )}
                          {vehicle.status === 'pending' && (
                            <>
                              <AlertCircle className="w-4 h-4 text-blue-400" />
                              <span className="text-blue-400 font-semibold">Beklemede</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm mb-1">Borç</p>
                        <p className={`text-lg font-bold ${vehicle.debt > 0 ? 'text-red-400' : 'text-green-400'}`}>
                          ₺{vehicle.debt.toLocaleString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white/70 text-sm"><strong>Toplam:</strong> ₺{vehicle.totalCost.toLocaleString('tr-TR')} | <strong>Ödenen:</strong> ₺{vehicle.paidAmount.toLocaleString('tr-TR')}</p>
                    {vehicle.notes && <p className="text-white/60 text-sm mt-1"><strong>Notlar:</strong> {vehicle.notes}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Add Vehicle Tab */}
        {activeTab === 'add' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 rounded-2xl bg-black/40 border border-white/10"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Yeni Araç Ekle</h2>
            <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Plaka"
                value={formData.plate || ''}
                onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                required
                className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Marka"
                value={formData.brand || ''}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
                className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Model"
                value={formData.model || ''}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                required
                className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Yıl"
                value={formData.year || ''}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
                className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Motor (ör: 2.0D)"
                value={formData.engine || ''}
                onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                required
                className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Müşteri Adı"
                value={formData.customer || ''}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                required
                className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Telefon"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Hizmet Tipi (ör: Stage 1)"
                value={formData.serviceType || ''}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                required
                className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Toplam Fiyat"
                value={formData.totalCost || ''}
                onChange={(e) => setFormData({ ...formData, totalCost: parseFloat(e.target.value) })}
                required
                className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Ödenen Miktar"
                value={formData.paidAmount || ''}
                onChange={(e) => setFormData({ ...formData, paidAmount: parseFloat(e.target.value) })}
                required
                className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
              />
              <select
                value={formData.status || 'pending'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:border-red-500 focus:outline-none"
              >
                <option value="pending">Beklemede</option>
                <option value="processing">İşleniyor</option>
                <option value="completed">Tamamlandı</option>
              </select>
              <textarea
                placeholder="Notlar"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="md:col-span-2 px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none"
                rows={3}
              />
              <button
                type="submit"
                className="md:col-span-2 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-lg text-white font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all"
              >
                Araç Ekle
              </button>
            </form>
          </motion.div>
        )}

        {/* Debt Tab */}
        {activeTab === 'debt' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30">
              <h2 className="text-2xl font-bold text-white mb-4">Toplam Cari Borç</h2>
              <p className="text-5xl font-bold text-red-400">₺{totalDebt.toLocaleString('tr-TR')}</p>
            </div>

            <div className="grid gap-4">
              {vehicles
                .filter(v => v.debt > 0)
                .map((vehicle) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-black/40 border border-red-500/30 hover:border-red-500/50 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-bold">{vehicle.plate} - {vehicle.customer}</p>
                        <p className="text-white/70 text-sm">{vehicle.brand} {vehicle.model}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-400 font-bold text-2xl">₺{vehicle.debt.toLocaleString('tr-TR')}</p>
                        <p className="text-white/60 text-xs">{vehicle.serviceType}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}

function EditVehicleForm({
  vehicle,
  onSave,
  onCancel
}: {
  vehicle: Vehicle
  onSave: (data: Partial<Vehicle>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(vehicle)

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <input
          type="number"
          placeholder="Toplam Fiyat"
          value={formData.totalCost}
          onChange={(e) => setFormData({ ...formData, totalCost: parseFloat(e.target.value) })}
          className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none text-sm"
        />
        <input
          type="number"
          placeholder="Ödenen"
          value={formData.paidAmount}
          onChange={(e) => setFormData({ ...formData, paidAmount: parseFloat(e.target.value) })}
          className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:border-red-500 focus:outline-none text-sm"
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:border-red-500 focus:outline-none text-sm"
        >
          <option value="pending">Beklemede</option>
          <option value="processing">İşleniyor</option>
          <option value="completed">Tamamlandı</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave(formData)}
          className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-400 font-bold transition-all text-sm"
        >
          Kaydet
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-bold transition-all text-sm"
        >
          İptal
        </button>
      </div>
    </div>
  )
}
