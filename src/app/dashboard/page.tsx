'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard, Users, Calendar, FileText,
  LogOut, Menu, X, ChevronDown, Download,
  Search,
  Eye, CheckCircle, XCircle, Clock, TrendingUp,
  ChevronLeft, ChevronRight, Bell
} from 'lucide-react'
import { dashboardStats, recentBookings, patients } from '@/data/dashboard'

// Export to CSV
function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) return
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  link.click()
}

export default function DashboardPage() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [showExportMenu, setShowExportMenu] = useState(false)

  // Check auth
  useEffect(() => {
    const isAuth = document.cookie.includes('dashboard_auth=true')
    if (!isAuth) {
      router.push('/dashboard/login')
    }
  }, [router])

  const handleLogout = () => {
    document.cookie = 'dashboard_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'dashboard_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push('/dashboard/login')
  }

  const handleExport = (type: string, data: any[], filename: string) => {
    exportToCSV(data, filename)
    setShowExportMenu(false)
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'bookings', icon: Calendar, label: 'Booking' },
    { id: 'patients', icon: Users, label: 'Pasien' },
    { id: 'reports', icon: FileText, label: 'Laporan' },
  ]

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white ${isSidebarOpen ? '' : 'lg:w-20'}`}>
          {/* Logo */}
          <div className="p-4 border-b border-slate-800">
            <Link href="/beranda" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
              </div>
              {isSidebarOpen && (
                <div>
                  <span className="font-display font-bold text-white">AYNA</span>
                  <span className="block text-[9px] text-primary-400">Admin Panel</span>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-primary-500 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                {isSidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Bottom */}
          <div className="p-4 border-t border-slate-800 space-y-1">
            <Link href="/beranda" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm">
              <Eye size={18} />
              {isSidebarOpen && <span>Lihat Website</span>}
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm">
              <LogOut size={18} />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileSidebarOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-72 bg-slate-900 text-white">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <Link href="/beranda" className="flex items-center gap-3" onClick={() => setIsMobileSidebarOpen(false)}>
                  <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center overflow-hidden">
                    <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
                  </div>
                  <span className="font-display font-bold">AYNA Admin</span>
                </Link>
                <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 rounded-lg hover:bg-slate-800">
                  <X size={20} />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsMobileSidebarOpen(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                      activeTab === item.id
                        ? 'bg-primary-500 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className={`flex-1 min-h-screen transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
          {/* Header */}
          <header className="bg-white shadow-sm sticky top-0 z-20">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-surface-100">
                  <Menu size={24} className="text-slate-600" />
                </button>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:flex p-2 rounded-lg hover:bg-surface-100">
                  {isSidebarOpen ? <ChevronLeft size={20} className="text-slate-600" /> : <ChevronRight size={20} className="text-slate-600" />}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm">A</div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 sm:p-6">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold text-slate-800">Selamat Datang, Admin!</h1>
                  <p className="text-slate-500 mt-1">Berikut ringkasan aktivitas Klinik AYNA Medical Clinic</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="card p-4 sm:p-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center mb-4">
                      <Calendar size={20} className="text-white" />
                    </div>
                    <div className="font-display text-2xl sm:text-3xl font-bold text-slate-800">{dashboardStats.totalBooking}</div>
                    <div className="text-xs sm:text-sm text-slate-500 mt-1">Total Booking</div>
                  </div>
                  <div className="card p-4 sm:p-6">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center mb-4">
                      <Clock size={20} className="text-white" />
                    </div>
                    <div className="font-display text-2xl sm:text-3xl font-bold text-slate-800">{dashboardStats.bookingPending}</div>
                    <div className="text-xs sm:text-sm text-slate-500 mt-1">Pending</div>
                  </div>
                  <div className="card p-4 sm:p-6">
                    <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center mb-4">
                      <Users size={20} className="text-white" />
                    </div>
                    <div className="font-display text-2xl sm:text-3xl font-bold text-slate-800">{dashboardStats.totalPasien}</div>
                    <div className="text-xs sm:text-sm text-slate-500 mt-1">Total Pasien</div>
                  </div>
                  <div className="card p-4 sm:p-6">
                    <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center mb-4">
                      <TrendingUp size={20} className="text-white" />
                    </div>
                    <div className="font-display text-2xl sm:text-3xl font-bold text-slate-800">+12%</div>
                    <div className="text-xs sm:text-sm text-slate-500 mt-1">Growth</div>
                  </div>
                </div>

                <div className="card overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 border-b border-surface-100">
                    <h2 className="font-display text-lg font-bold text-slate-800">Booking Terbaru</h2>
                    <div className="relative">
                      <button onClick={() => setShowExportMenu(!showExportMenu)} className="btn-outline text-xs px-4 py-2 flex items-center gap-2">
                        <Download size={14} />
                        Export
                      </button>
                      {showExportMenu && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-surface-200 py-2 z-10">
                          <button onClick={() => handleExport('csv', recentBookings, 'booking-terbaru')} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-surface-50">
                            Export CSV
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-surface-200 bg-surface-50">
                          <th className="p-4 text-xs font-semibold text-slate-500">Nama</th>
                          <th className="p-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">Layanan</th>
                          <th className="p-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">Dokter</th>
                          <th className="p-4 text-xs font-semibold text-slate-500">Tanggal</th>
                          <th className="p-4 text-xs font-semibold text-slate-500">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((booking) => (
                          <tr key={booking.id} className="border-b border-surface-100 hover:bg-surface-50">
                            <td className="p-4">
                              <div className="font-medium text-slate-800">{booking.nama}</div>
                              <div className="text-xs text-slate-400 sm:hidden">{booking.layanan}</div>
                            </td>
                            <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{booking.layanan}</td>
                            <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{booking.dokter}</td>
                            <td className="p-4 text-sm text-slate-600">
                              <div>{booking.tanggal}</div>
                              <div className="text-xs text-slate-400">{booking.waktu}</div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="card overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 border-b border-surface-100">
                  <h2 className="font-display text-lg font-bold text-slate-800">Semua Booking</h2>
                  <button onClick={() => handleExport('csv', recentBookings, 'semua-booking')} className="btn-outline text-xs px-4 py-2 flex items-center gap-2">
                    <Download size={14} />
                    Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-surface-200 bg-surface-50">
                        <th className="p-4 text-xs font-semibold text-slate-500">Nama</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">Layanan</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">Dokter</th>
                        <th className="p-4 text-xs font-semibold text-slate-500">Tanggal</th>
                        <th className="p-4 text-xs font-semibold text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-surface-100 hover:bg-surface-50">
                          <td className="p-4 font-medium text-slate-800">{booking.nama}</td>
                          <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{booking.layanan}</td>
                          <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{booking.dokter}</td>
                          <td className="p-4 text-sm text-slate-600">{booking.tanggal}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Patients Tab */}
            {activeTab === 'patients' && (
              <div className="card overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 border-b border-surface-100">
                  <h2 className="font-display text-lg font-bold text-slate-800">Data Pasien</h2>
                  <button onClick={() => handleExport('csv', patients, 'data-pasien')} className="btn-outline text-xs px-4 py-2 flex items-center gap-2">
                    <Download size={14} />
                    Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-surface-200 bg-surface-50">
                        <th className="p-4 text-xs font-semibold text-slate-500">Nama</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">WhatsApp</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">Total Kunjungan</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">Terakhir Kunjungan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.id} className="border-b border-surface-100 hover:bg-surface-50">
                          <td className="p-4 font-medium text-slate-800">{patient.nama}</td>
                          <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{patient.whatsapp}</td>
                          <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{patient.totalKunjungan}x</td>
                          <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{patient.terakhirKunjungan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="card">
                <div className="p-4 sm:p-6 border-b border-surface-100">
                  <h2 className="font-display text-lg font-bold text-slate-800">Laporan Lengkap</h2>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 rounded-2xl bg-blue-500 text-white">
                      <Download size={32} className="mb-4" />
                      <h3 className="font-semibold text-lg mb-2">Export ke CSV</h3>
                      <p className="text-blue-100 text-sm mb-4">Unduh semua data dalam format spreadsheet</p>
                      <button
                        onClick={() => handleExport('csv', [...recentBookings], 'laporan-keseluruhan')}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                      >
                        Download CSV
                      </button>
                    </div>
                    <div className="p-6 rounded-2xl bg-green-500 text-white">
                      <Users size={32} className="mb-4" />
                      <h3 className="font-semibold text-lg mb-2">Data Pasien</h3>
                      <p className="text-green-100 text-sm mb-4">Export data pasien saja</p>
                      <button
                        onClick={() => handleExport('csv', patients, 'data-pasien')}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                      >
                        Download CSV
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}