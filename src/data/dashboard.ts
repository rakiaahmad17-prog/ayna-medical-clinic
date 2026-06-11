// Sample data for dashboard
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
}

export interface Patient {
  id: string
  nama: string
  whatsapp: string
  email?: string
  totalKunjungan: number
  terakhirKunjungan: string
}

export interface Statistic {
  totalBooking: number
  bookingPending: number
  totalPasien: number
  totalRevenue: number
}

// Mock data
export const dashboardStats: Statistic = {
  totalBooking: 156,
  bookingPending: 12,
  totalPasien: 89,
  totalRevenue: 0, // Not showing prices as per user request
}

export const recentBookings: Booking[] = [
  { id: '1', nama: 'Andi Pratama', whatsapp: '6281234567890', layanan: 'Scaling', dokter: 'drg. Siti Hardianti', tanggal: '2026-06-15', waktu: '09.00', status: 'pending', createdAt: '2026-06-10' },
  { id: '2', nama: 'Sari Dewi', whatsapp: '6289876543210', layanan: 'Tambal Gigi', dokter: 'drg. Fajrin Wijaya', tanggal: '2026-06-14', waktu: '10.00', status: 'confirmed', createdAt: '2026-06-09' },
  { id: '3', nama: 'Budi Santoso', whatsapp: '6285551234567', layanan: 'Behel', dokter: 'drg. Siti Hardianti', tanggal: '2026-06-13', waktu: '11.00', status: 'completed', createdAt: '2026-06-08' },
  { id: '4', nama: 'Rina Marlina', whatsapp: '628777888999', layanan: 'Pemutihan', dokter: 'drg. Fajrin Wijaya', tanggal: '2026-06-12', waktu: '14.00', status: 'pending', createdAt: '2026-06-07' },
  { id: '5', nama: 'Hamka', whatsapp: '628999888777', layanan: 'Pencabutan', dokter: 'drg. Siti Hardianti', tanggal: '2026-06-11', waktu: '15.00', status: 'completed', createdAt: '2026-06-06' },
]

export const patients: Patient[] = [
  { id: '1', nama: 'Andi Pratama', whatsapp: '6281234567890', totalKunjungan: 5, terakhirKunjungan: '2026-06-10' },
  { id: '2', nama: 'Sari Dewi', whatsapp: '6289876543210', totalKunjungan: 3, terakhirKunjungan: '2026-06-09' },
  { id: '3', nama: 'Budi Santoso', whatsapp: '6285551234567', totalKunjungan: 8, terakhirKunjungan: '2026-06-08' },
  { id: '4', nama: 'Rina Marlina', whatsapp: '628777888999', totalKunjungan: 2, terakhirKunjungan: '2026-06-07' },
  { id: '5', nama: 'Hamka', whatsapp: '628999888777', totalKunjungan: 4, terakhirKunjungan: '2026-06-06' },
]