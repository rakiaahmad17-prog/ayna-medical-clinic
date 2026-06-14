/**
 * Input Sanitization Utilities
 *
 * Provides comprehensive sanitization for user inputs to prevent:
 * - XSS (Cross-Site Scripting)
 * - SQL Injection
 * - Command Injection
 * - Path Traversal
 * - NoSQL Injection
 */

import { JSDOM } from 'jsdom'

// ============================================
// HTML SANITIZATION
// ============================================

// Allowed HTML tags and their attributes
const ALLOWED_TAGS = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'ul', 'ol', 'li',
  'strong', 'b', 'em', 'i', 'u', 's',
  'a', 'img',
  'blockquote', 'code', 'pre',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
])

const ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  img: new Set(['src', 'alt', 'width', 'height']),
  td: new Set(['colspan', 'rowspan']),
  th: new Set(['colspan', 'rowspan', 'scope']),
}

const DANGEROUS_PROTOCOLS = ['javascript:', 'vbscript:', 'data:']
const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:']

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes dangerous tags, attributes, and protocols
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return ''

  try {
    const dom = new JSDOM(html)
    const window = dom.window
    const document = window.document
    const element = document.body

    // Recursively sanitize all child nodes
    sanitizeNode(element, window)

    return element.innerHTML
  } catch {
    // If parsing fails, escape HTML entities
    return escapeHtml(html)
  }
}

function sanitizeNode(node: Node, _window: unknown): void {
  const ELEMENT_NODE = 1 // Node.ELEMENT_NODE constant

  if (node.nodeType === ELEMENT_NODE) {
    const element = node as Element

    // Check if tag is allowed
    const tagName = element.tagName.toLowerCase()
    if (!ALLOWED_TAGS.has(tagName)) {
      // Replace with text content
      const text = document.createTextNode(element.textContent || '')
      element.parentNode?.replaceChild(text, element)
      return
    }

    // Sanitize attributes
    const allowedAttrs = ALLOWED_ATTRIBUTES[tagName] || new Set()
    const attributesToRemove: string[] = []

    for (const attr of Array.from(element.attributes)) {
      const attrName = attr.name.toLowerCase()

      // Check if attribute is allowed
      if (!allowedAttrs.has(attrName)) {
        attributesToRemove.push(attr.name)
        continue
      }

      // Validate attribute values
      const value = attr.value

      if (attrName === 'href' || attrName === 'src') {
        // Validate URLs
        if (!isValidUrl(value)) {
          attributesToRemove.push(attr.name)
          continue
        }
      }
    }

    // Remove dangerous attributes
    attributesToRemove.forEach(name => element.removeAttribute(name))

    // Add rel="noopener noreferrer" to external links
    if (tagName === 'a' && element.getAttribute('href')) {
      const href = element.getAttribute('href') || ''
      if (href.startsWith('http') || href.startsWith('//')) {
        element.setAttribute('rel', 'noopener noreferrer nofollow')
        element.setAttribute('target', '_blank')
      }
    }
  }

  // Recursively process children
  const children = Array.from(node.childNodes)
  children.forEach(child => sanitizeNode(child, _window))
}

function isValidUrl(url: string): boolean {
  if (!url) return false

  try {
    // Check for dangerous protocols
    const lowerUrl = url.toLowerCase()
    for (const protocol of DANGEROUS_PROTOCOLS) {
      if (lowerUrl.startsWith(protocol)) return false
    }

    // Allow relative URLs
    if (url.startsWith('/') || url.startsWith('#')) return true

    // Validate absolute URLs
    const parsed = new URL(url)
    return ALLOWED_PROTOCOLS.includes(parsed.protocol)
  } catch {
    return false
  }
}

// ============================================
// STRING SANITIZATION
// ============================================

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  if (!text || typeof text !== 'string') return ''

  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  }

  return text.replace(/[&<>"'`=/]/g, char => escapeMap[char] || char)
}

/**
 * Strip all HTML tags from text
 */
export function stripHtml(html: string): string {
  if (!html || typeof html !== 'string') return ''

  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
}

/**
 * Normalize whitespace and trim
 */
export function normalizeWhitespace(text: string): string {
  if (!text || typeof text !== 'string') return ''

  return text
    .replace(/\s+/g, ' ')
    .trim()
}

// ============================================
// INPUT VALIDATION
// ============================================

/**
 * Validate and sanitize email address
 */
export function sanitizeEmail(email: string): string | null {
  if (!email || typeof email !== 'string') return null

  const normalized = email.toLowerCase().trim()

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(normalized)) return null

  // Check for suspicious patterns
  if (containsSuspiciousPattern(normalized)) return null

  return normalized
}

/**
 * Validate and sanitize phone number (Indonesian format)
 */
export function sanitizePhone(phone: string): string | null {
  if (!phone || typeof phone !== 'string') return null

  // Remove all non-digit characters except + at the start
  let cleaned = phone.trim()
  const hasPlus = cleaned.startsWith('+')
  cleaned = cleaned.replace(/\D/g, '')

  if (hasPlus) cleaned = '+' + cleaned

  // Indonesian phone numbers are typically 10-14 digits
  if (cleaned.replace(/\D/g, '').length < 10 || cleaned.replace(/\D/g, '').length > 15) {
    return null
  }

  return cleaned
}

/**
 * Sanitize URL slug
 */
export function sanitizeSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') return ''

  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')  // Replace non-alphanumeric with hyphen
    .replace(/-+/g, '-')           // Collapse multiple hyphens
    .replace(/^-|-$/g, '')         // Remove leading/trailing hyphens
    .slice(0, 100)                 // Limit length
}

/**
 * Sanitize file name
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName || typeof fileName !== 'string') return ''

  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_')  // Replace special chars with underscore
    .replace(/_+/g, '_')               // Collapse multiple underscores
    .slice(0, 255)                     // Limit length
}

// ============================================
// DANGEROUS PATTERN DETECTION
// ============================================

/**
 * Check for potentially dangerous patterns
 */
export function containsSuspiciousPattern(input: string): boolean {
  if (!input || typeof input !== 'string') return false

  const patterns = [
    // SQL keywords
    /\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE|XP_)\b/i,
    // Shell commands
    /[;&|`$]/,
    // Template injection
    /\{\{.*\}\}|\{%.*%\}/,
    // Null bytes
    /\x00/,
    // UTF-8 BOM
    /﻿/,
    // Control characters
    /[\x00-\x1F\x7F]/,
    // Potential XSS
    /<script|javascript:|on\w+=/i,
    // Path traversal
    /\.\.\/|\.\.\\/,
  ]

  return patterns.some(pattern => pattern.test(input))
}

/**
 * Detect SQL injection attempts
 */
export function detectSqlInjection(input: string): boolean {
  if (!input || typeof input !== 'string') return false

  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE)\b)/i,
    /(--|;|\/\*|\*\/|@@|@)/,
    /(OR|AND)\s+\d+\s*=\s*\d+/i,
    /'\s*(OR|AND)\s+'/i,
    /UNION\s+(ALL\s+)?SELECT/i,
    /INTO\s+(OUTFILE|DUMPFILE)/i,
  ]

  return sqlPatterns.some(pattern => pattern.test(input))
}

/**
 * Detect potential XSS patterns
 */
export function detectXss(input: string): boolean {
  if (!input || typeof input !== 'string') return false

  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<link/i,
    /<style/i,
    /expression\s*\(/i,
    /url\s*\(/i,
    /import\s+/i,
  ]

  return xssPatterns.some(pattern => pattern.test(input))
}

// ============================================
// DATA TYPE VALIDATION
// ============================================

/**
 * Validate that a value is a safe string within length limits
 */
export function validateString(
  value: unknown,
  options: {
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    allowEmpty?: boolean
  } = {}
): { valid: boolean; value?: string; error?: string } {
  const { minLength = 0, maxLength = 10000, pattern, allowEmpty = false } = options

  if (value === null || value === undefined) {
    return allowEmpty ? { valid: true, value: '' } : { valid: false, error: 'Value is required' }
  }

  if (typeof value !== 'string') {
    return { valid: false, error: 'Value must be a string' }
  }

  const trimmed = value.trim()

  if (!allowEmpty && trimmed.length < minLength) {
    return { valid: false, error: `Minimum length is ${minLength} characters` }
  }

  if (trimmed.length > maxLength) {
    return { valid: false, error: `Maximum length is ${maxLength} characters` }
  }

  if (pattern && !pattern.test(trimmed)) {
    return { valid: false, error: 'Value does not match required format' }
  }

  if (!allowEmpty && containsSuspiciousPattern(trimmed)) {
    return { valid: false, error: 'Value contains suspicious patterns' }
  }

  return { valid: true, value: trimmed }
}

/**
 * Validate an object against a schema
 */
export function validateObject<T extends Record<string, unknown>>(
  obj: unknown,
  schema: Record<string, ValidationRule>
): { valid: boolean; data?: T; errors?: Record<string, string> } {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return { valid: false, errors: { _form: 'Invalid data format' } }
  }

  const data = obj as T
  const errors: Record<string, string> = {}

  for (const [key, rule] of Object.entries(schema)) {
    const result = rule.validate(data[key])
    if (!result.valid) {
      errors[key] = result.error || 'Invalid value'
    }
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors }
  }

  return { valid: true, data }
}

interface ValidationRule {
  validate: (value: unknown) => { valid: boolean; error?: string }
}

export function stringRule(options: Parameters<typeof validateString>[1] = {}): ValidationRule {
  return {
    validate: (value) => validateString(value, options),
  }
}

export function requiredString(message = 'This field is required'): ValidationRule {
  return stringRule({ minLength: 1, maxLength: 10000, allowEmpty: false })
}

export function emailRule(message = 'Invalid email address'): ValidationRule {
  return {
    validate: (value) => {
      const result = validateString(value, { minLength: 5, maxLength: 254 })
      if (!result.valid) return result

      const email = sanitizeEmail(result.value!)
      if (!email) return { valid: false, error: message }

      return { valid: true, value: email }
    },
  }
}

export function phoneRule(message = 'Invalid phone number'): ValidationRule {
  return {
    validate: (value) => {
      const result = validateString(value, { minLength: 10, maxLength: 20 })
      if (!result.valid) return result

      const phone = sanitizePhone(result.value!)
      if (!phone) return { valid: false, error: message }

      return { valid: true, value: phone }
    },
  }
}

// ============================================
// EXPORTS
// ============================================

export const sanitize = {
  html: sanitizeHtml,
  escape: escapeHtml,
  stripHtml,
  whitespace: normalizeWhitespace,
  email: sanitizeEmail,
  phone: sanitizePhone,
  slug: sanitizeSlug,
  fileName: sanitizeFileName,
}

export const validate = {
  string: validateString,
  object: validateObject,
  isSuspicious: containsSuspiciousPattern,
  detectSqlInjection,
  detectXss,
}

export const rules = {
  string: stringRule,
  requiredString,
  email: emailRule,
  phone: phoneRule,
}