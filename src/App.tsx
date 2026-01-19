import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import NotFound from './pages/NotFound'
import AdminDashboardEnhanced from './pages/AdminDashboardEnhanced'
import SlaveDashboard from './pages/SlaveDashboard'
import ZorluEcuSlaveDashboard from './pages/ZorluEcuSlaveDashboard-v2'
import ZorluEcuAdminDashboardEnhanced from './pages/ZorluEcuAdminDashboardEnhanced'
import TechnicianDashboard from './pages/TechnicianDashboard'
import VehicleQueryPage from './pages/VehicleQueryPage'
import ExploreServicePage from './pages/ExploreServicePage'


function ConditionalAdminDashboard() {
  const { service } = useParams()
  if (service === 'zorlu-ecu') {
    return <ZorluEcuAdminDashboardEnhanced />
  }
  return <AdminDashboardEnhanced />
}

function ConditionalSlaveDashboard() {
  const { service } = useParams()
  if (service === 'zorlu-ecu') {
    return <ZorluEcuSlaveDashboard />
  }
  return <SlaveDashboard />
}

function AppContent() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
    // Disable text selection globally
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'
    // Disable right-click
    document.addEventListener('contextmenu', (e) => {
      if ((e.target as HTMLElement).closest('[data-selectable]') === null) {
        e.preventDefault()
      }
    })
  }, [])

  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Explore Service Pages */}
      <Route path="/:service/kesfet" element={<ExploreServicePage />} />
      
      {/* Service Login Pages */}
      <Route path="/:service/kesfet/login" element={<AuthPage />} />

      {/* Legacy Login Route (redirect to new format) */}
      <Route path="/login" element={<AuthPage />} />

      {/* Dashboards - Conditional routing based on service */}
      <Route path="/:service/admin/dashboard" element={<ConditionalAdminDashboard />} />
      <Route path="/:service/slave/dashboard" element={<ConditionalSlaveDashboard />} />
      <Route path="/:service/technician/dashboard" element={<TechnicianDashboard />} />



      {/* Service Pages */}
      <Route path="/araç-sorgusu" element={<VehicleQueryPage />} />
      <Route path="/cari-borc-sorgula" element={<VehicleQueryPage />} />
      <Route path="/:service/cari-borc-sorgula" element={<VehicleQueryPage />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function DashboardPlaceholder({ title }: { title: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">{title}</h1>
        <p className="text-white/70">Kısa süre içinde hizmet verecek...</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
