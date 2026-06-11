'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone } from 'lucide-react'

const navLinks = [
  { href: '/beranda', label: 'Beranda' },
  { href: '/layanan', label: 'Layanan' },
  { href: '/tim-dokter', label: 'Tim Dokter' },
  { href: '/blog', label: 'Blog' },
  { href: '/testimoni', label: 'Testimoni' },
  { href: '/tentang-kami', label: 'Tentang' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/kontak', label: 'Kontak' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-soft py-2'
          : 'bg-white py-4'
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/beranda" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <Image
                src="/images/logo.png"
                alt="Ayna Medical Clinic Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-slate-800 tracking-tight">AYNA</span>
              <span className="block text-[9px] text-primary-600 font-semibold tracking-widest uppercase">Medical Clinic</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-slate-600 hover:text-primary-600 hover:bg-primary-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA & Contact */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone size={15} className="text-primary-500" />
              <span className="font-medium">+62 853-4374-7010</span>
            </div>
            <Link href="/booking" className="btn-primary text-sm px-5 py-2.5">
              Buat Janji
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-screen mt-4 pb-4' : 'max-h-0'
          }`}
        >
          <nav className="flex flex-col gap-1 pt-4 border-t border-surface-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-surface-200">
              <div className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 mb-3">
                <Phone size={14} className="text-primary-500" />
                <span>+62 853-4374-7010</span>
              </div>
              <Link
                href="/booking"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-primary w-full text-center"
              >
                Buat Janji
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}