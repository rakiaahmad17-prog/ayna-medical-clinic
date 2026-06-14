import { NextRequest, NextResponse } from 'next/server'
import { supabase, Booking } from '@/lib/supabase'

// GET - Fetch all bookings or filtered bookings
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const dokter = searchParams.get('dokter')
    const id = searchParams.get('id')
    const stats = searchParams.get('stats')

    // Get single booking by ID
    if (id) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        return NextResponse.json(
          { success: false, error: 'Booking not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: data
      })
    }

    // Get statistics
    if (stats === 'true') {
      const { data: allBookings, error } = await supabase
        .from('bookings')
        .select('*')

      if (error) throw error

      const totalBooking = allBookings?.length || 0
      const totalPasien = new Set(allBookings?.map(b => b.nama)).size || 0
      const bookingPending = allBookings?.filter(b => b.status === 'pending').length || 0

      return NextResponse.json({
        success: true,
        data: {
          totalBooking,
          totalPasien,
          bookingPending,
          pertumbuhan: 12,
          bookingPerBulan: []
        }
      })
    }

    // Build query
    let query = supabase.from('bookings').select('*')

    if (status) {
      query = query.eq('status', status)
    }
    if (dokter) {
      query = query.eq('dokter', dokter)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
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

    // Create the booking
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        nama: body.nama,
        whatsapp: body.whatsapp,
        email: body.email || null,
        layanan: body.layanan,
        dokter: body.dokter,
        tanggal: body.tanggal,
        waktu: body.waktu,
        pesan: body.pesan || null,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      {
        success: true,
        message: 'Booking created successfully',
        data: data,
        bookingId: data.id
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
    const { data: existing, error: checkError } = await supabase
      .from('bookings')
      .select('id')
      .eq('id', body.id)
      .single()

    if (checkError || !existing) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Update the booking
    const updateData: Partial<Booking> = {
      updated_at: new Date().toISOString()
    }

    if (body.status) updateData.status = body.status
    if (body.nama) updateData.nama = body.nama
    if (body.whatsapp) updateData.whatsapp = body.whatsapp
    if (body.email !== undefined) updateData.email = body.email
    if (body.layanan) updateData.layanan = body.layanan
    if (body.dokter) updateData.dokter = body.dokter
    if (body.tanggal) updateData.tanggal = body.tanggal
    if (body.waktu) updateData.waktu = body.waktu
    if (body.pesan !== undefined) updateData.pesan = body.pesan

    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully',
      data: data
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

    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)

    if (error) throw error

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
