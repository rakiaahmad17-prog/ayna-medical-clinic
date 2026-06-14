'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Lock, Eye, EyeOff, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react'

const SESSION_COOKIE = 'ayna_session'

// Loading fallback component
function LoginFormSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-200 animate-pulse mx-auto mb-4" />
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mx-auto" />
          <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mx-auto mt-2" />
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-14 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-12 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}

// Actual login form component
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [csrfToken, setCsrfToken] = useState<string | null>(null)

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth?action=session')
        const data = await response.json()
        if (data.authenticated) {
          router.push(redirect)
        }
      } catch {
        // Not authenticated, stay on login page
      }
    }

    // Get CSRF token
    const getCsrf = async () => {
      try {
        const response = await fetch('/api/auth?action=csrf')
        const data = await response.json()
        setCsrfToken(data.csrfToken)
      } catch {
        // Generate client-side CSRF token as fallback
        setCsrfToken(crypto.randomUUID())
      }
    }

    checkAuth()
    getCsrf()
  }, [router, redirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!csrfToken) {
      setError('CSRF token tidak tersedia. Silakan refresh halaman.')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          password,
          csrfToken,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300))
        router.push(redirect)
      } else {
        setError(data.error || 'Login gagal')
        // Refresh CSRF token on error
        const newCsrfResponse = await fetch('/api/auth?action=csrf')
        const newCsrfData = await newCsrfResponse.json()
        setCsrfToken(newCsrfData.csrfToken)
      }
    } catch {
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <Image src="/images/logo.png" alt="Logo" width={64} height={64} className="w-16 h-16 rounded-2xl bg-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <ShieldCheck size={14} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Login</h1>
          <p className="text-slate-500 mt-2">Masuk ke panel admin</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <ShieldCheck size={16} className="text-teal-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-500">
                Login dilindungi dengan CSRF token dan sesi terenkripsi
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !csrfToken}
              className="w-full bg-teal-500 text-white py-3 rounded-xl font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/beranda" className="text-sm text-teal-600 hover:text-teal-700 transition-colors">
            ← Kembali ke Website
          </Link>
        </div>
      </div>
    </div>
  )
}

// Main exported component with Suspense boundary
export default function DashboardLoginPage() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginForm />
    </Suspense>
  )
}