'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { usePathname } from 'next/navigation'
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

// Helper function to check if a link is active
// Handles both exact matches and nested paths (e.g., /blog/some-post matches /blog)
function isLinkActive(href: string, pathname: string): boolean {
  if (href === '/beranda') {
    // Home page should only be active on exact match
    return pathname === '/beranda' || pathname === '/'
  }
  return pathname.startsWith(href)
}

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isDashboard, setIsDashboard] = useState(false)

  // Ref for mobile menu container to manage focus and keyboard events
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setIsMounted(true)
    setIsDashboard(pathname?.startsWith('/dashboard') || false)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
        // Return focus to the menu button when menu closes
        menuButtonRef.current?.focus()
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Focus trap management for mobile menu accessibility
  const handleMobileMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab') {
      const focusableElements = mobileMenuRef.current?.querySelectorAll(
        'a[href], button:not([disabled])'
      )
      if (!focusableElements || focusableElements.length === 0) return

      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      // Shift + Tab on first element -> go to last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
      // Tab on last element -> go to first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }

  if (!isMounted || isDashboard) {
    return null
  }

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

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link.href, pathname)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                    ${isActive
                      ? 'text-primary-600 bg-primary-50 font-semibold'
                      : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'
                    }
                  `}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link
              href="/dashboard/login"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-primary-600 hover:bg-primary-50 border border-primary-300 bg-primary-50/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              Admin
            </Link>
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
            ref={menuButtonRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          role="navigation"
          aria-label="Menu navigasi mobile"
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-screen mt-4 pb-4' : 'max-h-0'
          }`}
          onKeyDown={handleMobileMenuKeyDown}
        >
          <nav className="flex flex-col gap-1 pt-4 border-t border-surface-200">
            {navLinks.map((link) => {
              const isActive = isLinkActive(link.href, pathname)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    px-4 py-3 rounded-xl font-medium transition-colors
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                    ${isActive
                      ? 'bg-primary-50 text-primary-600 font-semibold border-l-4 border-primary-500'
                      : 'text-slate-700 hover:bg-primary-50 hover:text-primary-600'
                    }
                  `}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="mt-4 pt-4 border-t border-surface-200">
              <div className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 mb-3">
                <Phone size={14} className="text-primary-500" />
                <span>+62 853-4374-7010</span>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/booking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary flex-1 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Buat Janji
                </Link>
                <Link
                  href="/dashboard/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-outline flex-1 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Admin
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}