'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Award, Shield, Users, Target, Eye, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react'
import { ScrollReveal } from '@/lib/scroll-reveal'

const values = [
  { icon: <Shield className="w-6 h-6" />, title: 'Keamanan & Sterilisasi', desc: 'Peralatan disterilisasi dengan standar internasional. Ruang perawatan selalu bersih dan aman.' },
  { icon: <Award className="w-6 h-6" />, title: 'Kualitas Tinggi', desc: 'Hanya menggunakan bahan dan teknologi dental berkualitas tinggi dari brand terpercaya.' },
  { icon: <Users className="w-6 h-6" />, title: 'Pelayanan Ramah', desc: 'Staf dan dokter kami dilatih untuk memberikan pelayanan yang hangat dan membantu.' },
  { icon: <Target className="w-6 h-6" />, title: 'Akurat & Presisi', desc: 'Setiap prosedur dilakukan dengan ketelitian tinggi untuk hasil yang optimal.' },
]

const milestones = [
  { year: 'Berdiri', title: 'Ayna Medical Clinic', desc: 'Klinik dokter gigi terpercaya yang melayani masyarakat Makassar dengan dedikasi tinggi.' },
  { year: 'Fokus', title: 'Pelayanan Pasien', desc: 'Mengutamakan kenyamanan dan kebutuhan setiap pasien dengan pendekatan personal.' },
  { year: 'Modern', title: 'Fasilitas Lengkap', desc: 'Dilengkapi dengan peralatan dental modern untuk hasil perawatan yang optimal.' },
  { year: 'percaya', title: '1000+ Pasien', desc: 'Telah melayani ribuan pasien dari berbagai kalangan di Makassar dan sekitarnya.' },
]

export default function TentangKamiPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-white via-primary-50/40 to-warm-50/20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-60 h-60 bg-warm-200/15 rounded-full blur-3xl" />
        </div>
        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-primary-500" />
                Tentang Kami
              </span>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Klinik AYNA<br />
                <span className="text-gradient">Medical Clinic</span><br />
                (AMC)
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Klinik dokter gigi terpercaya di Makassar yang berkomitmen memberikan perawatan gigi berkualitas dengan dokter berpengalaman dan fasilitas modern.
              </p>
              <Link href="/booking" className="btn-primary">
                Jadwalkan Kunjungan
                <ArrowRight size={16} />
              </Link>
            </div>
            <ScrollReveal delay={200}>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://picsum.photos/seed/clinic-interior/600/400"
                    alt="Interior Klinik AYNA Medical Clinic"
                    width={600}
                    height={400}
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal>
              <div className="card h-full">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-primary-600" />
                </div>
                <h2 className="font-display text-2xl font-bold text-slate-800 mb-4">Visi</h2>
                <p className="text-slate-600 leading-relaxed">
                  Menjadi klinik dokter gigi terdepan di Makassar yang dikenal karena kualitas perawatan, inovasi teknologi, dan pelayanan yang berpusat pada pasien. Kami ingin setiap pasien merasa nyaman dan percaya diri dengan senyum mereka.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="card h-full">
                <div className="w-14 h-14 rounded-2xl bg-warm-100 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-warm-600" />
                </div>
                <h2 className="font-display text-2xl font-bold text-slate-800 mb-4">Misi</h2>
                <ul className="space-y-3">
                  {['Memberikan perawatan gigi berkualitas tinggi dengan harga terjangkau', 'Menggunakan teknologi dan bahan dental terbaru dan terverifikasi', 'Melatih tim dokter dan staff untuk terus meningkatkan kompetensi', 'Membangun hubungan jangka panjang dengan pasien melalui kepercayaan'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                      <CheckCircle2 size={16} className="text-primary-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-surface-50">
        <div className="section-container">
          <ScrollReveal className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Nilai-Nilai Kami
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Empat prinsip utama yang memandu setiap layanan kami.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 80}>
                <div className="card text-center h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h3 className="font-display font-semibold text-slate-800 mb-2">{value.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{value.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="section-padding">
        <div className="section-container">
          <ScrollReveal className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Info Klinik
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Lokasi', value: 'Jl. Pelita Raya, Bua Kana, Kec. Rappocini, Kota Makassar, Sulawesi Selatan 90231' },
              { label: 'Instagram', value: '@ayna_medicalclinic' },
              { label: 'Email', value: 'Ayna.medclinic@gmail.com' },
              { label: 'Jam Buka', value: 'Senin-Jumat: 08.00-20.00, Sabtu: 08.00-17.00' },
            ].map((info, i) => (
              <ScrollReveal key={info.label} delay={i * 80}>
                <div className="card text-center h-full">
                  <h3 className="font-display font-bold text-lg text-primary-600 mb-2">{info.label}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{info.value}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary-500 to-primary-700">
        <div className="section-container text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Temui Tim Kami
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Kenali dokter-dokter kami yang siap memberikan perawatan terbaik untuk Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tim-dokter" className="btn-warm">
              Lihat Tim Dokter
              <ArrowRight size={16} />
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