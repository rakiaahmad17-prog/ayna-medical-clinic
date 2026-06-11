'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Camera, ImageIcon } from 'lucide-react'

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

const categories = ['Semua', 'Klinik', 'Perawatan', 'Before/After', 'Team']

const galleryImages = [
  {
    id: '1',
    category: 'Klinik',
    title: 'Resepsionis Klinik',
    desc: 'Area resepsionis yang nyaman dan bersih untuk menunggu pasien',
    src: 'https://picsum.photos/seed/klinik1/600/400',
  },
  {
    id: '2',
    category: 'Klinik',
    title: 'Ruang Perawatan',
    desc: 'Ruang perawatan modern dengan peralatan dental terkini',
    src: 'https://picsum.photos/seed/klinik2/600/400',
  },
  {
    id: '3',
    category: 'Klinik',
    title: 'Lobby Klinik',
    desc: 'Lobby klinik dengan nuansa tenang dan nyaman',
    src: 'https://picsum.photos/seed/klinik3/600/400',
  },
  {
    id: '4',
    category: 'Team',
    title: 'Tim Dokter Ayna',
    desc: 'Dokter dan staff siap memberikan pelayanan terbaik',
    src: 'https://picsum.photos/seed/team1/600/400',
  },
  {
    id: '5',
    category: 'Klinik',
    title: 'Ruang Sterilisasi',
    desc: 'Area sterilisasi dengan standar internasional',
    src: 'https://picsum.photos/seed/klinik4/600/400',
  },
  {
    id: '6',
    category: 'Perawatan',
    title: 'Prosedur Scaling',
    desc: 'Proses pembersihan karang gigi dengan alat ultrasonic modern',
    src: 'https://picsum.photos/seed/perawatan1/600/400',
  },
  {
    id: '7',
    category: 'Perawatan',
    title: 'Pemutihan Gigi',
    desc: 'Treatment pemutihan gigi dengan hasil natural',
    src: 'https://picsum.photos/seed/perawatan2/600/400',
  },
  {
    id: '8',
    category: 'Klinik',
    title: 'Area Tunggu',
    desc: 'Area tunggu yang nyaman dengan desain menenangkan',
    src: 'https://picsum.photos/seed/klinik5/600/400',
  },
  {
    id: '9',
    category: 'Team',
    title: 'Dokter Spesialis',
    desc: 'Tim dokter spesialis berpengalaman',
    src: 'https://picsum.photos/seed/team2/600/400',
  },
]

export default function GaleriPage() {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const filteredImages = activeCategory === 'Semua'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory)

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-white via-primary-50/40 to-warm-50/20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl" />
        </div>
        <div className="section-container relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            <Camera size={14} />
            Galeri Klinik
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
            Lihat <span className="text-gradient">Fasilitas</span> Kami
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Jelajahi interior klinik, peralatan modern, dan suasana nyaman yang menunggu Anda di Klinik AYNA Medical Clinic (AMC).
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-padding -mt-8">
        <div className="section-container">
          {/* Filter */}
          <RevealCard>
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-primary-500 text-white'
                      : 'bg-surface-100 text-slate-600 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </RevealCard>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img, i) => (
              <RevealCard key={img.id} delay={i * 60}>
                <div
                  onClick={() => setSelectedImage(img.src)}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer bg-surface-100 aspect-[4/3]"
                >
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold text-white mb-1">{img.title}</h3>
                    <p className="text-white/70 text-sm">{img.desc}</p>
                  </div>
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ImageIcon size={14} className="text-slate-700" />
                  </div>
                </div>
              </RevealCard>
            ))}
          </div>

          {/* Placeholder notice */}
          <RevealCard delay={200}>
            <div className="mt-8 p-6 bg-surface-50 rounded-2xl border border-dashed border-surface-300 text-center">
              <div className="w-12 h-12 rounded-xl bg-surface-200 flex items-center justify-center mx-auto mb-3">
                <Camera size={20} className="text-slate-400" />
              </div>
              <h3 className="font-semibold text-slate-700 mb-2">Galeri Placeholder</h3>
              <p className="text-sm text-slate-500">
                Galeri ini menggunakan gambar placeholder. Anda dapat mengganti dengan foto asli klinik, dokter, dan hasil perawatan untuk konten yang lebih otentik.
              </p>
            </div>
          </RevealCard>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-800">
              <Image
                src={selectedImage}
                alt="Gallery image"
                fill
                className="object-contain"
                sizes="896px"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}