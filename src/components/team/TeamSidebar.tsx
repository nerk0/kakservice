'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/team/dashboard', label: 'Översikt', icon: '📊' },
  { href: '/team/dashboard/bestallningar', label: 'Beställningar', icon: '📦' },
]

export function TeamSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-gray-900 text-white flex flex-col min-h-screen">
      <div className="p-5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <div>
            <p className="font-bold text-sm">Mitt lag</p>
            <p className="text-xs text-gray-400">Lagportal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              pathname === link.href
                ? 'bg-green-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            )}
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-700">
        <button
          onClick={() => signOut({ callbackUrl: '/auth/logga-in' })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <span>🚪</span>
          Logga ut
        </button>
      </div>
    </aside>
  )
}
