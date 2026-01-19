import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { LogOut, Users, Settings, BarChart3, FileText, Shield, Bell } from 'lucide-react'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { service } = useParams()
  const [adminData, setAdminData] = useState<any>(null)

  useEffect(() => {
    // Check if admin is logged in
    const adminUser = localStorage.getItem('adminUser')
    if (!adminUser) {
      navigate('/login')
      return
    }
    setAdminData(JSON.parse(adminUser))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminUser')
    navigate('/')
  }

  const stats = [
    { label: 'Toplam Kullanıcı', value: '156', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Aktif Lisans', value: '89', icon: Shield, color: 'from-green-500 to-emerald-500' },
    { label: 'Bekleyen İşlem', value: '12', icon: Bell, color: 'from-yellow-500 to-orange-500' },
    { label: 'Aylık Gelir', value: '₺45.2K', icon: BarChart3, color: 'from-purple-500 to-pink-500' }
  ]

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
      <header className="border-b border-white/10 backdrop-blur-xl bg-black/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-white/60 text-sm capitalize">{service || 'Nexaven'}</p>
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
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
                <div className="relative p-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl">
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <ActionCard
            icon={Users}
            title="Kullanıcı Yönetimi"
            description="Kullanıcıları görüntüle ve yönet"
            color="from-blue-500 to-cyan-500"
          />
          <ActionCard
            icon={Settings}
            title="Sistem Ayarları"
            description="Genel ayarları yapılandır"
            color="from-purple-500 to-pink-500"
          />
          <ActionCard
            icon={FileText}
            title="Raporlar"
            description="Detaylı raporları görüntüle"
            color="from-green-500 to-emerald-500"
          />
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Son Aktiviteler</h2>
          <div className="space-y-4">
            {[
              { user: 'test@example.com', action: 'Yeni lisans talebi', time: '5 dakika önce' },
              { user: 'admin@test.com', action: 'Sistem ayarları güncellendi', time: '1 saat önce' },
              { user: 'user@domain.com', action: 'Dosya yüklendi', time: '2 saat önce' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="text-white font-medium">{activity.user}</p>
                  <p className="text-white/60 text-sm">{activity.action}</p>
                </div>
                <p className="text-white/40 text-sm">{activity.time}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}

function ActionCard({ icon: Icon, title, description, color }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      className="relative group text-left"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
      <div className="relative p-6 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl group-hover:border-white/30 transition-all">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} inline-block mb-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-white/60 text-sm">{description}</p>
      </div>
    </motion.button>
  )
}
