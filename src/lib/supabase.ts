import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Get environment variables with fallback for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create client only if credentials are available
let supabaseInstance: SupabaseClient | null = null

if (supabaseUrl && supabaseAnonKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
}

// Export a getter function to get the supabase instance
export function getSupabase(): SupabaseClient | null {
  return supabaseInstance
}

// Export supabase for backwards compatibility (will be null during build)
export const supabase = supabaseInstance

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!supabaseInstance
}

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
