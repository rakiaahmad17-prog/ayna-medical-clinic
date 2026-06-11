'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Star, Quote, ArrowRight } from 'lucide-react'
import { testimonials } from '@/data/testimonials'

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target) } },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return { ref, isVisible }
}

function RevealCard({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${className}`}
      style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

const stats = [
  { number: '500+', label: 'Pasien Puas' },
  { number: '4.9/5', label: 'Rating Google' },
  { number: '8+', label: 'Tahun Pengalaman' },
  { number: '4', label: 'Dokter Spesialis' },
]

export default function TestimoniPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-white via-primary-50/40 to-warm-50/20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-warm-200/15 rounded-full blur-3xl" />
        </div>
        <div className="section-container relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <Star size={14} className="fill-primary-400" />
            Testimoni Pasien
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Kata <span className="text-gradient">Mereka yang</span><br />
            Sudah Percaya
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Lebih dari 500 pasien telah mempercayakan kesehatan gigi mereka kepada Ayna Medical Clinic. Berikut cerita mereka.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-surface-50">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl sm:text-4xl font-bold text-primary-600 mb-1">{stat.number}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <RevealCard key={t.id} delay={i * 80}>
                <div className="card h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} size={16} className="text-warm-400 fill-warm-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-primary-200 mb-4" />
                  <p className="text-slate-600 leading-relaxed mb-6 flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-surface-100">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-200 flex-shrink-0">
                      <Image src={t.avatarUrl} alt={t.name} width={40} height={40} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.role}</p>
                    </div>
                    <span className="ml-auto text-xs text-slate-400">{t.date}</span>
                  </div>
                </div>
              </RevealCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary-500 to-primary-700">
        <div className="section-container text-center">
          <RevealCard>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Bergabung dengan Pasien Puas Kami
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Jadwalkan kunjungan Anda hari ini dan rasakan sendiri perawatan gigi yang nyaman dan profesional.
            </p>
            <Link href="/booking" className="btn-warm">
              Buat Janji Sekarang
              <ArrowRight size={16} />
            </Link>
          </RevealCard>
        </div>
      </section>
    </>
  )
}