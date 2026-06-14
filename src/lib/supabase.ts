import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for our tables
export interface Booking {
  id: string
  nama: string
  whatsapp: string
  email: string | null
  layanan: string
  dokter: string
  tanggal: string
  waktu: string
  pesan: string | null
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
  updated_at: string
}

export interface Blog {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  category: string
  author: string
  featured_image: string | null
  published: boolean
  created_at: string
  updated_at: string
}
