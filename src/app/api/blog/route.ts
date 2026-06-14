import { NextResponse } from 'next/server'
import blogData from '@/lib/db/blogs-seed.json'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const id = searchParams.get('id')

  try {
    // If requesting a single blog by slug
    if (slug) {
      const blog = blogData.find((b) => b.slug === slug)
      if (!blog) {
        return NextResponse.json(
          { error: 'Blog not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(blog)
    }

    // If requesting a single blog by id
    if (id) {
      const blog = blogData.find((b) => b.id === id)
      if (!blog) {
        return NextResponse.json(
          { error: 'Blog not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(blog)
    }

    // Return all blogs
    return NextResponse.json(blogData)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}
