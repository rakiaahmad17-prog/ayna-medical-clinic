'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard, Users, Calendar, FileText,
  LogOut, Menu, X, ChevronDown, Download,
  FileSpreadsheet, FileText as FilePdf, Search,
  Eye, CheckCircle, XCircle, Clock, TrendingUp,
  User, Settings, ChevronLeft, ChevronRight, Bell
} from 'lucide-react'
import { dashboardStats, recentBookings, patients, Booking, Patient } from '@/data/dashboard'

// Export functions
function exportToExcel(data: any[], filename: string) {
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => `"${row[h]}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  link.click()
}

function exportToPDF(data: any[], filename: string) {
  const headers = Object.keys(data[0])
  const tableHtml = `
    <table style="width:100%;border-collapse:collapse;font-size:12px;">
      <thead>
        <tr style="background:#14b8a6;color:white;">
          ${headers.map(h => `<th style="padding:8px;border:1px solid #ddd;">${h}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${data.map(row => `
          <tr>
            ${headers.map(h => `<td style="padding:6px;border:1px solid #ddd;">${row[h]}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `

  const html = `<!DOCTYPE html><html><head><title>${filename}</title><style>body{font-family:Arial,sans-serif;padding:20px;}h1{color:#14b8a6;}table{margin-top:20px;}</style></head><body><h1>Klinik AYNA Medical Clinic - ${filename}</h1><p>Tanggal: ${new Date().toLocaleDateString('id-ID')}</p>${tableHtml}</body></html>`

  const blob = new Blob([html], { type: 'text/html' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.html`
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

  const handleExport = (type: 'excel' | 'pdf', data: any[], filename: string) => {
    if (type === 'excel') {
      exportToExcel(data, filename)
    } else {
      exportToPDF(data, filename)
    }
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
    <div className="min-h-screen bg-surface-50 flex">
      {/* Sidebar - Desktop */}
      <aside className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <Link href="/beranda" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center overflow-hidden">
                <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
              </div>
              <div>
                <span className="font-display font-bold text-white">AYNA</span>
                <span className="block text-[9px] text-primary-400">Admin Panel</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                activeTab === item.id
                  ? 'bg-primary-500 text-white shadow-card'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          <Link href="/beranda" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm">
            <Eye size={18} />
            <span>Lihat Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      <aside className={`lg:hidden fixed inset-0 z-40 ${isMobileSidebarOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMobileSidebarOpen(false)}
        />
        <div className={`absolute inset-y-0 left-0 w-72 bg-slate-900 text-white transform transition-transform duration-300 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center overflow-hidden">
                <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
              </div>
              <span className="font-display font-bold">AYNA Admin</span>
            </div>
            <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 rounded-lg hover:bg-slate-800">
              <X size={20} />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
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
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 min-h-screen transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Header */}
        <header className="bg-white shadow-soft sticky top-0 z-20">
          <div className="flex items-center justify-between p-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-100"
            >
              <Menu size={24} className="text-slate-600" />
            </button>

            {/* Desktop toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex p-2 rounded-lg hover:bg-surface-100"
            >
              {isSidebarOpen ? <ChevronLeft size={20} className="text-slate-600" /> : <ChevronRight size={20} className="text-slate-600" />}
            </button>

            {/* Search */}
            <div className="hidden sm:block flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-surface-200 focus:border-primary-400 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-surface-100 sm:hidden">
                <Search size={20} className="text-slate-600" />
              </button>
              <button className="relative p-2 rounded-lg hover:bg-surface-100">
                <Bell size={20} className="text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome */}
              <div className="hidden sm:block">
                <h1 className="font-display text-2xl font-bold text-slate-800">Selamat Datang, Admin!</h1>
                <p className="text-slate-500 mt-1">Berikut ringkasan aktivitas Klinik AYNA Medical Clinic</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Booking', value: dashboardStats.totalBooking, icon: Calendar, color: 'bg-blue-500' },
                  { label: 'Pending', value: dashboardStats.bookingPending, icon: Clock, color: 'bg-yellow-500' },
                  { label: 'Total Pasien', value: dashboardStats.totalPasien, icon: Users, color: 'bg-green-500' },
                  { label: 'Growth', value: '+12%', icon: TrendingUp, color: 'bg-purple-500' },
                ].map((stat, i) => (
                  <div key={i} className="card p-4 sm:p-6">
                    <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                      <stat.icon size={20} className="text-white" />
                    </div>
                    <div className="font-display text-2xl sm:text-3xl font-bold text-slate-800">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-slate-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Bookings */}
              <div className="card overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 border-b border-surface-100">
                  <h2 className="font-display text-lg sm:text-xl font-bold text-slate-800">Booking Terbaru</h2>
                  <div className="relative">
                    <button
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="btn-outline text-xs sm:text-sm px-4 py-2 flex items-center gap-2"
                    >
                      <Download size={14} />
                      Export
                      <ChevronDown size={14} />
                    </button>
                    {showExportMenu && (
                      <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-card border border-surface-200 py-2 z-10">
                        <button
                          onClick={() => handleExport('excel', recentBookings, 'booking-terbaru')}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-surface-50"
                        >
                          <FileSpreadsheet size={16} className="text-green-600" />
                          Export Excel
                        </button>
                        <button
                          onClick={() => handleExport('pdf', recentBookings, 'booking-terbaru')}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-surface-50"
                        >
                          <FilePdf size={16} className="text-red-600" />
                          Export PDF
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="hidden sm:table-header-group">
                      <tr className="text-left border-b border-surface-200">
                        <th className="p-4 text-xs font-semibold text-slate-500">Nama</th>
                        <th className="p-4 text-xs font-semibold text-slate-500">Layanan</th>
                        <th className="p-4 text-xs font-semibold text-slate-500">Dokter</th>
                        <th className="p-4 text-xs font-semibold text-slate-500">Tanggal</th>
                        <th className="p-4 text-xs font-semibold text-slate-500">Status</th>
                        <th className="p-4 text-xs font-semibold text-slate-500">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-surface-100 hover:bg-surface-50">
                          <td className="p-4">
                            <div className="font-medium text-slate-800">{booking.nama}</div>
                            <div className="text-xs text-slate-400 sm:hidden">{booking.whatsapp}</div>
                          </td>
                          <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{booking.layanan}</td>
                          <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{booking.dokter}</td>
                          <td className="p-4">
                            <div className="text-sm text-slate-600">{booking.tanggal}</div>
                            <div className="text-xs text-slate-400">{booking.waktu}</div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <button className="p-2 rounded-lg hover:bg-surface-100 text-slate-400 hover:text-primary-600">
                                <Eye size={16} />
                              </button>
                              {booking.status === 'pending' && (
                                <>
                                  <button className="p-2 rounded-lg hover:bg-green-50 text-slate-400 hover:text-green-600">
                                    <CheckCircle size={16} />
                                  </button>
                                  <button className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600">
                                    <XCircle size={16} />
                                  </button>
                                </>
                              )}
                            </div>
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
                <h2 className="font-display text-lg sm:text-xl font-bold text-slate-800">Semua Booking</h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleExport('excel', recentBookings, 'semua-booking')} className="btn-outline text-xs sm:text-sm px-4 py-2 flex items-center gap-2">
                    <FileSpreadsheet size={14} />
                    Excel
                  </button>
                  <button onClick={() => handleExport('pdf', recentBookings, 'semua-booking')} className="btn-outline text-xs sm:text-sm px-4 py-2 flex items-center gap-2">
                    <FilePdf size={14} />
                    PDF
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="hidden sm:table-header-group">
                    <tr className="text-left border-b border-surface-200">
                      <th className="p-4 text-xs font-semibold text-slate-500">ID</th>
                      <th className="p-4 text-xs font-semibold text-slate-500">Nama</th>
                      <th className="p-4 text-xs font-semibold text-slate-500">WhatsApp</th>
                      <th className="p-4 text-xs font-semibold text-slate-500">Layanan</th>
                      <th className="p-4 text-xs font-semibold text-slate-500">Dokter</th>
                      <th className="p-4 text-xs font-semibold text-slate-500">Tanggal</th>
                      <th className="p-4 text-xs font-semibold text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-surface-100 hover:bg-surface-50">
                        <td className="p-4 text-xs text-slate-400">#{booking.id}</td>
                        <td className="p-4 font-medium text-slate-800">{booking.nama}</td>
                        <td className="p-4 text-sm text-slate-600">{booking.whatsapp}</td>
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
                <h2 className="font-display text-lg sm:text-xl font-bold text-slate-800">Data Pasien</h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleExport('excel', patients, 'data-pasien')} className="btn-outline text-xs sm:text-sm px-4 py-2 flex items-center gap-2">
                    <FileSpreadsheet size={14} />
                    Excel
                  </button>
                  <button onClick={() => handleExport('pdf', patients, 'data-pasien')} className="btn-outline text-xs sm:text-sm px-4 py-2 flex items-center gap-2">
                    <FilePdf size={14} />
                    PDF
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead className="hidden sm:table-header-group">
                    <tr className="text-left border-b border-surface-200">
                      <th className="p-4 text-xs font-semibold text-slate-500">Nama</th>
                      <th className="p-4 text-xs font-semibold text-slate-500">WhatsApp</th>
                      <th className="p-4 text-xs font-semibold text-slate-500">Total Kunjungan</th>
                      <th className="p-4 text-xs font-semibold text-slate-500">Terakhir Kunjungan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.id} className="border-b border-surface-100 hover:bg-surface-50">
                        <td className="p-4 font-medium text-slate-800">{patient.nama}</td>
                        <td className="p-4 text-sm text-slate-600">{patient.whatsapp}</td>
                        <td className="p-4 text-sm text-slate-600">{patient.totalKunjungan}x</td>
                        <td className="p-4 text-sm text-slate-600">{patient.terakhirKunjungan}</td>
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
                <h2 className="font-display text-lg sm:text-xl font-bold text-slate-800">Laporan Lengkap</h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <FileSpreadsheet size={32} className="mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Export ke Excel</h3>
                    <p className="text-blue-100 text-sm mb-4">Unduh semua data dalam format spreadsheet</p>
                    <button
                      onClick={() => handleExport('excel', [...recentBookings, ...patients.map(p => ({...p, layanan: recentBookings.find(b => b.whatsapp === p.whatsapp)?.layanan || '-'}))], 'laporan-keseluruhan')}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                    >
                      Download Excel
                    </button>
                  </div>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white">
                    <FilePdf size={32} className="mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Export ke PDF</h3>
                    <p className="text-red-100 text-sm mb-4">Unduh semua data dalam format laporan</p>
                    <button
                      onClick={() => handleExport('pdf', [...recentBookings, ...patients.map(p => ({...p, layanan: recentBookings.find(b => b.whatsapp === p.whatsapp)?.layanan || '-'}))], 'laporan-keseluruhan')}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}