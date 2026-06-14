/**
 * Blog Database Utilities
 * Handles CRUD operations for blog posts using JSON file storage
 */

import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'src/lib/db/blogs.json')
const SEED_PATH = path.join(process.cwd(), 'src/lib/db/blogs-seed.json')

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  featuredImage: string
  createdAt: string
  updatedAt: string
  published: boolean
}

// Generate unique ID
function generateId(): string {
  return `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Read from database
function readDb(): BlogPost[] {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8')
      const parsed = JSON.parse(data)
      return parsed.blogs || []
    }
  } catch (error) {
    console.error('Error reading blog database:', error)
  }
  return []
}

// Write to database
function writeDb(blogs: BlogPost[]): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify({ blogs }, null, 2))
  } catch (error) {
    console.error('Error writing blog database:', error)
    throw error
  }
}

// Get all blogs
export function getAllBlogs(): BlogPost[] {
  return readDb()
}

// Get published blogs only
export function getPublishedBlogs(): BlogPost[] {
  return readDb().filter(blog => blog.published)
}

// Get blog by ID
export function getBlogById(id: string): BlogPost | undefined {
  return readDb().find(blog => blog.id === id)
}

// Get blog by slug
export function getBlogBySlug(slug: string): BlogPost | undefined {
  return readDb().find(blog => blog.slug === slug)
}

// Get blogs by category
export function getBlogsByCategory(category: string): BlogPost[] {
  return readDb().filter(blog => blog.category === category && blog.published)
}

// Search blogs
export function searchBlogs(query: string): BlogPost[] {
  const lowerQuery = query.toLowerCase()
  return readDb().filter(blog =>
    blog.published && (
      blog.title.toLowerCase().includes(lowerQuery) ||
      blog.excerpt.toLowerCase().includes(lowerQuery) ||
      blog.content.toLowerCase().includes(lowerQuery)
    )
  )
}

// Create new blog
export function createBlog(data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost {
  const blogs = readDb()
  const now = new Date().toISOString()

  const newBlog: BlogPost = {
    ...data,
    id: generateId(),
    slug: data.slug || generateSlug(data.title),
    createdAt: now,
    updatedAt: now,
  }

  blogs.unshift(newBlog)
  writeDb(blogs)

  return newBlog
}

// Update blog
export function updateBlog(id: string, data: Partial<BlogPost>): BlogPost | null {
  const blogs = readDb()
  const index = blogs.findIndex(blog => blog.id === id)

  if (index === -1) return null

  const updatedBlog = {
    ...blogs[index],
    ...data,
    id: blogs[index].id,
    createdAt: blogs[index].createdAt,
    updatedAt: new Date().toISOString(),
  }

  blogs[index] = updatedBlog
  writeDb(blogs)

  return updatedBlog
}

// Delete blog
export function deleteBlog(id: string): boolean {
  const blogs = readDb()
  const filtered = blogs.filter(blog => blog.id !== id)

  if (filtered.length === blogs.length) return false

  writeDb(filtered)
  return true
}

// Initialize with seed data if empty
export function initializeBlogs(): void {
  const blogs = readDb()
  if (blogs.length === 0) {
    try {
      if (fs.existsSync(SEED_PATH)) {
        const seedData = JSON.parse(fs.readFileSync(SEED_PATH, 'utf-8'))
        writeDb(seedData)
      }
    } catch (error) {
      console.error('Error initializing blogs:', error)
    }
  }
}

// Get related posts
export function getRelatedPosts(currentId: string, category: string, limit: number = 3): BlogPost[] {
  return readDb()
    .filter(blog => blog.id !== currentId && blog.category === category && blog.published)
    .slice(0, limit)
}

// Get all categories
export function getAllCategories(): string[] {
  const blogs = readDb()
  const categories = new Set(blogs.map(blog => blog.category))
  return Array.from(categories)
}
