# Security Documentation - Ayna Clinic

This document outlines all security measures implemented in the Ayna Clinic application.

## Table of Contents

1. [Security Headers](#security-headers)
2. [Rate Limiting](#rate-limiting)
3. [CSRF Protection](#csrf-protection)
4. [Input Sanitization](#input-sanitization)
5. [Session Management](#session-management)
6. [API Security](#api-security)
7. [Environment Variables](#environment-variables)
8. [Recommendations](#recommendations)

---

## Security Headers

All responses include security headers configured in `next.config.js` and `src/middleware.ts`:

### Content Security Policy (CSP)

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://picsum.photos https://images.unsplash.com blob:;
  connect-src 'self' https://*.supabase.co;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  object-src 'none';
  upgrade-insecure-requests
```

### Other Security Headers

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Frame-Options` | `DENY` | Prevents clickjacking attacks |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME type sniffing |
| `X-XSS-Protection` | `1; mode=block` | XSS protection for older browsers |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer information |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Restricts sensitive features |
| `Cache-Control` | `no-store, no-cache, must-revalidate` | Prevents caching of sensitive data |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Enforces HTTPS |

---

## Rate Limiting

Rate limiting is implemented in `src/middleware.ts` to prevent abuse:

### Rate Limit Tiers

| Endpoint | Max Requests | Window |
|----------|-------------|--------|
| `/api/auth/*` | 5 | 1 minute |
| `/api/upload/*` | 10 | 1 minute |
| `/api/*` (other) | 100 | 1 minute |
| All other routes | 200 | 1 minute |

### Rate Limit Headers

Responses include rate limit information:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in window
- `X-RateLimit-Reset`: Seconds until window resets

### Rate Limit Response

When rate limited, the API returns:
```json
{
  "error": "Too many requests. Please try again later."
}
```
With HTTP status `429` and `Retry-After` header.

---

## CSRF Protection

CSRF tokens are validated for state-changing operations (POST, PUT, PATCH, DELETE).

### Implementation

1. **Token Generation**: Hour-based tokens using session ID and secret
2. **Token Validation**: Tokens validated against current and previous hour
3. **Header Check**: Token must be present in `X-CSRF-Token` header

### Usage

```typescript
// Client-side: Include CSRF token in requests
fetch('/api/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
  },
  body: JSON.stringify(data),
})
```

### Security Notes

- Tokens are hour-based for automatic expiration
- Both current and previous hour tokens are valid (allows for clock skew)
- Requests without token are allowed but logged

---

## Input Sanitization

Input sanitization utilities are available in `src/lib/sanitize.ts`:

### Available Functions

#### HTML Sanitization
```typescript
import { sanitize } from '@/lib/sanitize'

// Sanitize HTML (removes dangerous tags/attributes)
const safeHtml = sanitize.html(userInput)

// Escape HTML entities
const escaped = sanitize.escape(userInput)

// Strip all HTML tags
const plainText = sanitize.stripHtml(userInput)
```

#### String Validation
```typescript
import { validate } from '@/lib/sanitize'

// Check for suspicious patterns
const isSuspicious = validate.isSuspicious(userInput)

// Detect SQL injection
const hasSqlInjection = validate.detectSqlInjection(userInput)

// Detect XSS patterns
const hasXss = validate.detectXss(userInput)
```

#### Data Type Validation
```typescript
import { validate, rules } from '@/lib/sanitize'

// Validate a string
const result = validate.string(value, {
  minLength: 1,
  maxLength: 100,
  pattern: /^[a-z]+$/,
})

// Use predefined rules
const emailResult = rules.email().validate(userEmail)
const phoneResult = rules.phone().validate(userPhone)
```

#### Object Validation
```typescript
import { validate, rules } from '@/lib/sanitize'

const schema = {
  name: rules.requiredString(),
  email: rules.email(),
  phone: rules.phone(),
}

const result = validate.object(formData, schema)
if (!result.valid) {
  console.log(result.errors)
}
```

### Sanitized Data Types

| Function | Purpose |
|----------|---------|
| `sanitize.email()` | Validates and normalizes email addresses |
| `sanitize.phone()` | Validates phone numbers (Indonesian format) |
| `sanitize.slug()` | Creates safe URL slugs |
| `sanitize.fileName()` | Sanitizes file names |

---

## Session Management

Session validation is handled by `src/lib/auth.ts`:

### Protected Routes

| Route Pattern | Requirement |
|---------------|-------------|
| `/dashboard/*` | Valid session required |
| `/api/admin/*` | Valid session + admin role |
| `/api/auth/*` | Public (no auth required) |

### Session Validation Flow

1. Check for `session_id` cookie
2. Validate session exists and not expired
3. For admin routes, verify `role === 'admin'`
4. Return appropriate error or allow request

### Session Response Codes

| Status | Meaning |
|--------|---------|
| 401 | Unauthorized - No valid session |
| 403 | Forbidden - Valid session but insufficient permissions |

---

## API Security

### CORS Configuration

API routes include CORS headers:
```javascript
Access-Control-Allow-Origin: <APP_URL>
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token, X-Requested-With
Access-Control-Allow-Credentials: true
```

### Request Validation

All API requests are validated for:
- **Content-Type**: Must be `application/json` for JSON bodies
- **Malicious patterns**: SQL injection, XSS, command injection
- **Query parameters**: Scanned for malicious content
- **Body fields**: Each field checked for dangerous patterns

### File Upload Security

The `/api/upload` endpoint includes:
- File type validation (only images allowed)
- File size limits (5MB max)
- Secure filename generation
- Content-Type verification

---

## Environment Variables

### Required Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Security
CSRF_SECRET=your-secure-csrf-secret
SESSION_SECRET=your-secure-session-secret

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com
ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com
```

### Security Best Practices

1. **Never commit secrets**: Add `.env.local` to `.gitignore`
2. **Use different keys for dev/prod**: Never share keys between environments
3. **Rotate secrets regularly**: Update keys periodically
4. **Use strong secrets**: Generate using `openssl rand -base64 32`

---

## Recommendations

### Immediate Actions

1. **Update CSRF_SECRET**: Generate a new secure secret
   ```bash
   openssl rand -base64 32
   ```

2. **Update SESSION_SECRET**: Generate a new session secret
   ```bash
   openssl rand -base64 32
   ```

3. **Configure ALLOWED_HOSTS**: Add your production domain
   ```env
   ALLOWED_HOSTS=ayna-clinic.com,www.ayna-clinic.com
   ```

### Production Hardening

1. **Enable strict CSP**: Remove `'unsafe-inline'` in production
2. **Add monitoring**: Implement logging for security events
3. **Enable audit logging**: Track authentication attempts
4. **Add WAF**: Consider Cloudflare or similar for additional protection
5. **Enable HTTPS**: Ensure SSL/TLS is properly configured

### Additional Security Measures

1. **Add request ID logging**: Track requests for investigation
2. **Implement honeypot fields**: Detect bots
3. **Add CAPTCHA**: For public forms (contact, booking)
4. **Enable 2FA**: For admin/dashboard access
5. **Regular security audits**: Review logs and update dependencies

---

## File Structure

```
ayna-clinic/
├── src/
│   ├── middleware.ts          # Security middleware
│   └── lib/
│       ├── sanitize.ts        # Input sanitization utilities
│       └── auth.ts            # Session management
├── next.config.js             # Security headers
├── SECURITY.md               # This documentation
└── .env.example              # Environment variable template
```

---

## Monitoring

### Security Events to Monitor

1. **Rate limit hits**: Multiple 429 responses from same IP
2. **CSRF failures**: 403 responses indicating token issues
3. **Authentication failures**: Repeated 401/403 responses
4. **Input validation failures**: Suspicious pattern detections
5. **Host validation failures**: Requests from unknown hosts

### Recommended Logging Format

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "event": "security.violation",
  "type": "rate_limit|csrf|input_validation|session",
  "ip": "192.168.1.1",
  "path": "/api/endpoint",
  "userAgent": "Mozilla/5.0...",
  "details": "Additional context"
}
```

---

## Support

For security concerns or questions, please contact the development team.

**Last Updated**: 2024
**Version**: 1.0.0
