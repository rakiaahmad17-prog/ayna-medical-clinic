/**
 * Blog API Routes
 * Handles CRUD operations for blog posts
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  getAllBlogs,
  getPublishedBlogs,
  getBlogById,
  getBlogBySlug,
  getBlogsByCategory,
  searchBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  initializeBlogs,
  getRelatedPosts,
  generateSlug,
  BlogPost,
} from '@/lib/db-blogs'

// Initialize blogs on first request
let initialized = false
function ensureInitialized() {
  if (!initialized) {
    initializeBlogs()
    initialized = true
  }
}

// GET /api/blogs - Get all blogs
export async function GET(request: NextRequest) {
  ensureInitialized()

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const slug = searchParams.get('slug')
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const related = searchParams.get('related')
  const relatedId = searchParams.get('relatedId')
  const categories = searchParams.get('categories')

  // Get single blog by ID
  if (id) {
    const blog = getBlogById(id)
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }
    return NextResponse.json(blog)
  }

  // Get single blog by slug
  if (slug) {
    const blog = getBlogBySlug(slug)
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }
    return NextResponse.json(blog)
  }

  // Get categories only
  if (categories === 'true') {
    const allCategories = [...new Set(getAllBlogs().map(b => b.category))]
    return NextResponse.json(allCategories)
  }

  // Get related posts
  if (related === 'true' && relatedId) {
    const currentBlog = getBlogById(relatedId)
    if (currentBlog) {
      const related = getRelatedPosts(relatedId, currentBlog.category)
      return NextResponse.json(related)
    }
  }

  // Filter by category
  if (category) {
    const blogs = getBlogsByCategory(category)
    return NextResponse.json(blogs)
  }

  // Search blogs
  if (search) {
    const blogs = searchBlogs(search)
    return NextResponse.json(blogs)
  }

  // Get all published blogs
  const blogs = getPublishedBlogs()
  return NextResponse.json(blogs)
}

// POST /api/blogs - Create new blog
export async function POST(request: NextRequest) {
  ensureInitialized()

  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.content || !body.category || !body.author) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, category, author' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const slug = body.slug || generateSlug(body.title)

    // Check for duplicate slug
    if (getBlogBySlug(slug)) {
      return NextResponse.json(
        { error: 'Slug already exists. Please use a different slug.' },
        { status: 400 }
      )
    }

    const newBlog = createBlog({
      title: body.title,
      slug,
      excerpt: body.excerpt || '',
      content: body.content,
      category: body.category,
      author: body.author,
      featuredImage: body.featuredImage || '/images/blog/default.jpg',
      published: body.published ?? true,
    })

    return NextResponse.json(newBlog, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    )
  }
}

// PUT /api/blogs - Update blog
export async function PUT(request: NextRequest) {
  ensureInitialized()

  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      )
    }

    // Check if blog exists
    const existing = getBlogById(body.id)
    if (!existing) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    // Check for duplicate slug if changing
    if (body.slug && body.slug !== existing.slug) {
      const slugExists = getBlogBySlug(body.slug)
      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists. Please use a different slug.' },
          { status: 400 }
        )
      }
    }

    const updatedBlog = updateBlog(body.id, body)

    if (!updatedBlog) {
      return NextResponse.json(
        { error: 'Failed to update blog' },
        { status: 500 }
      )
    }

    return NextResponse.json(updatedBlog)
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    )
  }
}

// DELETE /api/blogs - Delete blog
export async function DELETE(request: NextRequest) {
  ensureInitialized()

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Blog ID is required' },
      { status: 400 }
    )
  }

  const success = deleteBlog(id)

  if (!success) {
    return NextResponse.json(
      { error: 'Blog not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true, message: 'Blog deleted successfully' })
}
