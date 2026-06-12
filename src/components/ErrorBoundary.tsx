'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          backgroundColor: '#f8fafc',
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '400px',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
            }}>
              😔
            </div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '0.5rem',
            }}>
              Maaf, terjadi kesalahan
            </h1>
            <p style={{
              color: '#64748b',
              marginBottom: '1.5rem',
            }}>
              Halaman ini gagal dimuat. Silakan coba beberapa saat lagi atau refresh halaman.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#14b8a6',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              🔄 Refresh Halaman
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}