import type { Metadata } from 'next'
import { Fraunces, Figtree } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  axes: ['opsz', 'SOFT', 'WONK'],
  display: 'swap',
})

const figtree = Figtree({
  variable: '--font-figtree',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KakKampanjen – Stöd ditt lag',
  description: 'Köp kakor, knäckesticks och godis – 35 kr per burk går direkt till laget!',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={`${fraunces.variable} ${figtree.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
