import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatSEK } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Väntar',
  CONFIRMED: 'Bekräftad',
  DELIVERED: 'Levererad',
  CANCELLED: 'Avbruten',
}

export default async function TeamDashboardPage() {
  const session = await getServerSession(authOptions)
  const teamId = (session?.user as any)?.teamId

  if (!teamId) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ color: 'rgba(58,73,47,0.5)', fontFamily: 'var(--font-fraunces)' }}>
          Ditt konto är inte kopplat till något lag. Kontakta admin.
        </p>
      </div>
    )
  }

  const [team, agg, recentOrders] = await Promise.all([
    prisma.team.findUnique({ where: { id: teamId } }),
    prisma.order.aggregate({
      where: { teamId, status: { not: 'CANCELLED' } },
      _sum: { totalProfit: true, totalAmount: true },
      _count: true,
    }),
    prisma.order.findMany({
      where: { teamId },
      include: {
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  if (!team) return <p style={{ color: 'rgba(58,73,47,0.5)' }}>Lag hittades inte.</p>

  const profit = agg._sum.totalProfit ?? 0
  const pct = Math.min(Math.round((profit / team.goalAmount) * 100), 100)
  const reached = profit >= team.goalAmount
  const remaining = team.goalAmount - profit

  const stats = [
    { label: 'Beställningar', value: agg._count.toString(), symbol: '◎' },
    { label: 'Intjänat', value: formatSEK(profit), symbol: '⚑' },
    { label: 'Mot mål', value: `${pct}%`, symbol: '◉' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <p style={{ color: 'var(--color-honey)', fontFamily: 'var(--font-fraunces)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          Lagets dashboard
        </p>
        <h1 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-forest)' }}>
          {team.name}
        </h1>
        {team.description && (
          <p style={{ color: 'rgba(58,73,47,0.55)', marginTop: '0.375rem', fontSize: '0.9rem' }}>{team.description}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{
              background: i === 1 ? 'var(--color-forest)' : 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: i === 1 ? 'none' : '1px solid rgba(58,73,47,0.12)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {i === 1 && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at top, rgba(212,165,76,0.2) 0%, transparent 65%)',
                pointerEvents: 'none',
              }} />
            )}
            <div style={{
              fontSize: '1.25rem',
              color: i === 1 ? 'var(--color-honey)' : 'rgba(58,73,47,0.4)',
              marginBottom: '0.625rem',
            }}>
              {s.symbol}
            </div>
            <p style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '1.625rem',
              fontWeight: 700,
              color: i === 1 ? 'var(--color-cream)' : 'var(--color-forest)',
              lineHeight: 1,
              marginBottom: '0.375rem',
            }}>
              {s.value}
            </p>
            <p style={{
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: i === 1 ? 'rgba(251,247,241,0.55)' : 'rgba(58,73,47,0.45)',
            }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Progress mot mål */}
      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid rgba(58,73,47,0.12)', padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-forest)', marginBottom: '0.25rem' }}>
              {reached ? 'Målet är nått!' : 'Framsteg mot målet'}
            </h2>
            {!reached && (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-honey)', fontWeight: 600 }}>
                {formatSEK(remaining)} kvar
              </p>
            )}
          </div>
          <span style={{
            fontFamily: 'var(--font-fraunces)',
            fontSize: '2rem',
            fontWeight: 700,
            color: reached ? 'var(--color-honey)' : 'var(--color-forest)',
            lineHeight: 1,
          }}>
            {pct}%
          </span>
        </div>

        {/* Jar-style progress bar */}
        <div className="jar-progress" style={{ marginBottom: '0.875rem' }}>
          <div className="jar-progress-fill" style={{ width: `${pct}%` }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'rgba(58,73,47,0.5)' }}>
          <span>{formatSEK(profit)} insamlat</span>
          <span>Mål: {formatSEK(team.goalAmount)}</span>
        </div>

        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(58,73,47,0.08)' }}>
          <p style={{ fontSize: '0.8rem', color: 'rgba(58,73,47,0.5)', marginBottom: '0.25rem' }}>Din lagbutik</p>
          <Link
            href={`/lag/${team.slug}`}
            target="_blank"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.875rem',
              color: 'var(--color-forest)',
              fontWeight: 600,
              textDecoration: 'none',
              background: 'rgba(58,73,47,0.06)',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              transition: 'background 0.15s',
            }}
          >
            /lag/{team.slug} →
          </Link>
          <p style={{ fontSize: '0.75rem', color: 'rgba(58,73,47,0.4)', marginTop: '0.5rem' }}>
            Dela länken med kunder så kan de beställa direkt!
          </p>
        </div>
      </div>

      {/* Senaste beställningar */}
      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid rgba(58,73,47,0.12)', overflow: 'hidden' }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(58,73,47,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-forest)' }}>
            Senaste beställningar
          </h2>
          <Link
            href="/team/dashboard/bestallningar"
            style={{ fontSize: '0.8rem', color: 'var(--color-honey)', fontWeight: 600, textDecoration: 'none' }}
          >
            Visa alla →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ fontFamily: 'var(--font-fraunces)', fontSize: '2rem', color: 'rgba(58,73,47,0.15)', marginBottom: '0.5rem' }}>◎</p>
            <p style={{ color: 'rgba(58,73,47,0.4)', fontSize: '0.875rem' }}>Inga beställningar ännu</p>
          </div>
        ) : (
          <div>
            {recentOrders.map((o, idx) => {
              const isDelivered = o.status === 'DELIVERED'
              return (
                <div
                  key={o.id}
                  style={{
                    padding: '1rem 1.5rem',
                    borderTop: idx === 0 ? 'none' : '1px solid rgba(58,73,47,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 600, color: 'var(--color-forest)', fontSize: '0.875rem', marginBottom: '0.2rem' }}>
                      {o.customerName}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(58,73,47,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {o.items.map((i) => `${i.product.name} ×${i.quantity}`).join(', ')}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontFamily: 'var(--font-fraunces)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-forest)', marginBottom: '0.25rem' }}>
                      {formatSEK(o.totalAmount)}
                    </p>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.15rem 0.6rem',
                      borderRadius: '999px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      background: isDelivered ? 'rgba(58,73,47,0.1)' : 'rgba(212,165,76,0.18)',
                      color: isDelivered ? 'var(--color-forest)' : 'rgba(160,110,30,0.9)',
                    }}>
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
