'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const footerLinks = {
  layanan: [
    { href: '/layanan', label: 'Scaling & Cleaning' },
    { href: '/layanan', label: 'Penambalan Gigi' },
    { href: '/layanan', label: 'Behel / Orthodonti' },
    { href: '/layanan', label: 'Pemutihan Gigi' },
    { href: '/layanan', label: 'Pencabutan Gigi' },
    { href: '/layanan', label: 'Perawatan Anak' },
  ],
  navigasi: [
    { href: '/beranda', label: 'Beranda' },
    { href: '/tentang-kami', label: 'Tentang Kami' },
    { href: '/tim-dokter', label: 'Tim Dokter' },
    { href: '/galeri', label: 'Galeri' },
    { href: '/testimoni', label: 'Testimoni' },
    { href: '/booking', label: 'Booking' },
  ],
  kontak: [
    { href: '/kontak', label: 'Hubungi Kami' },
    { href: '/faq', label: 'FAQ' },
    { href: '/kontak#peta', label: 'Peta Lokasi' },
  ]
}

export default function Footer() {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Hide footer on dashboard routes
  if (!isMounted || pathname?.startsWith('/dashboard')) {
    return null
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <Link href="/beranda" className="flex items-center gap-3 mb-6">
                <div className="relative w-10 h-10">
                  <Image
                    src="/images/logo.png"
                    alt="Ayna Medical Clinic Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="font-display font-bold text-lg text-white">AYNA</span>
                  <span className="block text-[10px] text-primary-400 font-semibold tracking-widest uppercase">Medical Clinic</span>
                </div>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Klinik dokter gigi terpercaya di Makassar dengan fasilitas modern dan dokter berpengalaman. Senyum sehat Anda adalah prioritas kami.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com/ayna_medicalclinic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-primary-500 flex items-center justify-center transition-colors overflow-hidden"
                  aria-label="Instagram"
                >
                  <Image src="/images/ig.png" alt="Instagram" width={20} height={20} className="object-contain" />
                </a>
                <a
                  href="https://wa.me/6285343747010"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-green-500 flex items-center justify-center transition-colors overflow-hidden"
                  aria-label="WhatsApp"
                >
                  <Image src="/images/wa.png" alt="WhatsApp" width={20} height={20} className="object-contain" />
                </a>
              </div>
            </div>

            {/* Layanan */}
            <div>
              <h4 className="font-display font-semibold text-white mb-4">Layanan</h4>
              <ul className="space-y-2.5">
                {footerLinks.layanan.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-slate-400 hover:text-primary-400 text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigasi */}
            <div>
              <h4 className="font-display font-semibold text-white mb-4">Navigasi</h4>
              <ul className="space-y-2.5">
                {footerLinks.navigasi.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-slate-400 hover:text-primary-400 text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kontak */}
            <div>
              <h4 className="font-display font-semibold text-white mb-4">Info Kontak</h4>
              <div className="space-y-4">
                <div className="text-slate-400 text-sm">
                  <p className="font-semibold text-white mb-1">Klinik AYNA MEDICAL CLINIC (AMC)</p>
                  <p>Jl. Pelita Raya, Bua Kana, Kec. Rappocini, Kota Makassar, Sulawesi Selatan 90231</p>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">
                    <span className="font-semibold text-white">drg. Siti Hardianti:</span><br />
                    +62 853-4374-7010
                  </p>
                  <p className="text-slate-400 text-sm">
                    <span className="font-semibold text-white">drg. Fajrin Wijaya:</span><br />
                    +62 812-5671-8190
                  </p>
                </div>
                <div className="text-slate-400 text-sm">
                  <p>Email: Ayna.medclinic@gmail.com</p>
                </div>
                <div className="text-slate-400 text-sm space-y-1">
                  <p><span className="font-semibold text-white">Senin - Jumat:</span> 08.00 - 20.00</p>
                  <p><span className="font-semibold text-white">Sabtu:</span> 08.00 - 17.00</p>
                  <p><span className="font-semibold text-white">Minggu:</span> Tutup</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="section-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-slate-500 text-sm">
              &copy; {currentYear} Klinik AYNA MEDICAL CLINIC (AMC). Hak Cipta Dilindungi.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="#" className="text-slate-500 hover:text-primary-400 transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="#" className="text-slate-500 hover:text-primary-400 transition-colors">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}