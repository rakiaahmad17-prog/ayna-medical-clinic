'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard, Users, Calendar, LogOut, Menu, Eye, Clock,
  TrendingUp, FileSpreadsheet, Printer, ChevronLeft, BarChart3,
  Search, Plus, X, Check, AlertCircle, ChevronRight,
  Trash2, RefreshCw, Inbox, ArrowUpRight, ArrowDownRight, PieChart,
  Database, Download, Loader2, CloudOff, Cloud
} from 'lucide-react'
import {
  DashboardStats, Booking, emptyStats, emptyBookings,
  generateBookingCSV, generateBookingPDF, downloadCSV,
  getStatusColor, getStatusLabel, emptyStateMessages,
  loadBookingsFromStorage, saveBookingsToStorage, clearAllData,
  generateFullReportPDF, generateFullReportCSV, Patient
} from '@/data/dashboard'

// Types for API responses
interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

interface BookingApiResponse extends ApiResponse<Booking | Booking[]> {
  total?: number
}

// Toast Notification
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed bottom-4 right-4 ${type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-3 animate-slide-up`}>
      {type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded p-1"><X size={16} /></button>
    </div>
  )
}

// Sync Status Indicator
function SyncStatusBadge({ isOnline, lastSync, isSyncing }: { isOnline: boolean; lastSync: Date | null; isSyncing: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
      isSyncing ? 'bg-blue-100 text-blue-600' : isOnline ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
    }`}>
      {isSyncing ? (
        <Loader2 size={14} className="animate-spin" />
      ) : isOnline ? (
        <Cloud size={14} />
      ) : (
        <CloudOff size={14} />
      )}
      <span>{isSyncing ? 'Syncing...' : isOnline ? 'Online' : 'Offline'}</span>
      {lastSync && !isSyncing && (
        <span className="text-current opacity-70">
          {lastSync.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  )
}

// Loading Spinner Component
function LoadingSpinner({ size = 24, text }: { size?: number; text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2 size={size} className="text-teal-500 animate-spin" />
      {text && <p className="text-slate-500 text-sm">{text}</p>}
    </div>
  )
}

// Empty State Component
function EmptyState({ title, description, icon }: {
  title: string; description: string; icon: 'calendar' | 'users' | 'chart'
}) {
  const icons = { calendar: Calendar, users: Users, chart: BarChart3 }
  const Icon = icons[icon]
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
        <Icon size={40} className="text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-700 mb-2">{title}</h3>
      <p className="text-slate-500 text-center max-w-md">{description}</p>
    </div>
  )
}

// Stat Card with Animation
function StatCard({ title, value, icon: Icon, color, delay, trend }: {
  title: string; value: number | string; icon: any; color: string; delay: number; trend?: { value: number; positive: boolean }
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t) }, [delay])

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg transition-all duration-500 hover:shadow-xl hover:scale-[1.02] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <span className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full ${trend.positive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
            {trend.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{trend.value}%
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-slate-800">{value}</div>
      <div className="text-sm text-slate-500">{title}</div>
    </div>
  )
}

// Status Badge
function StatusBadge({ status }: { status: Booking['status'] }) {
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>{getStatusLabel(status)}</span>
}

// API Helper Functions
async function fetchBookingsFromApi(): Promise<Booking[]> {
  try {
    const response = await fetch('/api/bookings', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: BookingApiResponse = await response.json()

    if (result.success && result.data) {
      return Array.isArray(result.data) ? result.data : [result.data]
    }
    return []
  } catch (error) {
    console.error('Failed to fetch bookings from API:', error)
    return []
  }
}

async function updateBookingStatusApi(id: string, status: Booking['status']): Promise<boolean> {
  try {
    const response = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<Booking> = await response.json()
    return result.success
  } catch (error) {
    console.error('Failed to update booking status:', error)
    return false
  }
}

async function deleteBookingApi(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/bookings/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<null> = await response.json()
    return result.success
  } catch (error) {
    console.error('Failed to delete booking:', error)
    return false
  }
}

async function exportAllBookingsApi(): Promise<Booking[]> {
  try {
    const response = await fetch('/api/bookings?export=all', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: BookingApiResponse = await response.json()

    if (result.success && result.data) {
      return Array.isArray(result.data) ? result.data : [result.data]
    }
    return []
  } catch (error) {
    console.error('Failed to export bookings from API:', error)
    return []
  }
}

// ========== MAIN DASHBOARD ==========

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<DashboardStats>(emptyStats)

  // New state for API integration
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const isApiAvailable = useRef(true)

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true)
      try {
        // Try to fetch from API first
        const apiBookings = await fetchBookingsFromApi()

        if (apiBookings.length > 0) {
          setBookings(apiBookings)
          saveBookingsToStorage(apiBookings)
          setLastSync(new Date())
          setIsOnline(true)
          isApiAvailable.current = true
        } else {
          // Fallback to localStorage
          const stored = loadBookingsFromStorage()
          const data = stored.length > 0 ? stored : emptyBookings
          setBookings(data)
          isApiAvailable.current = false
          setIsOnline(false)
        }
      } catch {
        // Fallback to localStorage on error
        const stored = loadBookingsFromStorage()
        const data = stored.length > 0 ? stored : emptyBookings
        setBookings(data)
        isApiAvailable.current = false
        setIsOnline(false)
      }
      setIsLoading(false)
    }

    initializeData()
  }, [])

  // Calculate stats whenever bookings change
  useEffect(() => {
    if (bookings.length > 0) {
      const uniquePatients = new Set(bookings.map(b => b.nama))
      const monthlyTrends: { [key: string]: number } = {}
      const serviceCounts: { [key: string]: number } = {}

      bookings.forEach(b => {
        const month = new Date(b.tanggal).toLocaleDateString('id-ID', { month: 'short' })
        monthlyTrends[month] = (monthlyTrends[month] || 0) + 1
        serviceCounts[b.layanan] = (serviceCounts[b.layanan] || 0) + 1
      })

      setStats({
        totalBooking: bookings.length,
        bookingPending: bookings.filter(b => b.status === 'pending').length,
        bookingConfirmed: bookings.filter(b => b.status === 'confirmed').length,
        bookingCompleted: bookings.filter(b => b.status === 'completed').length,
        bookingCancelled: bookings.filter(b => b.status === 'cancelled').length,
        totalPasien: uniquePatients.size,
        pertumbuhan: 12,
        bookingPerBulan: Object.entries(monthlyTrends).map(([bulan, jumlah]) => ({ bulan, jumlah })),
        layananPopuler: Object.entries(serviceCounts).map(([nama, jumlah]) => ({ nama, jumlah })),
        dokterPopuler: []
      })
    }
  }, [bookings])

  // Sync from database
  const handleSyncFromDatabase = useCallback(async () => {
    setIsSyncing(true)
    try {
      const apiBookings = await fetchBookingsFromApi()

      if (apiBookings.length > 0 || isApiAvailable.current) {
        setBookings(apiBookings)
        saveBookingsToStorage(apiBookings)
        setLastSync(new Date())
        setIsOnline(true)
        isApiAvailable.current = true
        showToast(`Berhasil sinkron! ${apiBookings.length} booking dimuat dari database.`, 'success')
      } else {
        showToast('Database tidak tersedia. Menggunakan data lokal.', 'error')
        setIsOnline(false)
      }
    } catch {
      showToast('Gagal sinkron dari database. Menggunakan data lokal.', 'error')
      setIsOnline(false)
    }
    setIsSyncing(false)
  }, [])

  // Export all bookings from database
  const handleExportAllFromDb = useCallback(async () => {
    setIsLoading(true)
    try {
      const allBookings = await exportAllBookingsApi()

      if (allBookings.length > 0) {
        const csv = generateBookingCSV(allBookings)
        downloadCSV(csv, `all-bookings-${new Date().toISOString().split('T')[0]}.csv`)
        showToast(`${allBookings.length} booking berhasil diexport dari database!`, 'success')
      } else {
        // Fallback to local data
        const csv = generateBookingCSV(bookings)
        downloadCSV(csv, `booking-report-${new Date().toISOString().split('T')[0]}.csv`)
        showToast('Database kosong. Export dari data lokal.', 'success')
      }
    } catch {
      // Fallback to local data
      const csv = generateBookingCSV(bookings)
      downloadCSV(csv, `booking-report-${new Date().toISOString().split('T')[0]}.csv`)
      showToast('Gagal export dari DB. Export dari data lokal.', 'success')
    }
    setIsLoading(false)
  }, [bookings])

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
  }, [])

  const handleLogout = () => {
    document.cookie = 'dashboard_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
    router.push('/dashboard/login')
  }

  const handleExportCSV = () => {
    const csv = generateBookingCSV(bookings)
    downloadCSV(csv, `booking-report-${new Date().toISOString().split('T')[0]}.csv`)
    showToast('CSV berhasil diunduh!', 'success')
  }

  const handleExportPDF = () => {
    generateBookingPDF(bookings)
    showToast('PDF berhasil diunduh!', 'success')
  }

  const handleDeleteBooking = async (id: string) => {
    if (confirm('Hapus booking ini?')) {
      // Try API first, then fallback to localStorage
      if (isApiAvailable.current) {
        const success = await deleteBookingApi(id)
        if (success) {
          const updated = bookings.filter(b => b.id !== id)
          setBookings(updated)
          saveBookingsToStorage(updated)
          showToast('Booking dihapus dari database', 'success')
        } else {
          // Fallback to localStorage
          const updated = bookings.filter(b => b.id !== id)
          setBookings(updated)
          saveBookingsToStorage(updated)
          showToast('Booking dihapus (offline mode)', 'success')
        }
      } else {
        // Offline mode - only update localStorage
        const updated = bookings.filter(b => b.id !== id)
        setBookings(updated)
        saveBookingsToStorage(updated)
        showToast('Booking dihapus (offline mode)', 'success')
      }
    }
  }

  const handleClearAllData = () => {
    if (confirm('⚠️ PERHATIAN!\n\nApakah Anda yakin ingin menghapus SEMUA data?\n\nTindakan ini tidak dapat dibatalkan!\n\n- Semua booking akan dihapus\n- Semua data pasien akan dihapus')) {
      clearAllData()
      setBookings([])
      setStats(emptyStats)
      showToast('Semua data berhasil dihapus!', 'success')
    }
  }

  const handleUpdateStatus = async (id: string, status: Booking['status']) => {
    // Try API first, then fallback to localStorage
    if (isApiAvailable.current) {
      const success = await updateBookingStatusApi(id, status)
      if (success) {
        const updated = bookings.map(b => b.id === id ? { ...b, status } : b)
        setBookings(updated)
        saveBookingsToStorage(updated)
        showToast(`Status: ${getStatusLabel(status)}`, 'success')
      } else {
        // Fallback to localStorage
        const updated = bookings.map(b => b.id === id ? { ...b, status } : b)
        setBookings(updated)
        saveBookingsToStorage(updated)
        showToast(`Status: ${getStatusLabel(status)} (offline mode)`, 'success')
      }
    } else {
      // Offline mode - only update localStorage
      const updated = bookings.map(b => b.id === id ? { ...b, status } : b)
      setBookings(updated)
      saveBookingsToStorage(updated)
      showToast(`Status: ${getStatusLabel(status)} (offline mode)`, 'success')
    }
  }

  const filteredBookings = bookings.filter(b =>
    (b.nama.toLowerCase().includes(searchTerm.toLowerCase()) || b.layanan.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || b.status === statusFilter)
  )

  const hasData = bookings.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-50 flex">
      {/* Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed inset-y-0 left-0 bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center gap-3 p-4 border-b border-slate-700/50">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg flex-shrink-0">
            <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
          </div>
          {sidebarOpen && <span className="font-bold text-lg">AYNA Admin</span>}
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'bookings', icon: Calendar, label: 'Booking' },
            { id: 'patients', icon: Users, label: 'Pasien' },
            { id: 'reports', icon: BarChart3, label: 'Statistik' },
          ].map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === id ? 'bg-teal-500 shadow-lg' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
              <Icon size={20} /> {sidebarOpen && <span>{label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700/50 space-y-1">
          <Link href="/beranda" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all text-sm">
            <Eye size={18} /> {sidebarOpen && <span>Lihat Website</span>}
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm">
            <LogOut size={18} /> {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-slate-900 text-white">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
                  <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
                </div>
                <span className="font-bold">AYNA Admin</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-slate-800"><X size={20} /></button>
            </div>
            <nav className="p-4 space-y-1">
              {[
                { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
                { id: 'bookings', icon: Calendar, label: 'Booking' },
                { id: 'patients', icon: Users, label: 'Pasien' },
                { id: 'reports', icon: BarChart3, label: 'Statistik' },
              ].map(({ id, icon: Icon, label }) => (
                <button key={id} onClick={() => { setActiveTab(id); setMobileOpen(false) }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${activeTab === id ? 'bg-teal-500 text-white' : 'text-slate-400'}`}>
                  <Icon size={20} /> <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 min-h-screen transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100"><Menu size={24} className="text-slate-600" /></button>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex p-2 rounded-lg hover:bg-slate-100">
                <ChevronLeft size={20} className={`text-slate-600 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
              </button>
              <div>
                <div className="text-xs text-slate-400">Dashboard</div>
                <div className="font-semibold text-slate-800">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <SyncStatusBadge isOnline={isOnline} lastSync={lastSync} isSyncing={isSyncing} />
              <button
                onClick={handleSyncFromDatabase}
                disabled={isSyncing}
                className="flex items-center gap-2 px-3 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-all disabled:opacity-50"
              >
                <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Sync</span>
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Selamat Datang, Admin! 👋</h1>
                <p className="text-slate-500">Ringkasan aktivitas klinik</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Booking" value={stats.totalBooking} icon={Calendar} color="from-blue-500 to-blue-600" delay={0} trend={{ value: 12, positive: true }} />
                <StatCard title="Booking Pending" value={stats.bookingPending} icon={Clock} color="from-amber-500 to-orange-500" delay={100} />
                <StatCard title="Total Pasien" value={stats.totalPasien} icon={Users} color="from-emerald-500 to-green-600" delay={200} trend={{ value: 8, positive: true }} />
                <StatCard title="Pertumbuhan" value={`+${stats.pertumbuhan}%`} icon={TrendingUp} color="from-purple-500 to-violet-600" delay={300} />
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="font-semibold text-slate-800 mb-4">📊 Tren Booking Bulanan</h3>
                  {hasData ? (
                    <div className="space-y-3">
                      {stats.bookingPerBulan.map((b) => {
                        const max = Math.max(...stats.bookingPerBulan.map(x => x.jumlah), 1)
                        return (
                          <div key={b.bulan} className="flex items-center gap-3">
                            <span className="w-12 text-xs text-slate-500">{b.bulan}</span>
                            <div className="flex-1 bg-slate-100 rounded-full h-3">
                              <div className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-700" style={{ width: `${(b.jumlah / max) * 100}%` }} />
                            </div>
                            <span className="text-sm font-medium text-slate-600 w-8">{b.jumlah}</span>
                          </div>
                        )
                      })}
                    </div>
                  ) : <EmptyState title="Belum Ada Data" description="Tren booking akan muncul setelah ada data." icon="chart" />}
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="font-semibold text-slate-800 mb-4">🏥 Layanan Popular</h3>
                  {hasData ? (
                    <div className="space-y-3">
                      {stats.layananPopuler.map((l, i) => (
                        <div key={l.nama} className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold">{i + 1}</span>
                          <span className="flex-1 text-sm text-slate-700">{l.nama}</span>
                          <span className="text-sm font-medium text-slate-500">{l.jumlah} booking</span>
                        </div>
                      ))}
                    </div>
                  ) : <EmptyState title="Belum Ada Data" description="Layanan popular akan muncul setelah ada data." icon="chart" />}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b">
                  <h3 className="font-semibold text-slate-800">📋 Booking Terbaru</h3>
                  <button onClick={() => setActiveTab('bookings')} className="text-sm text-teal-600 hover:text-teal-700">Lihat Semua →</button>
                </div>
                {isLoading ? (
                  <LoadingSpinner text="Memuat data booking..." />
                ) : hasData ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead><tr className="text-left bg-slate-50">
                        <th className="p-4 text-xs font-semibold text-slate-500">Nama</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">Layanan</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">Tanggal</th>
                        <th className="p-4 text-xs font-semibold text-slate-500">Status</th>
                        <th className="p-4 text-xs font-semibold text-slate-500">Aksi</th>
                      </tr></thead>
                      <tbody>
                        {bookings.slice(0, 5).map((booking) => {
                          // Status progression: pending → confirmed → completed
                          const nextStatus = booking.status === 'pending' ? 'confirmed' : booking.status === 'confirmed' ? 'completed' : null
                          return (
                            <tr key={booking.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                              <td className="p-4">
                                <div className="font-medium text-slate-800">{booking.nama}</div>
                                <div className="text-xs text-slate-400">{booking.dokter}</div>
                              </td>
                              <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{booking.layanan}</td>
                              <td className="p-4 text-sm text-slate-500 hidden sm:table-cell">{booking.tanggal}</td>
                              <td className="p-4"><StatusBadge status={booking.status} /></td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  {nextStatus && (
                                    <button
                                      onClick={() => handleUpdateStatus(booking.id, nextStatus)}
                                      className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-500 hover:text-emerald-600"
                                      title={`Ubah ke ${getStatusLabel(nextStatus)}`}
                                    >
                                      <Check size={16} />
                                    </button>
                                  )}
                                  <button onClick={() => handleDeleteBooking(booking.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600" title="Hapus">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState title={emptyStateMessages.bookings.title} description={emptyStateMessages.bookings.description} icon="calendar" />
                )}
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-lg font-bold text-slate-800">📅 Semua Booking</h2>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleExportAllFromDb}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-xl text-sm font-medium hover:bg-teal-600 transition-all hover:scale-105 disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                      Export All
                    </button>
                    <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-all hover:scale-105">
                      <FileSpreadsheet size={16} /> Export CSV
                    </button>
                    <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-all hover:scale-105">
                      <Printer size={16} /> Export PDF
                    </button>
                    {hasData && (
                      <button onClick={handleClearAllData} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-all hover:scale-105">
                        <Trash2 size={16} /> Hapus Semua
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Cari booking..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl">
                    <option value="all">Semua Status</option>
                    <option value="pending">Menunggu</option>
                    <option value="confirmed">Dikonfirmasi</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
                </div>

                {isLoading ? (
                  <LoadingSpinner text="Memuat data booking..." />
                ) : hasData ? (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full">
                      <thead><tr className="bg-slate-50 text-left">
                        <th className="p-4 text-xs font-semibold text-slate-500">Nama</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">Layanan</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">Tanggal & Waktu</th>
                        <th className="p-4 text-xs font-semibold text-slate-500">Status</th>
                        <th className="p-4 text-xs font-semibold text-slate-500">Aksi</th>
                      </tr></thead>
                      <tbody>
                        {filteredBookings.map((booking) => {
                          // Status progression: pending → confirmed → completed
                          const nextStatus = booking.status === 'pending' ? 'confirmed' : booking.status === 'confirmed' ? 'completed' : null
                          return (
                            <tr key={booking.id} className="border-t border-slate-100 hover:bg-slate-50">
                              <td className="p-4">
                                <div className="font-medium text-slate-800">{booking.nama}</div>
                                <div className="text-xs text-slate-400">{booking.whatsapp}</div>
                              </td>
                              <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{booking.layanan}</td>
                              <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{booking.tanggal} {booking.waktu}</td>
                              <td className="p-4"><StatusBadge status={booking.status} /></td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  {nextStatus && (
                                    <button
                                      onClick={() => handleUpdateStatus(booking.id, nextStatus)}
                                      className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-500 hover:text-emerald-600 transition-all"
                                      title={`Ubah ke ${getStatusLabel(nextStatus)}`}
                                    >
                                      <ChevronRight size={16} />
                                    </button>
                                  )}
                                  <select
                                    value={booking.status}
                                    onChange={(e) => handleUpdateStatus(booking.id, e.target.value as Booking['status'])}
                                    className="text-xs border rounded px-2 py-1"
                                  >
                                    <option value="pending">Menunggu</option>
                                    <option value="confirmed">Konfirmasi</option>
                                    <option value="completed">Selesai</option>
                                    <option value="cancelled">Batal</option>
                                  </select>
                                  <button onClick={() => handleDeleteBooking(booking.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={16} /></button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState title={emptyStateMessages.bookings.title} description={emptyStateMessages.bookings.description} icon="calendar" />
                )}
              </div>
            </div>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-lg font-bold text-slate-800 mb-6">👥 Data Pasien</h2>
                {hasData ? (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full">
                      <thead><tr className="bg-slate-50 text-left">
                        <th className="p-4 text-xs font-semibold text-slate-500">Nama</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">WhatsApp</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">Total Kunjungan</th>
                        <th className="p-4 text-xs font-semibold text-slate-500">Terakhir</th>
                      </tr></thead>
                      <tbody>
                        {[...new Map(bookings.map(b => [b.nama, { nama: b.nama, whatsapp: b.whatsapp, kunjungan: bookings.filter(x => x.nama === b.nama).length, terakhir: b.tanggal }])).values()].map((p) => (
                          <tr key={p.nama} className="border-t border-slate-100 hover:bg-slate-50">
                            <td className="p-4 font-medium text-slate-800">{p.nama}</td>
                            <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{p.whatsapp}</td>
                            <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{p.kunjungan}x</td>
                            <td className="p-4 text-sm text-slate-500">{p.terakhir}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState title={emptyStateMessages.patients.title} description={emptyStateMessages.patients.description} icon="users" />
                )}
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-800">📊 Statistik & Laporan</h2>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                  <Calendar size={32} className="text-teal-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-slate-800">{stats.totalBooking}</div>
                  <div className="text-sm text-slate-500">Total Booking</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                  <Users size={32} className="text-emerald-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-slate-800">{stats.totalPasien}</div>
                  <div className="text-sm text-slate-500">Total Pasien</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                  <Clock size={32} className="text-amber-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-slate-800">{stats.bookingPending}</div>
                  <div className="text-sm text-slate-500">Pending</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                  <TrendingUp size={32} className="text-purple-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-slate-800">+{stats.pertumbuhan}%</div>
                  <div className="text-sm text-slate-500">Pertumbuhan</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-semibold text-slate-800 mb-4">📥 Export Laporan</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button onClick={() => { generateBookingPDF(bookings); showToast('PDF Booking berhasil diunduh!', 'success') }} className="flex items-center gap-3 p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all">
                    <FileSpreadsheet size={24} />
                    <div className="text-left">
                      <div className="font-medium">PDF Booking</div>
                      <div className="text-sm opacity-80">Laporan data booking</div>
                    </div>
                  </button>
                  <button onClick={() => { const csv = generateBookingCSV(bookings); downloadCSV(csv, `booking-report-${new Date().toISOString().split('T')[0]}.csv`); showToast('CSV Booking berhasil diunduh!', 'success') }} className="flex items-center gap-3 p-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all">
                    <FileSpreadsheet size={24} />
                    <div className="text-left">
                      <div className="font-medium">CSV Booking</div>
                      <div className="text-sm opacity-80">Data booking spreadsheet</div>
                    </div>
                  </button>
                  <button onClick={() => { generateFullReportPDF(stats, bookings, []); showToast('PDF Laporan Lengkap berhasil diunduh!', 'success') }} className="flex items-center gap-3 p-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all">
                    <Printer size={24} />
                    <div className="text-left">
                      <div className="font-medium">PDF Lengkap</div>
                      <div className="text-sm opacity-80">Statistik + booking</div>
                    </div>
                  </button>
                  <button onClick={() => { const csv = generateFullReportCSV(stats, bookings, []); downloadCSV(csv, `laporan-lengkap-${new Date().toISOString().split('T')[0]}.csv`); showToast('CSV Laporan Lengkap berhasil diunduh!', 'success') }} className="flex items-center gap-3 p-4 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all">
                    <FileSpreadsheet size={24} />
                    <div className="text-left">
                      <div className="font-medium">CSV Lengkap</div>
                      <div className="text-sm opacity-80">Semua data statistik</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-semibold text-slate-800 mb-4">⚠️ Zona Berbahaya</h3>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-700 mb-1">Hapus Semua Data</h4>
                      <p className="text-sm text-red-600 mb-3">Tindakan ini akan menghapus semua data booking dan pasien secara permanen. Data yang dihapus tidak dapat dikembalikan!</p>
                      <button onClick={handleClearAllData} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium">
                        <Trash2 size={16} /> Hapus Semua Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-semibold text-slate-800 mb-4">📈 Grafik Bulanan</h3>
                {hasData ? (
                  <div className="space-y-4">
                    {stats.bookingPerBulan.map((b) => {
                      const max = Math.max(...stats.bookingPerBulan.map(x => x.jumlah), 1)
                      return (
                        <div key={b.bulan} className="flex items-center gap-4">
                          <span className="w-12 text-sm text-slate-500">{b.bulan}</span>
                          <div className="flex-1 bg-slate-100 rounded-full h-8 overflow-hidden">
                            <div className="bg-gradient-to-r from-teal-500 to-teal-400 h-full rounded-full flex items-center justify-end px-3 transition-all" style={{ width: `${(b.jumlah / max) * 100}%` }}>
                              <span className="text-white text-sm font-medium">{b.jumlah} booking</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <EmptyState title={emptyStateMessages.stats.title} description={emptyStateMessages.stats.description} icon="chart" />
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
