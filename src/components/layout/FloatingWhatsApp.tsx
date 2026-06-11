'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

const WhatsAppNumber = '6285343747010' // drg. Siti Hardianti

const quickMessages = [
  'Halo, saya ingin membuat janji temu di Klinik AYNA Medical Clinic',
  'Halo, saya ingin bertanya tentang layanan gigi di Klinik AYNA',
  'Halo, saya ingin bertanya jadwal drg. Siti Hardianti',
  'Halo, saya ingin bertanya jadwal drg. Fajrin Wijaya',
]

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const sendMessage = (text: string) => {
    const encodedText = encodeURIComponent(text)
    window.open(`https://wa.me/${WhatsAppNumber}?text=${encodedText}`, '_blank')
    setIsOpen(false)
  }

  return (
    <>
      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
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
          <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 space-y-2">
          <p className="text-slate-500 text-xs mb-3">Pilih pesan atau ketik sendiri di WhatsApp:</p>
          {quickMessages.map((msg, i) => (
            <button
              key={i}
              onClick={() => sendMessage(msg)}
              className="w-full text-left px-4 py-3 rounded-xl border border-surface-200 hover:border-primary-300 hover:bg-primary-50 text-sm text-slate-700 transition-all flex items-center justify-between group"
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
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
        style={{ backgroundColor: '#25D366' }}
        aria-label="Chat WhatsApp"
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <div className="w-7 h-7 overflow-hidden">
            <Image src="/images/wa.png" alt="WhatsApp" width={28} height={28} className="object-contain" />
          </div>
        )}
        {/* Pulse ring */}
        {!isOpen && (
          <span className="absolute w-14 h-14 rounded-full animate-ping opacity-30 -z-10" style={{ backgroundColor: '#25D366' }}></span>
        )}
      </button>
    </>
  )
}