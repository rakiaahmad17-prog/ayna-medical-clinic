import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'

export const metadata: Metadata = {
  title: {
    default: 'Klinik AYNA Medical Clinic (AMC) | Dokter Gigi Terpercaya di Makassar',
    template: '%s | Klinik AYNA Medical Clinic (AMC)',
  },
  description:
    'Klinik AYNA Medical Clinic (AMC) - Klinik dokter gigi terpercaya di Makassar dengan dokter berpengalaman. Layanan scaling, tambal, behel, pemutihan, dan perawatan gigi. Buat janji temu sekarang!',
  keywords: ['klinik gigi makassar', 'dokter gigi makassar', 'scaling gigi', 'behel makassar', 'perawatan gigi', 'ayna medical clinic', 'AMC'],
  authors: [{ name: 'Klinik AYNA Medical Clinic (AMC)' }],
  openGraph: {
    title: 'Klinik AYNA Medical Clinic (AMC) | Dokter Gigi Terpercaya di Makassar',
    description: 'Klinik dokter gigi modern dengan dokter berpengalaman di Makassar.',
    type: 'website',
    locale: 'id_ID',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="icon" href="/images/logo.png" />
      </head>
      <body className="font-body antialiased bg-white text-slate-800">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}