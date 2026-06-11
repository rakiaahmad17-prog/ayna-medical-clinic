'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard, Users, Calendar, FileText,
  LogOut, Menu, X, ChevronDown, Download,
  FileSpreadsheet, FileText as FilePdf, Search,
  Eye, CheckCircle, XCircle, Clock, TrendingUp,
  Plus, Filter, MoreVertical
} from 'lucide-react'
import { dashboardStats, recentBookings, patients, Booking, Patient } from '@/data/dashboard'

// Simple export functions
function exportToExcel(data: any[], filename: string) {
  // Convert to CSV format
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
  // Create HTML table for PDF
  const headers = Object.keys(data[0])
  const tableHtml = `
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#14b8a6;color:white;">
          ${headers.map(h => `<th style="padding:10px;border:1px solid #ddd;">${h}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${data.map(row => `
          <tr>
            ${headers.map(h => `<td style="padding:8px;border:1px solid #ddd;">${row[h]}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${filename}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #14b8a6; }
        table { margin-top: 20px; }
      </style>
    </head>
    <body>
      <h1>Klinik AYNA Medical Clinic - ${filename}</h1>
      <p>Tanggal Export: ${new Date().toLocaleDateString('id-ID')}</p>
      ${tableHtml}
    </body>
    </html>
  `

  const blob = new Blob([html], { type: 'text/html' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.html`
  link.click()
}

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [showExportMenu, setShowExportMenu] = useState(false)

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

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center overflow-hidden">
              <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <span className="font-display font-bold">AYNA</span>
              <span className="block text-[9px] text-primary-400">Admin Panel</span>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Dashboard', active: true },
            { id: 'bookings', icon: Calendar, label: 'Booking' },
            { id: 'patients', icon: Users, label: 'Pasien' },
            { id: 'reports', icon: FileText, label: 'Laporan' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === item.id
                  ? 'bg-primary-500 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <Link href="/beranda" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <LogOut size={18} />
            Kembali ke Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {/* Header */}
        <header className="bg-white shadow-soft sticky top-0 z-20">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-surface-100">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari..."
                  className="pl-10 pr-4 py-2 rounded-xl border border-surface-200 w-64 focus:border-primary-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm">
                  A
                </div>
                <span className="hidden sm:inline text-sm font-medium">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Booking', value: dashboardStats.totalBooking, icon: Calendar, color: 'bg-blue-500' },
                  { label: 'Booking Pending', value: dashboardStats.bookingPending, icon: Clock, color: 'bg-yellow-500' },
                  { label: 'Total Pasien', value: dashboardStats.totalPasien, icon: Users, color: 'bg-green-500' },
                  { label: 'Growth', value: '+12%', icon: TrendingUp, color: 'bg-purple-500' },
                ].map((stat, i) => (
                  <div key={i} className="card">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <stat.icon size={20} className="text-white" />
                      </div>
                    </div>
                    <div className="font-display text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Bookings */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-bold text-slate-800">Booking Terbaru</h2>
                  <div className="relative">
                    <button
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="btn-outline text-sm px-4 py-2 flex items-center gap-2"
                    >
                      <Download size={16} />
                      Export
                      <ChevronDown size={14} />
                    </button>
                    {showExportMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card border border-surface-200 py-2 z-10">
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
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-surface-200">
                        <th className="pb-3 text-sm font-semibold text-slate-500">Nama</th>
                        <th className="pb-3 text-sm font-semibold text-slate-500">Layanan</th>
                        <th className="pb-3 text-sm font-semibold text-slate-500">Dokter</th>
                        <th className="pb-3 text-sm font-semibold text-slate-500">Tanggal</th>
                        <th className="pb-3 text-sm font-semibold text-slate-500">Status</th>
                        <th className="pb-3 text-sm font-semibold text-slate-500">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-surface-100 last:border-0">
                          <td className="py-4">
                            <div>
                              <div className="font-medium text-slate-800">{booking.nama}</div>
                              <div className="text-xs text-slate-400">{booking.whatsapp}</div>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-slate-600">{booking.layanan}</td>
                          <td className="py-4 text-sm text-slate-600">{booking.dokter}</td>
                          <td className="py-4 text-sm text-slate-600">
                            <div>{booking.tanggal}</div>
                            <div className="text-xs text-slate-400">{booking.waktu}</div>
                          </td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
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
            </>
          )}

          {activeTab === 'bookings' && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-slate-800">Semua Booking</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExport('excel', recentBookings, 'semua-booking')}
                    className="btn-outline text-sm px-4 py-2 flex items-center gap-2"
                  >
                    <FileSpreadsheet size={16} />
                    Excel
                  </button>
                  <button
                    onClick={() => handleExport('pdf', recentBookings, 'semua-booking')}
                    className="btn-outline text-sm px-4 py-2 flex items-center gap-2"
                  >
                    <FilePdf size={16} />
                    PDF
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-surface-200">
                      <th className="pb-3 text-sm font-semibold text-slate-500">ID</th>
                      <th className="pb-3 text-sm font-semibold text-slate-500">Nama</th>
                      <th className="pb-3 text-sm font-semibold text-slate-500">WhatsApp</th>
                      <th className="pb-3 text-sm font-semibold text-slate-500">Layanan</th>
                      <th className="pb-3 text-sm font-semibold text-slate-500">Dokter</th>
                      <th className="pb-3 text-sm font-semibold text-slate-500">Tanggal</th>
                      <th className="pb-3 text-sm font-semibold text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-surface-100 last:border-0">
                        <td className="py-4 text-sm text-slate-400">#{booking.id}</td>
                        <td className="py-4 font-medium text-slate-800">{booking.nama}</td>
                        <td className="py-4 text-sm text-slate-600">{booking.whatsapp}</td>
                        <td className="py-4 text-sm text-slate-600">{booking.layanan}</td>
                        <td className="py-4 text-sm text-slate-600">{booking.dokter}</td>
                        <td className="py-4 text-sm text-slate-600">{booking.tanggal}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
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

          {activeTab === 'patients' && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-slate-800">Data Pasien</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExport('excel', patients, 'data-pasien')}
                    className="btn-outline text-sm px-4 py-2 flex items-center gap-2"
                  >
                    <FileSpreadsheet size={16} />
                    Excel
                  </button>
                  <button
                    onClick={() => handleExport('pdf', patients, 'data-pasien')}
                    className="btn-outline text-sm px-4 py-2 flex items-center gap-2"
                  >
                    <FilePdf size={16} />
                    PDF
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-surface-200">
                      <th className="pb-3 text-sm font-semibold text-slate-500">Nama</th>
                      <th className="pb-3 text-sm font-semibold text-slate-500">WhatsApp</th>
                      <th className="pb-3 text-sm font-semibold text-slate-500">Total Kunjungan</th>
                      <th className="pb-3 text-sm font-semibold text-slate-500">Terakhir Kunjungan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.id} className="border-b border-surface-100 last:border-0">
                        <td className="py-4 font-medium text-slate-800">{patient.nama}</td>
                        <td className="py-4 text-sm text-slate-600">{patient.whatsapp}</td>
                        <td className="py-4 text-sm text-slate-600">{patient.totalKunjungan}x</td>
                        <td className="py-4 text-sm text-slate-600">{patient.terakhirKunjungan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-slate-800">Laporan</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExport('excel', [...recentBookings, ...patients.map(p => ({...p, booking: recentBookings.find(b => b.whatsapp === p.whatsapp)?.layanan || '-'}))], 'laporan-keseluruhan')}
                    className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
                  >
                    <FileSpreadsheet size={16} />
                    Export Semua (Excel)
                  </button>
                </div>
              </div>
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-surface-300 mx-auto mb-4" />
                <p className="text-slate-500">Gunakan tombol Export di atas untuk mengunduh laporan.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}