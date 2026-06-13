// Ayna Clinic Dashboard - Enhanced Data Layer v4.0
// Complete PDF/CSV Reports, Statistics, localStorage Management

'use client'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Booking {
  id: string
  nama: string
  whatsapp: string
  email?: string
  layanan: string
  dokter: string
  tanggal: string
  waktu: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
  catatan?: string
}

export interface Patient {
  id: string
  nama: string
  whatsapp: string
  email?: string
  totalKunjungan: number
  terakhirKunjungan: string
  layanan: string[]
}

export interface DashboardStats {
  totalBooking: number
  bookingPending: number
  bookingConfirmed: number
  bookingCompleted: number
  bookingCancelled: number
  totalPasien: number
  pertumbuhan: number
  bookingPerBulan: { bulan: string; jumlah: number }[]
  layananPopuler: { nama: string; jumlah: number }[]
  dokterPopuler: { nama: string; jumlah: number }[]
}

// ============================================
// EMPTY STATE DATA
// ============================================

export const emptyBookings: Booking[] = []
export const emptyPatients: Patient[] = []

export const emptyStats: DashboardStats = {
  totalBooking: 0,
  bookingPending: 0,
  bookingConfirmed: 0,
  bookingCompleted: 0,
  bookingCancelled: 0,
  totalPasien: 0,
  pertumbuhan: 0,
  bookingPerBulan: [],
  layananPopuler: [],
  dokterPopuler: []
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function formatDate(dateString: string): string {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatDateForFilename(dateString: string): string {
  if (!dateString) return new Date().toISOString().split('T')[0]
  return new Date(dateString).toISOString().split('T')[0]
}

export function getStatusColor(status: Booking['status']): string {
  const colors = {
    pending: 'bg-amber-100 text-amber-700 border border-amber-200',
    confirmed: 'bg-blue-100 text-blue-700 border border-blue-200',
    completed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    cancelled: 'bg-red-100 text-red-700 border border-red-200'
  }
  return colors[status] || colors.pending
}

export function getStatusLabel(status: Booking['status']): string {
  const labels = {
    pending: 'Menunggu',
    confirmed: 'Dikonfirmasi',
    completed: 'Selesai',
    cancelled: 'Dibatalkan'
  }
  return labels[status] || status
}

// ============================================
// CSV EXPORT FUNCTIONS
// ============================================

function escapeCSV(value: string | number | undefined): string {
  if (value === undefined || value === null) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function generateBookingCSV(bookings: Booking[]): string {
  const headers = ['ID', 'Nama', 'WhatsApp', 'Email', 'Layanan', 'Dokter', 'Tanggal', 'Waktu', 'Status', 'Catatan', 'Tanggal Dibuat']
  if (bookings.length === 0) {
    return [headers.join(','), headers.map(() => '').join(',')].join('\n')
  }
  const rows = bookings.map(b => [
    b.id, b.nama, b.whatsapp, b.email || '', b.layanan, b.dokter,
    b.tanggal, b.waktu, getStatusLabel(b.status), b.catatan || '', b.createdAt
  ])
  return [headers.join(','), ...rows.map(r => r.map(cell => escapeCSV(cell)).join(','))].join('\n')
}

export function generatePatientCSV(patients: Patient[]): string {
  const headers = ['ID', 'Nama', 'WhatsApp', 'Email', 'Total Kunjungan', 'Terakhir Kunjungan', 'Layanan']
  if (patients.length === 0) {
    return [headers.join(','), headers.map(() => '').join(',')].join('\n')
  }
  const rows = patients.map(p => [
    p.id, p.nama, p.whatsapp, p.email || '', p.totalKunjungan, p.terakhirKunjungan, p.layanan.join('; ')
  ])
  return [headers.join(','), ...rows.map(r => r.map(cell => escapeCSV(cell)).join(','))].join('\n')
}

export function generateStatsCSV(stats: DashboardStats): string {
  const headers = ['Metrik', 'Nilai']
  const rows = [
    ['Total Booking', stats.totalBooking.toString()],
    ['Booking Pending', stats.bookingPending.toString()],
    ['Booking Dikonfirmasi', stats.bookingConfirmed.toString()],
    ['Booking Selesai', stats.bookingCompleted.toString()],
    ['Booking Dibatalkan', stats.bookingCancelled.toString()],
    ['Total Pasien', stats.totalPasien.toString()],
    ['Pertumbuhan (%)', stats.pertumbuhan.toString()]
  ]
  return [headers.join(','), ...rows.map(r => r.map(cell => escapeCSV(cell)).join(','))].join('\n')
}

export function generateFullReportCSV(stats: DashboardStats, bookings: Booking[], patients: Patient[]): string {
  const sections: string[] = []
  sections.push('LAPORAN LENGKAP KLINIK AYNA MEDICAL CLINIC')
  sections.push(`Dicetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`)
  sections.push('')
  sections.push('STATISTIK')
  sections.push('Metrik,Nilai')
  sections.push(`Total Booking,${stats.totalBooking}`)
  sections.push(`Booking Pending,${stats.bookingPending}`)
  sections.push(`Booking Dikonfirmasi,${stats.bookingConfirmed}`)
  sections.push(`Booking Selesai,${stats.bookingCompleted}`)
  sections.push(`Booking Dibatalkan,${stats.bookingCancelled}`)
  sections.push(`Total Pasien,${stats.totalPasien}`)
  sections.push(`Pertumbuhan,${stats.pertumbuhan}%`)
  sections.push('')
  sections.push('TREN BULANAN')
  sections.push('Bulan,Jumlah')
  stats.bookingPerBulan.forEach(b => sections.push(`${b.bulan},${b.jumlah}`))
  sections.push('')
  sections.push('LAYANAN POPULER')
  sections.push('Layanan,Jumlah')
  stats.layananPopuler.forEach(l => sections.push(`${l.nama},${l.jumlah}`))
  sections.push('')
  sections.push('DOKTER POPULER')
  sections.push('Dokter,Jumlah')
  stats.dokterPopuler.forEach(d => sections.push(`${d.nama},${d.jumlah}`))
  sections.push('')
  sections.push('DATA BOOKING')
  sections.push(generateBookingCSV(bookings))
  sections.push('')
  sections.push('DATA PASIEN')
  sections.push(generatePatientCSV(patients))
  return sections.join('\n')
}

// ============================================
// PDF EXPORT FUNCTIONS
// ============================================

export function generateBookingPDF(bookings: Booking[]): void {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  // Header
  doc.setFillColor(20, 184, 166)
  doc.rect(0, 0, pageWidth, 45, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('LAPORAN BOOKING', pageWidth / 2, 22, { align: 'center' })
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('AYNA Medical Clinic', pageWidth / 2, 34, { align: 'center' })

  // Date
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(10)
  doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')}`, pageWidth / 2, 55, { align: 'center' })

  // Summary
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`Total Booking: ${bookings.length}`, 14, 68)

  // Table
  if (bookings.length > 0) {
    autoTable(doc, {
      head: [['Nama', 'Layanan', 'Dokter', 'Tanggal', 'Waktu', 'Status']],
      body: bookings.map(b => [b.nama, b.layanan, b.dokter, b.tanggal, b.waktu, getStatusLabel(b.status)]),
      startY: 75,
      theme: 'striped',
      headStyles: { fillColor: [20, 184, 166], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
      alternateRowStyles: { fillColor: [245, 250, 250] }
    })
  } else {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Tidak ada data booking', 14, 75)
  }

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(`Halaman ${i} dari ${pageCount} - AYNA Medical Clinic`, pageWidth / 2, 285, { align: 'center' })
  }

  doc.save(`laporan-booking-${formatDateForFilename(new Date().toISOString())}.pdf`)
}

export function generatePatientPDF(patients: Patient[]): void {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  // Header
  doc.setFillColor(5, 150, 105)
  doc.rect(0, 0, pageWidth, 45, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('LAPORAN PASIEN', pageWidth / 2, 22, { align: 'center' })
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('AYNA Medical Clinic', pageWidth / 2, 34, { align: 'center' })

  // Date
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(10)
  doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')}`, pageWidth / 2, 55, { align: 'center' })

  // Summary
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`Total Pasien: ${patients.length}`, 14, 68)

  // Table
  if (patients.length > 0) {
    autoTable(doc, {
      head: [['Nama', 'WhatsApp', 'Kunjungan', 'Terakhir', 'Layanan']],
      body: patients.map(p => [p.nama, p.whatsapp, p.totalKunjungan.toString(), p.terakhirKunjungan, p.layanan.join(', ')]),
      startY: 75,
      theme: 'striped',
      headStyles: { fillColor: [5, 150, 105], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: { 4: { cellWidth: 50 } }
    })
  } else {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Tidak ada data pasien', 14, 75)
  }

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(`Halaman ${i} dari ${pageCount} - AYNA Medical Clinic`, pageWidth / 2, 285, { align: 'center' })
  }

  doc.save(`laporan-pasien-${formatDateForFilename(new Date().toISOString())}.pdf`)
}

export function generateStatsPDF(stats: DashboardStats): void {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  // Header
  doc.setFillColor(139, 92, 246)
  doc.rect(0, 0, pageWidth, 45, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('LAPORAN STATISTIK', pageWidth / 2, 22, { align: 'center' })
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('AYNA Medical Clinic', pageWidth / 2, 34, { align: 'center' })

  // Date
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(10)
  doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')}`, pageWidth / 2, 55, { align: 'center' })

  // Stats Cards
  let yPos = 70

  // Card 1
  doc.setFillColor(240, 253, 250)
  doc.roundedRect(14, yPos, 55, 35, 3, 3, 'F')
  doc.setTextColor(20, 184, 166)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text(stats.totalBooking.toString(), 41.5, yPos + 18, { align: 'center' })
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Total Booking', 41.5, yPos + 28, { align: 'center' })

  // Card 2
  doc.setFillColor(254, 243, 199)
  doc.roundedRect(77, yPos, 55, 35, 3, 3, 'F')
  doc.setTextColor(245, 158, 11)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text(stats.bookingPending.toString(), 104.5, yPos + 18, { align: 'center' })
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(9)
  doc.text('Pending', 104.5, yPos + 28, { align: 'center' })

  // Card 3
  doc.setFillColor(240, 253, 244)
  doc.roundedRect(140, yPos, 55, 35, 3, 3, 'F')
  doc.setTextColor(5, 150, 105)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text(stats.totalPasien.toString(), 167.5, yPos + 18, { align: 'center' })
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(9)
  doc.text('Total Pasien', 167.5, yPos + 28, { align: 'center' })

  // Card 4
  doc.setFillColor(245, 243, 255)
  doc.roundedRect(14, yPos + 45, 55, 35, 3, 3, 'F')
  doc.setTextColor(139, 92, 246)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text(`+${stats.pertumbuhan}%`, 41.5, yPos + 63, { align: 'center' })
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(9)
  doc.text('Pertumbuhan', 41.5, yPos + 73, { align: 'center' })

  // Monthly Trends
  yPos = 160
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('TREN BOOKING BULANAN', 14, yPos)

  yPos += 10

  if (stats.bookingPerBulan.length > 0) {
    autoTable(doc, {
      head: [['Bulan', 'Jumlah Booking']],
      body: stats.bookingPerBulan.map(b => [b.bulan, b.jumlah.toString()]),
      startY: yPos,
      theme: 'striped',
      headStyles: { fillColor: [20, 184, 166], textColor: 255 },
      styles: { fontSize: 10 },
      columnStyles: { 1: { halign: 'center' } }
    })
  } else {
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(11)
    doc.text('Tidak ada data tren booking', 14, yPos + 10)
  }

  // Popular Services
  yPos = (doc as any).lastAutoTable?.finalY + 15 || 200

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('LAYANAN POPULER', 14, yPos)

  yPos += 10

  if (stats.layananPopuler.length > 0) {
    autoTable(doc, {
      head: [['Layanan', 'Jumlah']],
      body: stats.layananPopuler.map(l => [l.nama, l.jumlah.toString()]),
      startY: yPos,
      theme: 'striped',
      headStyles: { fillColor: [5, 150, 105], textColor: 255 },
      styles: { fontSize: 10 },
      columnStyles: { 1: { halign: 'center' } }
    })
  } else {
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(11)
    doc.text('Tidak ada data layanan', 14, yPos + 10)
  }

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(`Halaman ${i} dari ${pageCount} - AYNA Medical Clinic`, pageWidth / 2, 285, { align: 'center' })
  }

  doc.save(`laporan-statistik-${formatDateForFilename(new Date().toISOString())}.pdf`)
}

export function generateFullReportPDF(stats: DashboardStats, bookings: Booking[], patients: Patient[]): void {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  // Page 1: Cover & Statistics
  doc.setFillColor(20, 184, 166)
  doc.rect(0, 0, pageWidth, 50, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('LAPORAN LENGKAP', pageWidth / 2, 22, { align: 'center' })
  doc.setFontSize(16)
  doc.text('AYNA Medical Clinic', pageWidth / 2, 35, { align: 'center' })
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth / 2, 45, { align: 'center' })

  // Stats Cards
  let yPos = 65

  // Card 1
  doc.setFillColor(240, 253, 250)
  doc.roundedRect(14, yPos, 45, 30, 3, 3, 'F')
  doc.setTextColor(20, 184, 166)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(stats.totalBooking.toString(), 36.5, yPos + 13, { align: 'center' })
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Total Booking', 36.5, yPos + 23, { align: 'center' })

  // Card 2
  doc.setFillColor(254, 243, 199)
  doc.roundedRect(66, yPos, 45, 30, 3, 3, 'F')
  doc.setTextColor(245, 158, 11)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(stats.bookingPending.toString(), 88.5, yPos + 13, { align: 'center' })
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(8)
  doc.text('Pending', 88.5, yPos + 23, { align: 'center' })

  // Card 3
  doc.setFillColor(240, 253, 244)
  doc.roundedRect(118, yPos, 45, 30, 3, 3, 'F')
  doc.setTextColor(5, 150, 105)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(stats.totalPasien.toString(), 140.5, yPos + 13, { align: 'center' })
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(8)
  doc.text('Total Pasien', 140.5, yPos + 23, { align: 'center' })

  // Card 4
  doc.setFillColor(245, 243, 255)
  doc.roundedRect(170, yPos, 25, 30, 3, 3, 'F')
  doc.setTextColor(139, 92, 246)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`+${stats.pertumbuhan}%`, 182.5, yPos + 13, { align: 'center' })
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(7)
  doc.text('Growth', 182.5, yPos + 23, { align: 'center' })

  // Page 2: Monthly Trends
  doc.addPage()
  doc.setFillColor(20, 184, 166)
  doc.rect(0, 0, pageWidth, 30, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('TREN BOOKING BULANAN', 14, 20)

  yPos = 45

  if (stats.bookingPerBulan.length > 0) {
    autoTable(doc, {
      head: [['Bulan', 'Jumlah Booking']],
      body: stats.bookingPerBulan.map(b => [b.bulan, b.jumlah.toString()]),
      startY: yPos,
      theme: 'striped',
      headStyles: { fillColor: [20, 184, 166], textColor: 255 },
      styles: { fontSize: 10 },
      columnStyles: { 1: { halign: 'center' } }
    })
  } else {
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(11)
    doc.text('Tidak ada data tren booking', 14, yPos + 10)
  }

  // Popular Services
  yPos = (doc as any).lastAutoTable?.finalY + 15 || 120

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('LAYANAN POPULER', 14, yPos)

  yPos += 10

  if (stats.layananPopuler.length > 0) {
    autoTable(doc, {
      head: [['Layanan', 'Jumlah']],
      body: stats.layananPopuler.map(l => [l.nama, l.jumlah.toString()]),
      startY: yPos,
      theme: 'striped',
      headStyles: { fillColor: [5, 150, 105], textColor: 255 },
      styles: { fontSize: 10 },
      columnStyles: { 1: { halign: 'center' } }
    })
  } else {
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(11)
    doc.text('Tidak ada data layanan', 14, yPos + 10)
  }

  // Page 3: Bookings Data
  doc.addPage()
  doc.setFillColor(20, 184, 166)
  doc.rect(0, 0, pageWidth, 30, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('DATA BOOKING', 14, 20)

  if (bookings.length > 0) {
    autoTable(doc, {
      head: [['Nama', 'Layanan', 'Tanggal', 'Status']],
      body: bookings.slice(0, 30).map(b => [b.nama, b.layanan, b.tanggal, getStatusLabel(b.status)]),
      startY: 40,
      theme: 'striped',
      headStyles: { fillColor: [20, 184, 166], textColor: 255 },
      styles: { fontSize: 9 }
    })

    if (bookings.length > 30) {
      const finalY = (doc as any).lastAutoTable?.finalY + 10
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(10)
      doc.text(`... dan ${bookings.length - 30} booking lainnya`, 14, finalY)
    }
  } else {
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(11)
    doc.text('Tidak ada data booking', 14, 50)
  }

  // Page 4: Patients Data
  doc.addPage()
  doc.setFillColor(5, 150, 105)
  doc.rect(0, 0, pageWidth, 30, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('DATA PASIEN', 14, 20)

  if (patients.length > 0) {
    autoTable(doc, {
      head: [['Nama', 'WhatsApp', 'Kunjungan', 'Terakhir']],
      body: patients.map(p => [p.nama, p.whatsapp, p.totalKunjungan.toString(), p.terakhirKunjungan]),
      startY: 40,
      theme: 'striped',
      headStyles: { fillColor: [5, 150, 105], textColor: 255 },
      styles: { fontSize: 9 }
    })
  } else {
    doc.setTextColor(100, 100, 100)
    doc.setFontSize(11)
    doc.text('Tidak ada data pasien', 14, 50)
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(`Halaman ${i} dari ${pageCount} - Generated by AYNA Medical Clinic Dashboard`, pageWidth / 2, 285, { align: 'center' })
  }

  doc.save(`laporan-lengkap-ayna-clinic-${formatDateForFilename(new Date().toISOString())}.pdf`)
}

// ============================================
// DOWNLOAD HELPERS
// ============================================

export function downloadCSV(content: string, filename: string): void {
  if (typeof window === 'undefined') return
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ============================================
// EMPTY STATE MESSAGES
// ============================================

export const emptyStateMessages = {
  bookings: {
    title: 'Belum Ada Booking',
    description: 'Data booking akan muncul di sini setelah pasien melakukan pendaftaran.',
    icon: 'calendar' as const
  },
  patients: {
    title: 'Belum Ada Pasien',
    description: 'Data pasien akan muncul setelah pasien melakukan kunjungan pertama.',
    icon: 'users' as const
  },
  stats: {
    title: 'Tidak Ada Data Statistik',
    description: 'Statistik akan muncul setelah ada data booking dan pasien.',
    icon: 'chart' as const
  }
}

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

export function saveBookingsToStorage(bookings: Booking[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ayna_bookings', JSON.stringify(bookings))
  }
}

export function loadBookingsFromStorage(): Booking[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('ayna_bookings')
    return stored ? JSON.parse(stored) : []
  }
  return []
}

export function savePatientsToStorage(patients: Patient[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ayna_patients', JSON.stringify(patients))
  }
}

export function loadPatientsFromStorage(): Patient[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('ayna_patients')
    return stored ? JSON.parse(stored) : []
  }
  return []
}

export function clearAllData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ayna_bookings')
    localStorage.removeItem('ayna_patients')
  }
}

export function clearBookingsOnly(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ayna_bookings')
  }
}

export function clearPatientsOnly(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ayna_patients')
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// ============================================
// STATISTICS CALCULATOR
// ============================================

export function calculateStats(bookings: Booking[]): DashboardStats {
  if (bookings.length === 0) {
    return emptyStats
  }

  const uniquePatients = new Set(bookings.map(b => b.nama))
  const monthlyTrends: { [key: string]: number } = {}
  const serviceCounts: { [key: string]: number } = {}
  const doctorCounts: { [key: string]: number } = {}

  bookings.forEach(b => {
    const month = new Date(b.tanggal).toLocaleDateString('id-ID', { month: 'short' })
    monthlyTrends[month] = (monthlyTrends[month] || 0) + 1
    serviceCounts[b.layanan] = (serviceCounts[b.layanan] || 0) + 1
    doctorCounts[b.dokter] = (doctorCounts[b.dokter] || 0) + 1
  })

  // Calculate growth (simple month over month)
  const months = Object.keys(monthlyTrends).sort()
  let pertumbuhan = 0
  if (months.length >= 2) {
    const lastMonth = monthlyTrends[months[months.length - 1]] || 0
    const prevMonth = monthlyTrends[months[months.length - 2]] || 0
    if (prevMonth > 0) {
      pertumbuhan = Math.round(((lastMonth - prevMonth) / prevMonth) * 100)
    }
  }

  return {
    totalBooking: bookings.length,
    bookingPending: bookings.filter(b => b.status === 'pending').length,
    bookingConfirmed: bookings.filter(b => b.status === 'confirmed').length,
    bookingCompleted: bookings.filter(b => b.status === 'completed').length,
    bookingCancelled: bookings.filter(b => b.status === 'cancelled').length,
    totalPasien: uniquePatients.size,
    pertumbuhan,
    bookingPerBulan: Object.entries(monthlyTrends).map(([bulan, jumlah]) => ({ bulan, jumlah })),
    layananPopuler: Object.entries(serviceCounts).map(([nama, jumlah]) => ({ nama, jumlah })).sort((a, b) => b.jumlah - a.jumlah),
    dokterPopuler: Object.entries(doctorCounts).map(([nama, jumlah]) => ({ nama, jumlah })).sort((a, b) => b.jumlah - a.jumlah)
  }
}

export function extractPatients(bookings: Booking[]): Patient[] {
  const patientMap = new Map<string, Patient>()

  bookings.forEach(b => {
    if (!patientMap.has(b.nama)) {
      patientMap.set(b.nama, {
        id: b.id,
        nama: b.nama,
        whatsapp: b.whatsapp,
        email: b.email,
        totalKunjungan: 0,
        terakhirKunjungan: b.tanggal,
        layanan: []
      })
    }
    const patient = patientMap.get(b.nama)!
    patient.totalKunjungan++
    if (new Date(b.tanggal) > new Date(patient.terakhirKunjungan)) {
      patient.terakhirKunjungan = b.tanggal
    }
    if (!patient.layanan.includes(b.layanan)) {
      patient.layanan.push(b.layanan)
    }
  })

  return Array.from(patientMap.values())
}