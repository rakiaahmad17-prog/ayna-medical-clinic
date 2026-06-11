'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { ArrowRight, Star, Shield, Clock, Award, ChevronRight, Quote, Sparkles } from 'lucide-react'
import { services } from '@/data/services'
import { testimonials } from '@/data/testimonials'

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
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
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

const whyChooseUs = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Dokter Berpengalaman',
    desc: 'Tim dokter gigi spesialis dengan pengalaman 5-12 tahun',
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: 'Fasilitas Modern',
    desc: 'Peralatan dental terkini dan sterilisasi standar internasional',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Jadwal Fleksibel',
    desc: 'Buka setiap hari dengan jam praktik hingga malam',
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: 'Rating Tinggi',
    desc: '4.9/5 dari 500+ ulasan pasien puas di Google',
  },
]

export default function BerandaPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-warm-50/20">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-warm-200/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary-100/10 to-warm-100/10 rounded-full blur-3xl" />
        </div>

        <div className="section-container relative z-10 py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                <Sparkles size={14} />
                <span>Klinik Gigi Modern di Makassar</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Senyum Sehat,<br />
                <span className="text-gradient">Harapan Baru</span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                Ayna Medical Clinic hadir memberikan perawatan gigi terbaik dengan dokter berpengalaman, fasilitas modern, dan pendekatan yang nyaman untuk seluruh keluarga Anda.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/booking" className="btn-primary text-base px-8 py-4">
                  <span>Buat Janji Sekarang</span>
                  <ArrowRight size={18} />
                </Link>
                <Link href="/layanan" className="btn-outline text-base px-8 py-4">
                  Lihat Layanan
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-primary-200 border-2 border-white flex items-center justify-center text-xs font-bold text-primary-700">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-slate-800">500+</span>
                    <span className="text-slate-500"> pasien puas</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={16} className="text-warm-400 fill-warm-400" />
                  ))}
                  <span className="text-sm text-slate-600 ml-1">4.9/5</span>
                </div>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://picsum.photos/seed/clinic-hero/700/525"
                    alt="Interior Klinik Gigi AYNA Medical Clinic yang modern dan bersih"
                    width={600}
                    height={450}
                    className="w-full object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-card z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Buka Hari Ini</p>
                    <p className="text-xs text-slate-500">08.00 - 20.00 WITA</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-card z-20">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-primary-400 border-2 border-white -ml-2 first:ml-0 flex items-center justify-center text-[9px] font-bold text-white">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-xs">+8 tahun</p>
                    <p className="text-[10px] text-slate-500">Pengalaman</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-surface-50 relative">
        <div className="section-container">
          <RevealCard className="text-center mb-16">
            <span className="badge badge-primary mb-4">Layanan Kami</span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Perawatan Gigi <span className="text-gradient">Terlengkap</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Dari scaling harian hingga smile makeover lengkap, tim dokter spesialis kami siap memberikan yang terbaik untuk senyum Anda.
            </p>
          </RevealCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 8).map((service, i) => (
              <RevealCard key={service.id} delay={i * 80}>
                <Link href="/layanan" className="group card block h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
                    <div className="text-primary-600 group-hover:text-white transition-colors">
                      <ServiceIcon name={service.icon} />
                    </div>
                  </div>
                  <h3 className="font-display font-semibold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                    {service.shortDesc}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-primary-600 font-medium group-hover:gap-2 transition-all">
                    <span>Pelajari</span>
                    <ChevronRight size={14} />
                  </div>
                </Link>
              </RevealCard>
            ))}
          </div>

          <RevealCard delay={400} className="text-center mt-12">
            <Link href="/layanan" className="btn-secondary inline-flex items-center gap-2">
              Lihat Semua Layanan
              <ArrowRight size={16} />
            </Link>
          </RevealCard>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh" />
        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <RevealCard>
              <span className="badge badge-warm mb-4">Mengapa Ayna?</span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Percayakan Senyum Anda<br />Pada <span className="text-gradient">Ahli</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Kami bukan sekadar klinik gigi biasa. Ayna Medical Clinic adalah tempat di mana teknologi canggih bertemu dengan sentuhan manusiawi, memberikan pengalaman perawatan yang nyaman dan hasil yang optimal.
              </p>
              <Link href="/tentang-kami" className="btn-primary">
                Tentang Kami
                <ArrowRight size={16} />
              </Link>
            </RevealCard>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whyChooseUs.map((item, i) => (
                <RevealCard key={item.title} delay={i * 100}>
                  <div className="card h-full">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
                      {item.icon}
                    </div>
                    <h3 className="font-display font-semibold text-slate-800 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </RevealCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-warm-500/5 rounded-full blur-3xl" />
        </div>

        <div className="section-container relative z-10">
          <RevealCard className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 text-primary-300 text-sm font-medium mb-4">
              <Star size={14} className="fill-primary-400" />
              <span>Testimoni Pasien</span>
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Kata Mereka yang <span className="text-primary-400">Sudah Percaya</span>
            </h2>
          </RevealCard>

          {/* Testimonial Slider */}
          <div className="max-w-3xl mx-auto">
            <RevealCard>
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10">
                <Quote className="w-10 h-10 text-primary-400 mb-6" />
                <div className="transition-all duration-500">
                  <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-8">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-300">
                      <Image
                        src={testimonials[currentTestimonial].avatarUrl}
                        alt={testimonials[currentTestimonial].name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonials[currentTestimonial].name}</p>
                      <p className="text-sm text-slate-400">{testimonials[currentTestimonial].role}</p>
                    </div>
                    <div className="ml-auto flex gap-1">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} size={14} className="text-warm-400 fill-warm-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </RevealCard>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentTestimonial ? 'w-8 bg-primary-400' : 'w-2 bg-slate-600'
                  }`}
                  aria-label={`Testimoni ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <RevealCard delay={200} className="text-center mt-12">
            <Link href="/testimoni" className="btn-outline border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white">
              Lihat Semua Testimoni
              <ArrowRight size={16} />
            </Link>
          </RevealCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-3xl" />
        </div>

        <div className="section-container relative z-10 text-center">
          <RevealCard>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Siap untuk Senyum Lebih Sehat?
            </h2>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-10">
              Jadwalkan konsultasi gratis hari ini dan biarkan tim dokter kami membantu Anda menemukan perawatan yang tepat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking" className="btn-warm text-base px-10 py-4 shadow-lg">
                <span>Buat Janji Sekarang</span>
                <ArrowRight size={18} />
              </Link>
              <Link href="/kontak" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all backdrop-blur-sm">
                Hubungi Kami
              </Link>
            </div>
          </RevealCard>
        </div>
      </section>
    </>
  )
}

function ServiceIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    'sparkles': <Sparkles className="w-6 h-6" />,
    'shield-check': <Shield className="w-6 h-6" />,
    'align-center': <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>,
    'sun': <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>,
    'scissors': <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" /></svg>,
    'heart': <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
    'star': <Star className="w-6 h-6" />,
    'zap': <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  }
  return icons[name] || <Sparkles className="w-6 h-6" />
}