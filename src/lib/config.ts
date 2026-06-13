// WhatsApp phone numbers (international format without +)
export const WHATSAPP_NUMBERS = {
  DRG_SITI: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285343747010',
  DRG_FAJRIN: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_2 || '6281256718190',
  DEFAULT: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285343747010',
} as const

// Primary and secondary WhatsApp numbers for general use
export const WHATSAPP = {
  PRIMARY: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285343747010',
  SECONDARY: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_2 || '6281256718190',
} as const

// Map doctor names to WhatsApp numbers
export const DOCTOR_WHATSAPP: Record<string, string> = {
  'drg. Siti Hardianti': WHATSAPP_NUMBERS.DRG_SITI,
  'drg. Fajrin Wijaya': WHATSAPP_NUMBERS.DRG_FAJRIN,
  'Tidak ada preferensi': WHATSAPP_NUMBERS.DEFAULT,
}

export const CLINIC_NAME = 'AYNA Medical Clinic'
export const CLINIC_ADDRESS = process.env.NEXT_PUBLIC_CLINIC_ADDRESS || 'Makassar, Sulawesi Selatan'
