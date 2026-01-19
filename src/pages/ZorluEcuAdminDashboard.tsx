import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { LogOut, Users, BarChart3, FileText, MessageCircle, Upload, CheckCircle, Clock } from 'lucide-react'

export default function ZorluEcuAdminDashboard() {
  const navigate = useNavigate()
  const [adminData, setAdminData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'chat' | 'files'>('overview')
  const [corporateUsers, setCorporateUsers] = useState<any[]>([])
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser')
    if (!adminUser) {
      navigate('/login')
      return
    }
    const admin = JSON.parse(adminUser)
    if (admin.service !== 'zorlu-ecu') {
      alert('Bu panele erişim yetkiniz yok!')
      navigate('/')
      return
    }
    setAdminData(admin)

    // Kurumsal kullanıcıları yükle
    const users = JSON.parse(localStorage.getItem('corporateUsers_zorlu-ecu') || '[]')
    setCorporateUsers(users)

    // Chat mesajlarını yükle
    const messages = JSON.parse(localStorage.getItem('adminChat_zorlu-ecu') || '[]')
    setChatMessages(messages)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminUser')
    navigate('/')
  }

  const approveUser = (email: string) => {
    const updated = corporateUsers.map(u => 
      u.email === email ? { ...u, approved: true } : u
    )
    setCorporateUsers(updated)
    localStorage.setItem('corporateUsers_zorlu-ecu', JSON.stringify(updated))
    alert('Kullanıcı onaylandı!')
  }

  const rejectUser = (email: string) => {
    const updated = corporateUsers.filter(u => u.email !== email)
    setCorporateUsers(updated)
    localStorage.setItem('corporateUsers_zorlu-ecu', JSON.stringify(updated))
    alert('Kullanıcı reddedildi!')
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return
    const message = {
      sender: 'admin',
      text: newMessage,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    }
    const updated = [...chatMessages, message]
    setChatMessages(updated)
    localStorage.setItem('adminChat_zorlu-ecu', JSON.stringify(updated))
    setNewMessage('')
  }

  const stats = [
    { label: 'Toplam Kullanıcı', value: corporateUsers.length, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Onaylı', value: corporateUsers.filter(u => u.approved).length, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
    { label: 'Bekleyen', value: corporateUsers.filter(u => !u.approved).length, icon: Clock, color: 'from-yellow-500 to-orange-500' },
    { label: 'Mesajlar', value: chatMessages.length, icon: MessageCircle, color: 'from-purple-500 to-pink-500' }
  ]

  if (!adminData) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              Zorlu ECU Admin Panel
            </h1>
            <p className="text-white/60 text-sm">Motor Performans Yönetimi</p>
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

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 p-1 bg-white/5 rounded-xl border border-white/10">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={BarChart3} label="Genel Bakış" />
          <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={Users} label="Kullanıcılar" />
          <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={MessageCircle} label="Chat" />
          <TabButton active={activeTab === 'files'} onClick={() => setActiveTab('files')} icon={FileText} label="Dosyalar" />
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'users' && <UsersTab users={corporateUsers} onApprove={approveUser} onReject={rejectUser} />}
          {activeTab === 'chat' && <AdminChatTab messages={chatMessages} newMessage={newMessage} setNewMessage={setNewMessage} onSend={sendMessage} />}
          {activeTab === 'files' && <FilesTab />}
        </motion.div>
      </main>
    </div>
  )
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
        active
          ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  )
}

function OverviewTab() {
  const activities = [
    { user: 'user@company.com', action: 'Yeni ECU dosyası yüklendi', time: '5 dakika önce', type: 'upload' },
    { user: 'test@domain.com', action: 'Stage 2 tuning talebi', time: '1 saat önce', type: 'request' },
    { user: 'admin@zorluecu.com', action: 'Kullanıcı onaylandı', time: '2 saat önce', type: 'approval' }
  ]

  return (
    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Son Aktiviteler</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${
                activity.type === 'upload' ? 'bg-blue-500/20' :
                activity.type === 'request' ? 'bg-yellow-500/20' : 'bg-green-500/20'
              }`}>
                {activity.type === 'upload' && <Upload className="w-5 h-5 text-blue-400" />}
                {activity.type === 'request' && <Clock className="w-5 h-5 text-yellow-400" />}
                {activity.type === 'approval' && <CheckCircle className="w-5 h-5 text-green-400" />}
              </div>
              <div>
                <p className="text-white font-medium">{activity.user}</p>
                <p className="text-white/60 text-sm">{activity.action}</p>
              </div>
            </div>
            <p className="text-white/40 text-sm">{activity.time}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function UsersTab({ users, onApprove, onReject }: any) {
  return (
    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Kurumsal Kullanıcılar</h2>
      <div className="space-y-4">
        {users.length === 0 ? (
          <p className="text-white/60 text-center py-8">Henüz kayıtlı kullanıcı yok</p>
        ) : (
          users.map((user: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-bold">{user.email}</p>
                  <p className="text-white/80">{user.companyName}</p>
                  <p className="text-white/60 text-sm">{user.contactName} - {user.phone}</p>
                  <p className="text-white/40 text-xs mt-1">
                    Kayıt: {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {user.approved ? (
                    <span className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg">
                      <CheckCircle className="w-4 h-4" />
                      Onaylı
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => onApprove(user.email)}
                        className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => onReject(user.email)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                      >
                        Reddet
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

function AdminChatTab({ messages, newMessage, setNewMessage, onSend }: any) {
  return (
    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[600px] flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-6">Müşteri Chat</h2>
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 ? (
          <p className="text-white/60 text-center py-8">Henüz mesaj yok</p>
        ) : (
          messages.map((msg: any, index: number) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-4 rounded-2xl ${
                  msg.sender === 'admin'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white'
                    : 'bg-white/10 text-white'
                }`}
              >
                <p className="font-medium mb-1 text-sm opacity-70">
                  {msg.sender === 'admin' ? 'Admin' : 'Müşteri'}
                </p>
                <p>{msg.text}</p>
                <p className="text-xs mt-2 opacity-70">{msg.time}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSend()}
          placeholder="Mesajınızı yazın..."
          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-red-500"
        />
        <button
          onClick={onSend}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-xl text-white font-bold hover:shadow-lg transition-all"
        >
          Gönder
        </button>
      </div>
    </div>
  )
}

function FilesTab() {
  const files = [
    { name: 'bmw_335i_original.bin', user: 'user@company.com', date: '15.01.2026', size: '512 KB', type: 'Original' },
    { name: 'audi_a4_stage1.bin', user: 'test@domain.com', date: '16.01.2026', size: '512 KB', type: 'Stage 1' },
    { name: 'vw_golf_stage2.bin', user: 'admin@test.com', date: '17.01.2026', size: '512 KB', type: 'Stage 2' }
  ]

  return (
    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Yüklenen ECU Dosyaları</h2>
      <div className="space-y-3">
        {files.map((file, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-red-600 to-red-500 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-white/60 text-sm">{file.user}</p>
                <p className="text-white/40 text-xs">{file.size} • {file.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm">
                {file.type}
              </span>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all">
                İndir
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
