import { NextRequest, NextResponse } from 'next/server'
import { supabase, Blog } from '@/lib/supabase'

// GET - Fetch all blogs or single blog
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get('slug')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const id = searchParams.get('id')
    const published = searchParams.get('published')
    const categories = searchParams.get('categories')

    // Get categories only
    if (categories === 'true') {
      const { data, error } = await supabase
        .from('blogs')
        .select('category')

      if (error) throw error

      const uniqueCategories = [...new Set(data?.map(b => b.category) || [])]
      return NextResponse.json(uniqueCategories)
    }

    // Get single blog by ID
    if (id) {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        return NextResponse.json(
          { error: 'Blog not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(data)
    }

    // Get single blog by slug
    if (slug) {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error || !data) {
        return NextResponse.json(
          { error: 'Blog not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(data)
    }

    // Build query
    let query = supabase.from('blogs').select('*')

    // Filter by category
    if (category) {
      query = query.eq('category', category)
    }

    // Filter by published status
    if (published === 'true') {
      query = query.eq('published', true)
    } else if (published === 'false') {
      query = query.eq('published', false)
    }

    // Search
    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

// POST - Create new blog
export async function POST(request: NextRequest) {
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
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Check for duplicate slug
    const { data: existing } = await supabase
      .from('blogs')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Slug already exists. Please use a different slug.' },
        { status: 400 }
      )
    }

    // Create the blog
    const { data, error } = await supabase
      .from('blogs')
      .insert({
        title: body.title,
        slug: slug,
        excerpt: body.excerpt || null,
        content: body.content,
        category: body.category,
        author: body.author,
        featured_image: body.featuredImage || body.featured_image || null,
        published: body.published ?? true
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    )
  }
}

// PUT - Update blog
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      )
    }

    // Check if blog exists
    const { data: existing } = await supabase
      .from('blogs')
      .select('id')
      .eq('id', body.id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      )
    }

    // Check for duplicate slug if changing
    if (body.slug) {
      const { data: slugExists } = await supabase
        .from('blogs')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', body.id)
        .single()

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists. Please use a different slug.' },
          { status: 400 }
        )
      }
    }

    // Update the blog
    const updateData: Partial<Blog> = {
      updated_at: new Date().toISOString()
    }

    if (body.title) updateData.title = body.title
    if (body.slug) updateData.slug = body.slug
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt
    if (body.content) updateData.content = body.content
    if (body.category) updateData.category = body.category
    if (body.author) updateData.author = body.author
    if (body.featuredImage !== undefined) updateData.featured_image = body.featuredImage
    if (body.featured_image !== undefined) updateData.featured_image = body.featured_image
    if (body.published !== undefined) updateData.published = body.published

    const { data, error } = await supabase
      .from('blogs')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    )
  }
}

// DELETE - Delete blog
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Blog deleted successfully' })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    )
  }
}
