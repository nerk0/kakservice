import Link from 'next/link'

export function SiteHeader({ teamName }: { teamName?: string }) {
  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: 'rgba(251,247,241,0.88)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-sand)',
      }}
    >
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl">🍪</span>
          <span
            className="font-display font-bold text-base tracking-tight"
            style={{ color: 'var(--color-forest)' }}
          >
            KakKampanjen
          </span>
        </Link>

        {teamName && (
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-xs" style={{ color: 'var(--color-charcoal)', opacity: 0.6 }}>
              för
            </span>
            <span
              className="font-display font-semibold text-sm truncate"
              style={{ color: 'var(--color-forest)' }}
            >
              {teamName}
            </span>
          </div>
        )}

        <Link
          href="/"
          className="shrink-0 text-sm font-medium transition-colors"
          style={{ color: 'var(--color-sage)' }}
        >
          Alla lag →
        </Link>
      </div>
    </header>
  )
}
