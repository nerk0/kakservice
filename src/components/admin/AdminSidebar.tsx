'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin', label: 'Översikt', icon: '◈' },
  { href: '/admin/lag', label: 'Lag', icon: '⚑' },
  { href: '/admin/produkter', label: 'Produkter', icon: '◉' },
  { href: '/admin/bestallningar', label: 'Beställningar', icon: '◎' },
  { href: '/admin/anvandare', label: 'Användare', icon: '◯' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="w-56 flex flex-col min-h-screen shrink-0"
      style={{ background: 'var(--color-forest)', color: '#fff' }}
    >
      {/* Logo */}
      <div className="px-5 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🍪</span>
          <div>
            <p className="font-display font-bold text-sm tracking-tight">KakKampanjen</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {links.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.55)',
              }}
            >
              <span style={{ fontSize: '1rem', opacity: active ? 1 : 0.6 }}>{link.icon}</span>
              {link.label}
              {active && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: '#d4a84b' }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/logga-in' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          <span>↪</span>
          Logga ut
        </button>
      </div>
    </aside>
  )
}
