'use client'

import { use } from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, User, ArrowLeft, ArrowRight } from 'lucide-react'
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

// Helper to get cover image
const getCoverImage = (post: BlogPost) => post.coverImage || post.featuredImage || '/images/blog/default.jpg'

// Helper to format date
const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true)
        setError(null)
        setNotFound(false)

        const response = await fetch(`/api/blogs?slug=${encodeURIComponent(slug)}`)

        if (!response.ok) {
          if (response.status === 404) {
            setNotFound(true)
            setError('Artikel tidak ditemukan.')
            // Fallback to static data
            const staticPost = (blogSeedData as BlogPost[]).find(p => p.slug === slug)
            if (staticPost) {
              setPost(staticPost)
              setRelatedPosts(
                (blogSeedData as BlogPost[])
                  .filter(p => p.slug !== slug)
                  .slice(0, 3)
              )
            }
          } else {
            throw new Error('Failed to fetch blog')
          }
          return
        }

        const data = await response.json()
        setPost(data)

        // Fetch related posts (all blogs, then filter)
        const allBlogsResponse = await fetch('/api/blogs')
        if (allBlogsResponse.ok) {
          const allBlogs = await allBlogsResponse.json()
          setRelatedPosts(
            allBlogs
              .filter((b: BlogPost) => b.slug !== slug)
              .slice(0, 3)
          )
        }
      } catch (err) {
        console.error('Error fetching blog:', err)
        setError('Gagal memuat artikel. Menggunakan data lokal.')
        // Fallback to static data
        const staticPost = (blogSeedData as BlogPost[]).find(p => p.slug === slug)
        if (staticPost) {
          setPost(staticPost)
          setRelatedPosts(
            (blogSeedData as BlogPost[])
              .filter(p => p.slug !== slug)
              .slice(0, 3)
          )
        } else {
          setNotFound(true)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [slug])

  // Simple markdown to HTML conversion
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="font-display text-3xl font-bold text-slate-900 mb-6 mt-8">{line.slice(2)}</h1>
        if (line.startsWith('## ')) return <h2 key={i} className="font-display text-2xl font-bold text-slate-800 mb-4 mt-8">{line.slice(3)}</h2>
        if (line.startsWith('### ')) return <h3 key={i} className="font-display text-xl font-semibold text-slate-800 mb-3 mt-6">{line.slice(4)}</h3>
        if (line.startsWith('- ')) return <li key={i} className="ml-6 mb-2 text-slate-600">{line.slice(2)}</li>
        if (line.startsWith('1. ')) return <li key={i} className="ml-6 mb-2 text-slate-600 list-decimal">{line.slice(3)}</li>
        if (line.startsWith('❌ ')) return <li key={i} className="ml-6 mb-2 text-red-600 font-medium">{line.slice(2)}</li>
        if (line.startsWith('✅ ')) return <li key={i} className="ml-6 mb-2 text-green-600 font-medium">{line.slice(2)}</li>
        if (line.trim() === '') return <br key={i} />
        if (!line.startsWith('<')) return <p key={i} className="text-slate-600 leading-relaxed mb-4">{line}</p>
        return null
      })
  }

  if (loading) {
    return (
      <section className="min-h-screen pt-32 pb-20">
        <div className="section-container text-center">
          <div className="animate-pulse">
            <div className="h-6 w-32 bg-slate-200 rounded mx-auto mb-6" />
            <div className="h-10 w-96 bg-slate-200 rounded mx-auto mb-4" />
            <div className="h-4 w-64 bg-slate-200 rounded mx-auto" />
          </div>
        </div>
      </section>
    )
  }

  if (notFound || !post) {
    return (
      <section className="min-h-screen pt-32 pb-20">
        <div className="section-container text-center">
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-4">Artikel Tidak Ditemukan</h1>
          <p className="text-slate-500 mb-8">
            {error || 'Maaf, artikel yang Anda cari tidak ada.'}
          </p>
          <Link href="/blog" className="btn-primary">
            Kembali ke Blog
          </Link>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-white via-primary-50/40 to-warm-50/20">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl" />
        </div>
        <div className="section-container relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 transition-colors">
            <ArrowLeft size={16} />
            Kembali ke Blog
          </Link>
          <div className="max-w-3xl">
            <span className="inline-flex px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
              {post.category}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <User size={14} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{formatDate(post.createdAt || post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>{post.readTime || '5 min'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image */}
      <section className="relative -mt-8">
        <div className="section-container">
          <div className="relative aspect-[2/1] rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
            <Image
              src={getCoverImage(post)}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="section-container">
          <article className="max-w-3xl mx-auto prose prose-lg prose-slate prose-headings:font-display prose-headings:font-bold prose-a:text-primary-600 hover:prose-a:text-primary-700">
            {renderContent(post.content)}
          </article>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="section-padding bg-surface-50">
          <div className="section-container">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-8">Artikel Terkait</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="card group overflow-hidden p-0">
                  <div className="relative aspect-[4/3] -mx-6 -mt-6 mb-4">
                    <Image
                      src={getCoverImage(relatedPost)}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-0 px-6">
                    <span className="text-xs text-primary-600 font-medium">{relatedPost.category}</span>
                    <h3 className="font-display text-lg font-bold text-slate-800 mt-1 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{relatedPost.excerpt}</p>
                    <span className="inline-flex items-center gap-1 text-primary-600 text-sm font-medium mt-4">
                      Baca Selengkapnya <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-primary-500">
        <div className="section-container text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Konsultasi dengan Dokter Kami
          </h2>
          <p className="text-primary-100 mb-8 max-w-xl mx-auto">
            Punya pertanyaan lebih lanjut tentang kesehatan gigi? Tim dokter kami siap membantu.
          </p>
          <Link href="/booking" className="btn-warm">
            Booking Sekarang
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}
