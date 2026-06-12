'use client'

import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ScrollReveal } from '@/lib/scroll-reveal'

const contactInfo = [
  {
    icon: <MapPin className="w-5 h-5" />,
    title: 'Alamat Klinik',
    lines: [
      'Klinik AYNA MEDICAL CLINIC (AMC)',
      'Jl. Pelita Raya, Bua Kana, Kec. Rappocini,',
      'Kota Makassar, Sulawesi Selatan 90231',
    ],
  },
  {
    icon: <Phone className="w-5 h-5" />,
    title: 'Nomor WhatsApp Dokter',
    lines: [
      'drg. Siti Hardianti: +62 853-4374-7010',
      'drg. Fajrin Wijaya: +62 812-5671-8190',
    ],
  },
  {
    icon: <Mail className="w-5 h-5" />,
    title: 'Email',
    lines: ['Ayna.medclinic@gmail.com'],
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Jam Praktik',
    lines: [
      'Senin - Jumat: 08.00 - 20.00',
      'Sabtu: 08.00 - 17.00',
      'Minggu: Tutup',
    ],
  },
]

export default function KontakPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-white via-primary-50/40 to-warm-50/20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl" />
        </div>
        <div className="section-container relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              <MapPin size={14} />
              Hubungi Kami
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
              Temukan <span className="text-gradient">Kami</span>
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Klinik AYNA Medical Clinic (AMC) terletak di lokasi strategis di Makassar. Mudah diakses dengan kendaraan pribadi maupun transportasi umum.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info + Map */}
      <section className="section-padding -mt-8">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <ScrollReveal>
                <div className="card">
                  <h2 className="font-display text-2xl font-bold text-slate-800 mb-6">Informasi Kontak</h2>
                  <div className="space-y-6">
                    {contactInfo.map((item) => (
                      <div key={item.title} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 mb-1">{item.title}</h3>
                          {item.lines.map((line, i) => (
                            <p key={i} className="text-slate-500 text-sm">{line}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <div className="card bg-green-50 border border-green-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Chat WhatsApp</h3>
                      <p className="text-sm text-slate-500">Respons cepat, biasanya kurang dari 1 jam</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <a href="https://wa.me/6285343747010" target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center">
                      Chat drg. Siti Hardianti
                      <ArrowRight size={16} />
                    </a>
                    <a href="https://wa.me/6281256718190" target="_blank" rel="noopener noreferrer" className="btn-outline w-full justify-center text-green-600 border-green-300 hover:bg-green-50">
                      Chat drg. Fajrin Wijaya
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Map */}
            <ScrollReveal delay={200}>
              <div id="peta" className="card p-0 overflow-hidden">
                <div className="aspect-[4/3] lg:aspect-auto lg:h-full min-h-[400px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.1!2d119.4167!3d-5.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMDknMDAuMCJTIDExNcKwMjUnMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '400px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi Klinik AYNA Medical Clinic di Makassar"
                    className="w-full h-full"
                  />
                </div>
                <div className="p-6 bg-white">
                  <h3 className="font-semibold text-slate-800 mb-2">Klinik AYNA MEDICAL CLINIC (AMC)</h3>
                  <p className="text-sm text-slate-500 mb-3">Jl. Pelita Raya, Bua Kana, Kec. Rappocini, Kota Makassar</p>
                  <a
                    href="https://www.google.com/maps/search/Jl.+Pelita+Raya,+Bua+Kana,+Kec.+Rappocini,+Kota+Makassar,+Sulawesi+Selatan+90231"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline text-sm px-4 py-2"
                  >
                    Buka di Google Maps
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="section-padding bg-surface-50">
        <div className="section-container text-center">
          <ScrollReveal>
            <h2 className="font-display text-2xl font-bold text-slate-800 mb-2">Ikuti Kami</h2>
            <p className="text-slate-500 mb-8">Dapatkan update dan info terbaru di Instagram kami</p>
            <div className="flex justify-center gap-4">
              <a
                href="https://instagram.com/ayna_medicalclinic"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform hover:scale-110 overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"
                aria-label="Instagram"
              >
                <Image src="/images/ig.png" alt="Instagram" width={24} height={24} className="object-contain" />
              </a>
              <a
                href="https://wa.me/6285343747010"
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-xl flex items-center justify-center bg-green-500 hover:bg-green-600 transition-transform hover:scale-110 overflow-hidden"
                aria-label="WhatsApp"
              >
                <Image src="/images/wa.png" alt="WhatsApp" width={24} height={24} className="object-contain" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-500">
        <div className="section-container text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Siap untuk Kunjungan Pertama?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Konsultasi gratis menanti Anda. Hubungi kami sekarang atau booking online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="btn-warm">
              <ArrowRight size={16} />
              Booking Sekarang
            </Link>
            <a href="https://wa.me/6285343747010" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all">
              <MessageCircle size={18} />
              Chat WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}