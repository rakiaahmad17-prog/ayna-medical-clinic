/**
 * Secure Authentication Utilities for Ayna Clinic Dashboard
 *
 * Features:
 * - Secure session tokens using crypto.randomBytes
 * - HTTP-only, secure, sameSite cookies
 * - CSRF protection
 * - Session validation
 */

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Session configuration
const SESSION_COOKIE_NAME = 'ayna_session'
const CSRF_COOKIE_NAME = 'ayna_csrf'
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
const TOKEN_BYTES = 64

// In-memory session store (use Supabase/Redis in production)
interface Session {
  token: string
  createdAt: number
  expiresAt: number
  userId: string
}

// Simple in-memory session storage
// In production, consider using Supabase or Redis
const sessions = new Map<string, Session>()

/**
 * Generate a secure random token using crypto.randomBytes
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(TOKEN_BYTES).toString('hex')
}

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Hash a token for storage/comparison
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

/**
 * Create a new session and return the session token
 */
export async function createSession(userId: string): Promise<string> {
  const token = generateSecureToken()
  const now = Date.now()

  const session: Session = {
    token: hashToken(token),
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
    userId
  }

  // Store session (in-memory for now)
  sessions.set(session.token, {
    ...session,
    token: session.token // Store the hashed token as key
  })

  return token
}

/**
 * Validate a session token
 */
export async function validateSession(token: string): Promise<Session | null> {
  const hashedToken = hashToken(token)
  const session = sessions.get(hashedToken)

  if (!session) {
    return null
  }

  // Check if session has expired
  if (Date.now() > session.expiresAt) {
    sessions.delete(hashedToken)
    return null
  }

  return session
}

/**
 * Delete a session (logout)
 */
export async function deleteSession(token: string): Promise<void> {
  const hashedToken = hashToken(token)
  sessions.delete(hashedToken)
}

/**
 * Get session cookie options
 */
export function getSessionCookieOptions(isSecure: boolean = true) {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: isSecure,
    sameSite: 'strict' as const,
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000, // Convert to seconds
  }
}

/**
 * Get CSRF cookie options
 */
export function getCsrfCookieOptions(isSecure: boolean = true) {
  return {
    name: CSRF_COOKIE_NAME,
    httpOnly: false, // Must be readable by JavaScript for double-submit
    secure: isSecure,
    sameSite: 'strict' as const,
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  }
}

/**
 * Set session cookie (for API routes)
 */
export async function setSessionCookie(token: string, isSecure: boolean = true): Promise<void> {
  const cookieStore = await cookies()
  const options = getSessionCookieOptions(isSecure)

  cookieStore.set(options.name, token, {
    httpOnly: options.httpOnly,
    secure: options.secure,
    sameSite: options.sameSite,
    path: options.path,
    maxAge: options.maxAge,
  })
}

/**
 * Set CSRF cookie
 */
export async function setCsrfCookie(token: string, isSecure: boolean = true): Promise<void> {
  const cookieStore = await cookies()
  const options = getCsrfCookieOptions(isSecure)

  cookieStore.set(options.name, token, {
    httpOnly: options.httpOnly,
    secure: options.secure,
    sameSite: options.sameSite,
    path: options.path,
    maxAge: options.maxAge,
  })
}

/**
 * Get session token from cookies (for API routes)
 */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value || null
}

/**
 * Get CSRF token from cookies
 */
export async function getCsrfToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(CSRF_COOKIE_NAME)?.value || null
}

/**
 * Validate CSRF token (double-submit cookie pattern)
 */
export function validateCsrfToken(cookieToken: string | null, headerToken: string | null): boolean {
  if (!cookieToken || !headerToken) {
    return false
  }
  return crypto.timingSafeEqual(
    Buffer.from(cookieToken),
    Buffer.from(headerToken)
  )
}

/**
 * Admin credentials validation
 * In production, these should be stored in environment variables or Supabase
 */
export function validateCredentials(password: string): { valid: boolean; userId: string } {
  // Get admin credentials from environment variables
  const adminPassword = process.env.DASHBOARD_ADMIN_PASSWORD || process.env.NEXT_PUBLIC_DASHBOARD_ADMIN_PASSWORD

  // If no admin password is set, use a secure default (should be changed in production)
  const validPassword = adminPassword || 'ayna2026secure'

  if (password === validPassword) {
    return { valid: true, userId: 'admin' }
  }

  return { valid: false, userId: '' }
}

/**
 * Clear session cookie (for logout)
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
  cookieStore.delete(CSRF_COOKIE_NAME)
}

// Export constants for use in other files
export const SESSION_COOKIE = SESSION_COOKIE_NAME
export const CSRF_COOKIE = CSRF_COOKIE_NAME