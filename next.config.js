/** @type {import('next').NextConfig} */
const nextConfig = {
  // ============================================
  // SECURITY HEADERS
  // ============================================
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Strict CSP in production, relaxed in development
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://picsum.photos https://images.unsplash.com https://*.supabase.co blob:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // XSS Protection (legacy but still useful for older browsers)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions Policy - restrict sensitive features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Cache control for sensitive data
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          // Strict Transport Security (enable HTTPS only)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
      // API routes specific headers
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_APP_URL || '',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-CSRF-Token, X-Requested-With',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },

  // ============================================
  // IMAGE OPTIMIZATION SECURITY
  // ============================================
  images: {
    // Only allow images from trusted sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Supabase storage
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Restrict image formats
    formats: ['image/avif', 'image/webp'],
    // Minimum image dimensions
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },

  // ============================================
  // SERVER EXTERNAL PACKAGES (Next.js 14.3+)
  // ============================================
  // serverExternalPackages: ['jsdom'],

  // ============================================
  // ENVIRONMENT VARIABLE VALIDATION
  // ============================================
  env: {
    // Define which env vars are exposed to client
    // Never expose secrets!
  },

  // ============================================
  // TRAILING SLASH CONFIGURATION
  // ============================================
  trailingSlash: false,

  // ============================================
  // RESPONSE HEADER CONFIGURATION
  // ============================================
  async redirects() {
    return [
      // Add any necessary redirects here
    ]
  },

  // ============================================
  // POWERED BY HEADER (OPTIONAL)
  // ============================================
  poweredByHeader: false, // Hide Next.js version information

  // ============================================
  // COMPRESSION
  // ============================================
  compress: true,

  // ============================================
  // EXPERIMENTAL FEATURES
  // ============================================
  experimental: {
    // Enable server actions security
    serverActions: {
      allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['localhost:3000'],
    },
  },
}

module.exports = nextConfig