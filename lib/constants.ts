/**
 * WhatsApp configuration
 * Centralized WhatsApp numbers for easy maintenance
 */

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
export const WHATSAPP_NUMBER_2 = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_2 || '';

/**
 * Generate WhatsApp chat URL with pre-filled message
 * @param phoneNumber - WhatsApp number (with country code, no + sign)
 * @param message - Pre-filled message text
 * @returns WhatsApp deep link URL
 */
export function getWhatsAppUrl(phoneNumber: string, message: string = ''): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

/**
 * Get WhatsApp URL for the primary number
 */
export function getPrimaryWhatsAppUrl(message: string = ''): string {
  return getWhatsAppUrl(WHATSAPP_NUMBER, message);
}

/**
 * Get WhatsApp URL for the secondary number
 */
export function getSecondaryWhatsAppUrl(message: string = ''): string {
  return getWhatsAppUrl(WHATSAPP_NUMBER_2, message);
}