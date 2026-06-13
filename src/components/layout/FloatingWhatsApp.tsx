'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { WHATSAPP } from '@/lib/config'

const quickMessages = [
  'Halo, saya ingin membuat janji temu di Klinik AYNA Medical Clinic',
  'Halo, saya ingin bertanya tentang layanan gigi di Klinik AYNA',
  'Halo, saya ingin bertanya jadwal drg. Siti Hardianti',
  'Halo, saya ingin bertanya jadwal drg. Fajrin Wijaya',
]

export default function FloatingWhatsApp() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isDashboard, setIsDashboard] = useState(false)
  const [isButtonFocused, setIsButtonFocused] = useState(false)

  const chatPanelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const messageButtonsRef = useRef<(HTMLButtonElement | null)[]>([])

  // Initialize state on mount
  useEffect(() => {
    setIsMounted(true)
    setIsDashboard(pathname?.startsWith('/dashboard') || false)
  }, [pathname])

  // Scroll listener
  useEffect(() => {
    if (!isMounted) return

    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMounted])

  // Handle Escape key to close chat panel
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        // Return focus to the floating button when panel closes
        const floatingButton = document.querySelector('[data-floating-wa-button]') as HTMLButtonElement
        floatingButton?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Focus trap within chat panel when open
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      // Focus the close button when panel opens
      closeButtonRef.current.focus()
    }
  }, [isOpen])

  // Handle Tab navigation within chat panel
  const handleChatPanelKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = chatPanelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled])'
      )
      if (!focusableElements || focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }, [])

  // Don't render on server or dashboard routes
  if (!isMounted || isDashboard) {
    return null
  }

  const sendMessage = (text: string) => {
    const encodedText = encodeURIComponent(text)
    window.open(`https://wa.me/${WHATSAPP.PRIMARY}?text=${encodedText}`, '_blank')
    setIsOpen(false)
  }

  return (
    <>
      {/* Chat Panel */}
      <div
        ref={chatPanelRef}
        role="dialog"
        aria-label="Chat WhatsApp"
        aria-modal="true"
        className={`fixed bottom-24 right-6 z-50 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        onKeyDown={handleChatPanelKeyDown}
      >
        <div className="bg-primary-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
              <Image src="/images/wa.png" alt="WhatsApp" width={20} height={20} className="object-contain" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Chat Klinik AYNA</p>
              <p className="text-primary-100 text-xs">Biasanya dibalas dalam 1 jam</p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={() => setIsOpen(false)}
            className="text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary-500 rounded p-1 transition-colors"
            aria-label="Tutup chat"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4 space-y-2">
          <p className="text-slate-500 text-xs mb-3">Pilih pesan atau ketik sendiri di WhatsApp:</p>
          {quickMessages.map((msg, i) => (
            <button
              key={i}
              ref={(el) => { messageButtonsRef.current[i] = el }}
              onClick={() => sendMessage(msg)}
              className="w-full text-left px-4 py-3 rounded-xl border border-surface-200 hover:border-primary-300 hover:bg-primary-50 text-sm text-slate-700 transition-all flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
            >
              <span>{msg}</span>
              <svg className="w-4 h-4 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Button */}
      <button
        data-floating-wa-button
        onClick={() => setIsOpen(!isOpen)}
        onFocus={() => setIsButtonFocused(true)}
        onBlur={() => setIsButtonFocused(false)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        } ${isButtonFocused ? 'ring-4 ring-white/50' : ''}`}
        style={{ backgroundColor: '#25D366' }}
        aria-label={isOpen ? 'Tutup chat WhatsApp' : 'Buka chat WhatsApp'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <div className="w-7 h-7 overflow-hidden">
            <Image src="/images/wa.png" alt="WhatsApp" width={28} height={28} className="object-contain" />
          </div>
        )}
        {!isOpen && (
          <span className="absolute w-14 h-14 rounded-full animate-ping opacity-30 -z-10" style={{ backgroundColor: '#25D366' }}></span>
        )}
      </button>
    </>
  )
}