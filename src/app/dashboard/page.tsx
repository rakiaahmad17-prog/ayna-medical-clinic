'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, Users, Calendar, FileText, LogOut, Menu, X, Eye, Clock, TrendingUp, ChevronLeft } from 'lucide-react'
import { dashboardStats, recentBookings, patients } from '@/data/dashboard'

export default function DashboardPage() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const cookies = document.cookie.split(';').reduce((acc, c) => {
      const [k, v] = c.trim().split('=')
      acc[k] = v
      return acc
    }, {} as Record<string, string>)
    if (!cookies['dashboard_auth']) {
      router.push('/dashboard/login')
    }
  }, [router])

  const handleLogout = () => {
    document.cookie = 'dashboard_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
    document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
    router.push('/dashboard/login')
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed inset-y-0 left-0 bg-slate-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center gap-3 p-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
            <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
          </div>
          {isSidebarOpen && <span className="font-bold text-lg">AYNA Admin</span>}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'overview' ? 'bg-teal-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <LayoutDashboard size={20} />
            {isSidebarOpen && <span>Dashboard</span>}
          </button>
          <button onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'bookings' ? 'bg-teal-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Calendar size={20} />
            {isSidebarOpen && <span>Booking</span>}
          </button>
          <button onClick={() => setActiveTab('patients')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'patients' ? 'bg-teal-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Users size={20} />
            {isSidebarOpen && <span>Pasien</span>}
          </button>
          <button onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'reports' ? 'bg-teal-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <FileText size={20} />
            {isSidebarOpen && <span>Laporan</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-1">
          <Link href="/beranda" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-sm">
            <Eye size={18} />
            {isSidebarOpen && <span>Lihat Website</span>}
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm">
            <LogOut size={18} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-slate-900 text-white">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <Link href="/beranda" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
                  <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
                </div>
                <span className="font-bold">AYNA Admin</span>
              </Link>
              <button onClick={() => setIsMobileOpen(false)} className="p-2 rounded-lg hover:bg-slate-800">
                <X size={20} />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              <button onClick={() => { setActiveTab('overview'); setIsMobileOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'overview' ? 'bg-teal-500 text-white' : 'text-slate-400' }`}>
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </button>
              <button onClick={() => { setActiveTab('bookings'); setIsMobileOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'bookings' ? 'bg-teal-500 text-white' : 'text-slate-400' }`}>
                <Calendar size={20} />
                <span>Booking</span>
              </button>
              <button onClick={() => { setActiveTab('patients'); setIsMobileOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'patients' ? 'bg-teal-500 text-white' : 'text-slate-400' }`}>
                <Users size={20} />
                <span>Pasien</span>
              </button>
              <button onClick={() => { setActiveTab('reports'); setIsMobileOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === 'reports' ? 'bg-teal-500 text-white' : 'text-slate-400' }`}>
                <FileText size={20} />
                <span>Laporan</span>
              </button>
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 transition-colors text-sm">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-1 min-h-screen transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
              >
                <Menu size={24} className="text-slate-600" />
              </button>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden lg:flex p-2 rounded-lg hover:bg-slate-100"
              >
                {isSidebarOpen ? (
                  <ChevronLeft size={20} className="text-slate-600" />
                ) : (
                  <ChevronLeft size={20} className="text-slate-600" style={{ transform: 'rotate(180deg)' }} />
                )}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold text-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 lg:p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Selamat Datang, Admin!</h1>
                <p className="text-slate-500 mt-1">Ringkasan aktivitas klinik</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center mb-4">
                    <Calendar size={20} className="text-white" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-slate-800">{dashboardStats.totalBooking}</div>
                  <div className="text-sm text-slate-500 mt-1">Total Booking</div>
                </div>
                <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center mb-4">
                    <Clock size={20} className="text-white" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-slate-800">{dashboardStats.bookingPending}</div>
                  <div className="text-sm text-slate-500 mt-1">Pending</div>
                </div>
                <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center mb-4">
                    <Users size={20} className="text-white" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-slate-800">{dashboardStats.totalPasien}</div>
                  <div className="text-sm text-slate-500 mt-1">Total Pasien</div>
                </div>
                <div className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center mb-4">
                    <TrendingUp size={20} className="text-white" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-slate-800">+12%</div>
                  <div className="text-sm text-slate-500 mt-1">Growth</div>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 lg:p-6 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800">Booking Terbaru</h2>
                  <Link href="/dashboard" onClick={() => setActiveTab('bookings')} className="text-sm text-teal-600 hover:text-teal-700">
                    Lihat Semua →
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-slate-100 bg-slate-50">
                        <th className="p-4 text-xs font-semibold text-slate-500">Nama</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">Layanan</th>
                        <th className="p-4 text-xs font-semibold text-slate-500">Tanggal</th>
                        <th className="p-4 text-xs font-semibold text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-4 font-medium text-slate-800">{booking.nama}</td>
                          <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{booking.layanan}</td>
                          <td className="p-4 text-sm text-slate-600">{booking.tanggal}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                              booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
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
            <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4 lg:p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Semua Booking</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-slate-100 bg-slate-50">
                      <th className="p-4 text-xs font-semibold text-slate-500">Nama</th>
                      <th className="p-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">Layanan</th>
                      <th className="p-4 text-xs font-semibold text-slate-500">Tanggal</th>
                      <th className="p-4 text-xs font-semibold text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-4 font-medium text-slate-800">{booking.nama}</td>
                        <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{booking.layanan}</td>
                        <td className="p-4 text-sm text-slate-600">{booking.tanggal}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                            booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
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
            <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4 lg:p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Data Pasien</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-slate-100 bg-slate-50">
                      <th className="p-4 text-xs font-semibold text-slate-500">Nama</th>
                      <th className="p-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">WhatsApp</th>
                      <th className="p-4 text-xs font-semibold text-slate-500 hidden sm:table-cell">Kunjungan</th>
                      <th className="p-4 text-xs font-semibold text-slate-500">Terakhir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-4 font-medium text-slate-800">{patient.nama}</td>
                        <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{patient.whatsapp}</td>
                        <td className="p-4 text-sm text-slate-600 hidden sm:table-cell">{patient.totalKunjungan}x</td>
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
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Laporan</h2>
              <p className="text-sm text-slate-500 mb-4">Export data dalam format spreadsheet</p>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium">
                Download CSV
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}