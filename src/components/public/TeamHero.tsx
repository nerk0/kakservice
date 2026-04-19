import { formatSEK } from '@/lib/utils'

type Props = {
  name: string
  description: string | null
  goalAmount: number
  totalProfit: number
}

export function TeamHero({ name, description, goalAmount, totalProfit }: Props) {
  const pct = Math.min(Math.round((totalProfit / goalAmount) * 100), 100)
  const reached = totalProfit >= goalAmount
  const remaining = goalAmount - totalProfit

  return (
    <div
      className="relative overflow-hidden rounded-2xl mb-10"
      style={{ background: 'var(--color-forest)' }}
    >
      {/* Decorative circle */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '-40%',
          right: '-10%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-5%',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
          pointerEvents: 'none',
        }}
      />

      <div className="relative z-10 px-8 py-10 md:py-14">
        {/* Label */}
        <p className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: 'rgba(255,255,255,0.45)' }}>
          Lagets butik
        </p>

        {/* Team name */}
        <h1
          className="font-display font-bold leading-tight mb-3"
          style={{
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            color: '#fff',
            letterSpacing: '-0.02em',
          }}
        >
          {name}
        </h1>

        {description && (
          <p className="text-base mb-8 max-w-xl"
            style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }}>
            {description}
          </p>
        )}

        {/* Progress section */}
        <div className="max-w-md">
          {reached ? (
            <p className="font-display text-xl font-bold mb-4" style={{ color: '#d4a84b' }}>
              🏆 Grattis — målet är nått!
            </p>
          ) : (
            <p className="text-sm font-medium mb-3" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Bara <strong style={{ color: '#d4a84b' }}>{formatSEK(remaining)}</strong> kvar till målet
            </p>
          )}

          {/* Jar-style progress */}
          <div className="jar-progress mb-2.5">
            <div className="jar-progress-fill" style={{ width: `${pct}%` }} />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>
              {formatSEK(totalProfit)} insamlat
            </span>
            <span className="font-display font-bold text-lg"
              style={{ color: pct >= 100 ? '#d4a84b' : 'rgba(255,255,255,0.9)' }}>
              {pct}%
            </span>
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>
              Mål: {formatSEK(goalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
