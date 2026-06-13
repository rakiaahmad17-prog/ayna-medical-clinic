import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const DB_PATH = path.join(process.cwd(), 'src', 'lib', 'db', 'bookings.json')
const LOCK_DIR = path.join(process.cwd(), 'src', 'lib', 'db', '.locks')

// Ensure lock directory exists
function ensureLockDir() {
  if (!fs.existsSync(LOCK_DIR)) {
    fs.mkdirSync(LOCK_DIR, { recursive: true })
  }
}

// Acquire file lock with retry mechanism
function acquireLock(lockName: string, timeout: number = 10000): string {
  ensureLockDir()
  const lockPath = path.join(LOCK_DIR, `${lockName}.lock`)
  const startTime = Date.now()

  while (fs.existsSync(lockPath)) {
    if (Date.now() - startTime > timeout) {
      throw new Error(`Failed to acquire lock: ${lockName} - timeout`)
    }
    // Wait a bit before retrying
    const waitTime = Math.floor(Math.random() * 50) + 10
    const start = Date.now()
    while (Date.now() - start < waitTime) {
      // busy wait
    }
  }

  // Create lock file with PID and timestamp
  const lockData = {
    pid: process.pid,
    timestamp: Date.now(),
    random: crypto.randomBytes(8).toString('hex')
  }
  fs.writeFileSync(lockPath, JSON.stringify(lockData))
  return lockPath
}

// Release file lock
function releaseLock(lockPath: string): void {
  try {
    if (fs.existsSync(lockPath)) {
      fs.unlinkSync(lockPath)
    }
  } catch (error) {
    console.error('Error releasing lock:', error)
  }
}

// Read data from bookings.json
export function readBookings(): Booking[] {
  const lockPath = acquireLock('read')
  try {
    if (!fs.existsSync(DB_PATH)) {
      // Create directory if it doesn't exist
      const dir = path.dirname(DB_PATH)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      // Create empty file
      fs.writeFileSync(DB_PATH, '[]', 'utf-8')
      return []
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(data) as Booking[]
  } catch (error) {
    console.error('Error reading bookings:', error)
    return []
  } finally {
    releaseLock(lockPath)
  }
}

// Write data to bookings.json
export function writeBookings(bookings: Booking[]): boolean {
  const lockPath = acquireLock('write')
  try {
    const dir = path.dirname(DB_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(bookings, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('Error writing bookings:', error)
    return false
  } finally {
    releaseLock(lockPath)
  }
}

// Generate unique ID
export function generateId(): string {
  const timestamp = Date.now().toString(36)
  const randomPart = crypto.randomBytes(4).toString('hex')
  return `booking_${timestamp}_${randomPart}`
}

// Booking interface
export interface Booking {
  id: string
  nama: string
  whatsapp: string
  email?: string
  layanan: string
  dokter: string
  tanggal: string
  waktu: string
  pesan?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: string
  updatedAt?: string
}

// Create new booking
export function createBooking(data: Omit<Booking, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Booking | null {
  const bookings = readBookings()

  const newBooking: Booking = {
    ...data,
    id: generateId(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  bookings.push(newBooking)

  if (writeBookings(bookings)) {
    return newBooking
  }
  return null
}

// Get all bookings
export function getAllBookings(): Booking[] {
  return readBookings()
}

// Get booking by ID
export function getBookingById(id: string): Booking | null {
  const bookings = readBookings()
  return bookings.find(b => b.id === id) || null
}

// Update booking status
export function updateBookingStatus(id: string, status: Booking['status']): Booking | null {
  const bookings = readBookings()
  const index = bookings.findIndex(b => b.id === id)

  if (index === -1) {
    return null
  }

  bookings[index] = {
    ...bookings[index],
    status,
    updatedAt: new Date().toISOString()
  }

  if (writeBookings(bookings)) {
    return bookings[index]
  }
  return null
}

// Update booking (full update)
export function updateBooking(id: string, data: Partial<Omit<Booking, 'id' | 'createdAt'>>): Booking | null {
  const bookings = readBookings()
  const index = bookings.findIndex(b => b.id === id)

  if (index === -1) {
    return null
  }

  bookings[index] = {
    ...bookings[index],
    ...data,
    updatedAt: new Date().toISOString()
  }

  if (writeBookings(bookings)) {
    return bookings[index]
  }
  return null
}

// Delete booking
export function deleteBooking(id: string): boolean {
  const bookings = readBookings()
  const index = bookings.findIndex(b => b.id === id)

  if (index === -1) {
    return false
  }

  bookings.splice(index, 1)
  return writeBookings(bookings)
}

// Get bookings by status
export function getBookingsByStatus(status: Booking['status']): Booking[] {
  const bookings = readBookings()
  return bookings.filter(b => b.status === status)
}

// Get bookings by date range
export function getBookingsByDateRange(startDate: string, endDate: string): Booking[] {
  const bookings = readBookings()
  return bookings.filter(b => {
    const bookingDate = new Date(b.tanggal)
    return bookingDate >= new Date(startDate) && bookingDate <= new Date(endDate)
  })
}

// Get bookings by doctor
export function getBookingsByDoctor(dokter: string): Booking[] {
  const bookings = readBookings()
  return bookings.filter(b => b.dokter === dokter)
}

// Get bookings by service
export function getBookingsByService(layanan: string): Booking[] {
  const bookings = readBookings()
  return bookings.filter(b => b.layanan === layanan)
}

// Get bookings statistics
export function getBookingsStats(): {
  total: number
  pending: number
  confirmed: number
  cancelled: number
  completed: number
} {
  const bookings = readBookings()
  return {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    completed: bookings.filter(b => b.status === 'completed').length
  }
}
