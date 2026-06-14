'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, User, ArrowRight, Search } from 'lucide-react'
import blogSeedData from '@/lib/db/blogs-seed.json'
import { ScrollReveal } from '@/lib/scroll-reveal'

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage?: string
  featuredImage?: string
  category: string
  author: string
  publishedAt?: string
  createdAt?: string
  readTime?: string
  featured?: boolean
  published?: boolean
}

const categories = ['Semua', 'Perawatan', 'Anak', 'Edukasi', 'Estetika']

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/api/blogs')

        if (!response.ok) {
          throw new Error('Failed to fetch blogs')
        }

        const data = await response.json()
        setBlogs(data)
      } catch (err) {
        console.error('Error fetching blogs:', err)
        setError('Gagal memuat artikel. Menggunakan data lokal.')
        // Fallback to static data
        setBlogs(blogSeedData as BlogPost[])
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const featuredPost = blogs.find(post => post.featured) || blogs[0]
  const otherPosts = blogs.filter(post => post.id !== featuredPost?.id)

  // Helper to get cover image (handles both API and static data)
  const getCoverImage = (post: BlogPost) => post.coverImage || post.featuredImage || '/images/blog/default.jpg'

  // Helper to format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const filteredPosts = otherPosts.filter(post => {
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'Semua' || post.category === activeCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <section className="min-h-screen pt-32 pb-20">
        <div className="section-container text-center">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-slate-200 rounded mx-auto mb-4" />
            <div className="h-4 w-96 bg-slate-200 rounded mx-auto" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-white via-primary-50/40 to-warm-50/20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl" />
        </div>
        <div className="section-container relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
              📝 Blog Kesehatan Gigi
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Blog <span className="text-gradient">Edukasi</span> Kesehatan Gigi
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Tips, informasi, dan pengetahuan seputar kesehatan gigi dan mulut dari tim dokter kami.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="section-padding -mt-8">
          <div className="section-container">
            <ScrollReveal>
              <Link href={`/blog/${featuredPost.slug}`} className="group block card overflow-hidden p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-[4/3] md:aspect-auto">
                    <Image
                      src={getCoverImage(featuredPost)}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-warm-100 text-warm-600 text-xs font-medium mb-4 w-fit">
                      ⭐ Featured
                    </span>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-800 mb-4 group-hover:text-primary-600 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-slate-500 leading-relaxed mb-6">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{formatDate(featuredPost.createdAt || featuredPost.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{featuredPost.readTime || '5 min'}</span>
                      </div>
                    </div>
                    <span className="btn-primary w-fit">
                      Baca Selengkapnya
                      <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Search & Filter */}
      <section className="pb-8">
        <div className="section-container">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel..."
                className="input-field pl-12"
              />
            </div>
            <div className="flex flex-wrap gap-2">
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
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-padding pt-0">
        <div className="section-container">
          {error && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
              {error}
            </div>
          )}

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 mb-4">Tidak ada artikel untuk "{searchQuery}"</p>
              <button onClick={() => { setSearchQuery(''); setActiveCategory('Semua'); }} className="btn-secondary text-sm">
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, i) => (
                <ScrollReveal key={post.id} delay={i * 80}>
                  <Link href={`/blog/${post.slug}`} className="card group overflow-hidden p-0 h-full flex flex-col">
                    <div className="relative aspect-[4/3] -mx-6 -mt-6 mb-4">
                      <Image
                        src={getCoverImage(post)}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-primary-600">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-0 px-6 flex-1 flex flex-col">
                      <h3 className="font-display text-lg font-bold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.readTime || formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-surface-50">
        <div className="section-container text-center">
          <ScrollReveal>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Butuh Konsultasi Lebih Lanjut?
            </h2>
            <p className="text-slate-500 mb-6 max-w-xl mx-auto">
              Tim dokter kami siap membantu Anda dengan pertanyaan seputar kesehatan gigi dan mulut.
            </p>
            <Link href="/booking" className="btn-primary">
              Booking Konsultasi
              <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
