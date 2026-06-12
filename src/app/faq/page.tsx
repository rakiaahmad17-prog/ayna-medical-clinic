'use client'

import { useState } from 'react'
import { ChevronDown, Search, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { faqs } from '@/data/faqs'
import { ScrollReveal } from '@/lib/scroll-reveal'

const categories = ['Semua', 'Perawatan', 'Orthodonti', 'Pemutihan', 'Anak', 'Booking', 'Pembayaran']

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(['faq1']))

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return newSet
    })
  }

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'Semua' || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-white via-primary-50/40 to-warm-50/20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl" />
        </div>
        <div className="section-container relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
            ❓ Pertanyaan Umum
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan yang sering diajukan pasien kami. Jika tidak menemukan jawaban, jangan ragu untuk menghubungi kami.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-padding -mt-8">
        <div className="section-container max-w-4xl">
          {/* Search */}
          <ScrollReveal>
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pertanyaan..."
                className="input-field pl-12 py-4 text-base"
              />
            </div>
          </ScrollReveal>

          {/* Category Filter */}
          <ScrollReveal delay={100}>
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
          </ScrollReveal>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 mb-4">Tidak ada hasil untuk "{searchQuery}"</p>
                <button onClick={() => setSearchQuery('')} className="btn-secondary text-sm">
                  Reset Pencarian
                </button>
              </div>
            ) : (
              filteredFaqs.map((faq, i) => (
                <ScrollReveal key={faq.id} delay={i * 50}>
                  <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    openItems.has(faq.id)
                      ? 'border-primary-300 bg-primary-50/30 shadow-soft'
                      : 'border-surface-200 bg-white hover:border-primary-200'
                  }`}>
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                      aria-expanded={openItems.has(faq.id)}
                    >
                      <span className={`font-semibold text-base transition-colors ${
                        openItems.has(faq.id) ? 'text-primary-700' : 'text-slate-800'
                      }`}>
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={20}
                        className={`flex-shrink-0 text-primary-500 transition-transform duration-300 ${
                          openItems.has(faq.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${
                      openItems.has(faq.id) ? 'max-h-96' : 'max-h-0'
                    }`}>
                      <p className="px-6 pb-5 text-slate-600 leading-relaxed text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="section-padding bg-surface-50">
        <div className="section-container max-w-2xl text-center">
          <ScrollReveal>
            <div className="card">
              <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-800 mb-4">
                Masih Ada Pertanyaan?
              </h2>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Tim kami siap membantu Anda. Hubungi kami via WhatsApp untuk respons cepat atau booking konsultasi langsung.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/booking" className="btn-primary">
                  Booking Konsultasi
                </Link>
                <a href="https://wa.me/6285343747010" target="_blank" rel="noopener noreferrer" className="btn-warm">
                  <MessageCircle size={16} />
                  Chat WhatsApp
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}