'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react'
import { services } from '@/data/services'
import { ScrollReveal } from '@/lib/scroll-reveal'

const iconMap: Record<string, React.ReactNode> = {
  'sparkles': <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round"/></svg>,
  'shield-check': <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round"/><path d="M9 12l2 2 4-4" strokeLinecap="round"/></svg>,
  'align-center': <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>,
  'sun': <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  'scissors': <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/></svg>,
  'heart': <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  'star': <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  'zap': <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
}

export default function LayananPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-white via-primary-50/40 to-warm-50/20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-warm-200/15 rounded-full blur-3xl" />
        </div>
        <div className="section-container relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              Layanan Kami
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Perawatan Gigi <span className="text-gradient">Terlengkap</span>
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Dari perawatan preventif hingga prosedur kosmetik canggih, tim dokter spesialis kami menyediakan berbagai layanan gigi dengan standar internasional.
            </p>
            <Link href="/booking" className="btn-primary">
              Booking Konsultasi Gratis
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <ScrollReveal key={service.id} delay={i * 80}>
                <div className="card group h-full flex flex-col">
                  {/* Image */}
                  <div className="relative -mx-6 -mt-6 mb-6 rounded-t-2xl overflow-hidden">
                    <div className="aspect-[4/3] bg-surface-100 relative">
                      <Image
                        src={service.imageUrl}
                        alt={service.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <div className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary-600">
                          {iconMap[service.icon]}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1">
                    <h3 className="font-display text-xl font-bold text-slate-800 mb-3 group-hover:text-primary-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">
                      {service.fullDesc}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{service.duration}</span>
                      </div>
                      <div className="h-4 w-px bg-surface-200" />
                      <span>{service.priceRange}</span>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-2 mb-6">
                      {service.benefits.slice(0, 3).map((benefit) => (
                        <div key={benefit} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle2 size={14} className="text-primary-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <Link href="/booking" className="btn-secondary w-full text-center mt-auto">
                      Booking Layanan Ini
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-500">
        <div className="section-container text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Tidak Yakin Layanan Apa yang Anda Butuhkan?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Konsultasi gratis dengan dokter kami. Kami akan membantu menentukan perawatan terbaik untuk kondisi gigi Anda.
          </p>
          <Link href="/booking" className="btn-warm">
            Jadwalkan Konsultasi Gratis
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}