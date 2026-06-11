'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Calendar, Award, GraduationCap, ArrowRight, Phone } from 'lucide-react'
import { doctors } from '@/data/doctors'

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

export default function TimDokterPage() {
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
              Tim Dokter Kami
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Dipimpin oleh <span className="text-gradient">Dokter Berpengalaman</span>
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Tim dokter gigi kami siap memberikan perawatan terbaik dengan pendekatan yang ramah dan profesional untuk kenyamanan Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {doctors.map((doctor, i) => (
              <RevealCard key={doctor.id} delay={i * 100}>
                <div className="card group flex flex-col sm:flex-row gap-6">
                  {/* Photo */}
                  <div className="sm:w-40 sm:flex-shrink-0">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-100">
                      <Image
                        src={doctor.photoUrl}
                        alt={doctor.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="160px"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-medium mb-2">
                      Dokter Gigi
                    </div>
                    <h3 className="font-display text-xl font-bold text-slate-800 mb-1 group-hover:text-primary-600 transition-colors">
                      {doctor.name}
                    </h3>
                    <p className="text-primary-600 text-sm font-medium mb-3">{doctor.specialization}</p>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">{doctor.bio}</p>

                    {/* Meta */}
                    <div className="grid grid-cols-1 gap-2 mb-5">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Award size={14} className="text-primary-500" />
                        <span>{doctor.experience} pengalaman</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <GraduationCap size={14} className="text-primary-500" />
                        <span>{doctor.education}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar size={14} className="text-primary-500" />
                        <span>Praktik: {doctor.availableDays.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-green-500" />
                        <a href={`https://wa.me/${doctor.phone}`} target="_blank" rel="noopener noreferrer" className="text-green-600 font-medium hover:underline">
                          {doctor.phone.replace('+', '')}
                        </a>
                      </div>
                    </div>

                    <a href={`https://wa.me/${doctor.phone}?text=Halo%20${encodeURIComponent(doctor.name)},%20saya%20ingin%20booking%20janji%20temu`} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm px-5 py-2.5 w-full sm:w-auto text-center">
                      Booking dengan {doctor.name.split('. ')[1]}
                    </a>
                  </div>
                </div>
              </RevealCard>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-surface-50">
        <div className="section-container">
          <RevealCard className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Nilai-Nilai Kami
            </h2>
          </RevealCard>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { title: 'Empati', desc: 'Kami memahami bahwa setiap pasien punya kekhawatiran. Pendekatan kami dimulai dari mendengarkan.' },
              { title: 'Kejujuran', desc: 'Tidak ada klaim berlebihan. Kami jelaskan kondisi gigi Anda apa adanya dan rekomendasi yang transparan.' },
              { title: 'Keunggulan', desc: 'Terus update dengan teknologi dan teknik terbaru untuk hasil yang optimal.' },
            ].map((value, i) => (
              <RevealCard key={value.title} delay={i * 100}>
                <div className="card text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
                    <span className="font-display text-2xl font-bold text-primary-600">{i + 1}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-800 mb-3">{value.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{value.desc}</p>
                </div>
              </RevealCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-500">
        <div className="section-container text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Konsultasi dengan Dokter Kami
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Jadwalkan appointment sekarang dan temukan perawatan yang tepat untuk kebutuhan gigi Anda.
          </p>
          <Link href="/booking" className="btn-warm">
            Buat Janji Temu
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}