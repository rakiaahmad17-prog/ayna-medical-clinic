/**
 * Next.js Middleware for Dashboard Route Protection
 *
 * Protects /dashboard routes and redirects unauthenticated users to login
 * Uses Edge Runtime compatible code (no crypto module)
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Session cookie name (must match auth.ts)
const SESSION_COOKIE = 'ayna_session'

/**
 * Paths that don't require authentication
 */
const publicPaths = [
  '/dashboard/login',
]

/**
 * Check if a path is public (doesn't require auth)
 */
function isPublicPath(path: string): boolean {
  return publicPaths.some(publicPath => path.startsWith(publicPath))
}

/**
 * Check if a path requires authentication
 */
function requiresAuth(path: string): boolean {
  return path.startsWith('/dashboard') && !isPublicPath(path)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect dashboard routes
  if (!requiresAuth(pathname)) {
    return NextResponse.next()
  }

  // Get session token from cookie
  const token = request.cookies.get(SESSION_COOKIE)?.value

  if (!token) {
    // No token - redirect to login
    const loginUrl = new URL('/dashboard/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Basic token validation (check format)
  // Token should be a 128-character hex string (64 bytes)
  const isValidTokenFormat = /^[a-f0-9]{128}$/i.test(token)

  if (!isValidTokenFormat) {
    // Invalid token format - redirect to login
    const loginUrl = new URL('/dashboard/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    const response = NextResponse.redirect(loginUrl)

    // Clear invalid cookie
    response.cookies.delete(SESSION_COOKIE)

    return response
  }

  // For full session validation, we need to check with the API
  // But since we're in middleware (Edge Runtime), we can't use Node.js crypto
  // So we do a lightweight check and let the API route handle full validation

  // Note: In production, consider using a stateless JWT or external session store
  // that can be validated in Edge Runtime

  // Valid session - allow request
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/dashboard/:path*',
  ],
}
