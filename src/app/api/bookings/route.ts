import { NextRequest, NextResponse } from 'next/server'
import {
  getAllBookings,
  createBooking,
  updateBookingStatus,
  updateBooking,
  deleteBooking,
  getBookingById,
  getBookingsByStatus,
  getBookingsByDoctor,
  getBookingsByService,
  getBookingsByDateRange,
  getBookingsStats,
  Booking
} from '@/lib/db'

// GET - Fetch all bookings or filtered bookings
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Filter by status
    const status = searchParams.get('status') as Booking['status'] | null
    if (status) {
      const bookings = getBookingsByStatus(status)
      return NextResponse.json({
        success: true,
        data: bookings,
        count: bookings.length
      })
    }

    // Filter by doctor
    const dokter = searchParams.get('dokter')
    if (dokter) {
      const bookings = getBookingsByDoctor(dokter)
      return NextResponse.json({
        success: true,
        data: bookings,
        count: bookings.length
      })
    }

    // Filter by service
    const layanan = searchParams.get('layanan')
    if (layanan) {
      const bookings = getBookingsByService(layanan)
      return NextResponse.json({
        success: true,
        data: bookings,
        count: bookings.length
      })
    }

    // Filter by date range
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (startDate && endDate) {
      const bookings = getBookingsByDateRange(startDate, endDate)
      return NextResponse.json({
        success: true,
        data: bookings,
        count: bookings.length
      })
    }

    // Get single booking by ID
    const id = searchParams.get('id')
    if (id) {
      const booking = getBookingById(id)
      if (!booking) {
        return NextResponse.json(
          { success: false, error: 'Booking not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        data: booking
      })
    }

    // Get statistics
    const stats = searchParams.get('stats')
    if (stats === 'true') {
      return NextResponse.json({
        success: true,
        data: getBookingsStats()
      })
    }

    // Get all bookings
    const bookings = getAllBookings()
    return NextResponse.json({
      success: true,
      data: bookings,
      count: bookings.length
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// POST - Create new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['nama', 'whatsapp', 'layanan', 'dokter', 'tanggal', 'waktu']
    const missingFields = requiredFields.filter(field => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          missingFields
        },
        { status: 400 }
      )
    }

    // Validate WhatsApp format
    if (!/^[\d\s+()-]{10,}$/.test(body.whatsapp)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid WhatsApp number format'
        },
        { status: 400 }
      )
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(body.tanggal)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid date format. Use YYYY-MM-DD'
        },
        { status: 400 }
      )
    }

    // Create the booking
    const booking = createBooking({
      nama: body.nama,
      whatsapp: body.whatsapp,
      email: body.email || '',
      layanan: body.layanan,
      dokter: body.dokter,
      tanggal: body.tanggal,
      waktu: body.waktu,
      pesan: body.pesan || ''
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Failed to create booking' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Booking created successfully',
        data: booking
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

// PUT - Update booking (status or full update)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Check if booking exists
    const existingBooking = getBookingById(body.id)
    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    // If only updating status
    if (body.status && !body.nama && !body.layanan) {
      const validStatuses: Booking['status'][] = ['pending', 'confirmed', 'cancelled', 'completed']
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid status. Must be one of: pending, confirmed, cancelled, completed'
          },
          { status: 400 }
        )
      }

      const updatedBooking = updateBookingStatus(body.id, body.status)
      if (!updatedBooking) {
        return NextResponse.json(
          { success: false, error: 'Failed to update booking status' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Booking status updated successfully',
        data: updatedBooking
      })
    }

    // Full update
    const updatedBooking = updateBooking(body.id, {
      nama: body.nama,
      whatsapp: body.whatsapp,
      email: body.email,
      layanan: body.layanan,
      dokter: body.dokter,
      tanggal: body.tanggal,
      waktu: body.waktu,
      pesan: body.pesan,
      status: body.status
    })

    if (!updatedBooking) {
      return NextResponse.json(
        { success: false, error: 'Failed to update booking' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a booking
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Check if booking exists
    const existingBooking = getBookingById(id)
    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    const deleted = deleteBooking(id)
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete booking' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully',
      data: { id }
    })
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete booking' },
      { status: 500 }
    )
  }
}
