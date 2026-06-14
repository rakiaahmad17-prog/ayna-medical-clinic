/**
 * Authentication API Routes
 *
 * Handles:
 * - POST /api/auth/login - Login with password
 * - POST /api/auth/logout - Logout and clear session
 * - GET /api/auth/session - Validate current session
 * - GET /api/auth/csrf - Get CSRF token
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  createSession,
  validateSession,
  deleteSession,
  setSessionCookie,
  setCsrfCookie,
  clearSessionCookie,
  getSessionToken,
  generateCsrfToken,
  validateCredentials,
  SESSION_COOKIE,
  CSRF_COOKIE,
} from '@/lib/auth'

/**
 * GET /api/auth - Get CSRF token or validate session
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') || 'csrf'

  try {
    if (action === 'csrf') {
      // Return CSRF token
      const csrfToken = generateCsrfToken()
      const response = NextResponse.json({ csrfToken })
      response.cookies.set(CSRF_COOKIE, csrfToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      })
      return response
    }

    if (action === 'session') {
      // Validate current session
      const token = request.cookies.get(SESSION_COOKIE)?.value
      if (!token) {
        return NextResponse.json({ authenticated: false })
      }

      const session = await validateSession(token)
      if (!session) {
        return NextResponse.json({ authenticated: false })
      }

      return NextResponse.json({
        authenticated: true,
        userId: session.userId,
        expiresAt: session.expiresAt,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Auth GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/auth - Login or logout
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, password, csrfToken } = body

    if (action === 'login') {
      // Validate CSRF token
      const cookieCsrf = request.cookies.get(CSRF_COOKIE)?.value
      if (!csrfToken || csrfToken !== cookieCsrf) {
        return NextResponse.json(
          { error: 'Invalid CSRF token' },
          { status: 403 }
        )
      }

      // Validate credentials
      if (!password) {
        return NextResponse.json(
          { error: 'Password is required' },
          { status: 400 }
        )
      }

      const { valid, userId } = validateCredentials(password)
      if (!valid) {
        return NextResponse.json(
          { error: 'Password salah' },
          { status: 401 }
        )
      }

      // Create session
      const token = await createSession(userId)
      const csrfTokenValue = generateCsrfToken()

      const response = NextResponse.json({
        success: true,
        message: 'Login berhasil',
      })

      // Set session cookie
      response.cookies.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      })

      // Set CSRF cookie for future requests
      response.cookies.set(CSRF_COOKIE, csrfTokenValue, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      })

      return response
    }

    if (action === 'logout') {
      const token = request.cookies.get(SESSION_COOKIE)?.value

      if (token) {
        await deleteSession(token)
      }

      const response = NextResponse.json({
        success: true,
        message: 'Logout berhasil',
      })

      // Clear cookies
      response.cookies.delete(SESSION_COOKIE)
      response.cookies.delete(CSRF_COOKIE)

      return response
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Auth POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
