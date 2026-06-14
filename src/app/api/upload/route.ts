import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = `${timestamp}-${randomString}.${extension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(`blogs/${filename}`, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('Supabase upload error:', error)
      // Fallback to local storage if Supabase fails
      return uploadLocally(file, filename, buffer)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(`blogs/${filename}`)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      filename: filename,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

// Fallback local upload function
async function uploadLocally(file: File, filename: string, buffer: Buffer) {
  try {
    const { writeFile, mkdir } = await import('fs/promises')
    const { existsSync } = await import('fs')
    const path = await import('path')

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blogs')

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)

    const publicUrl = `/uploads/blogs/${filename}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
      size: file.size,
      type: file.type,
      storage: 'local'
    })
  } catch (error) {
    console.error('Local upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
