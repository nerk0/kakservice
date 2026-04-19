import { prisma } from '@/lib/prisma'
import { formatSEK } from '@/lib/utils'
import Link from 'next/link'
import { AdminSalesChart } from '@/components/admin/AdminSalesChart'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [agg, teams, recentOrders] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalAmount: true, totalProfit: true },
      _count: true,
      where: { status: { not: 'CANCELLED' } },
    }),
    prisma.team.findMany({
      where: { isActive: true },
      include: {
        orders: {
          where: { status: { not: 'CANCELLED' } },
          select: { totalAmount: true, totalProfit: true },
        },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.order.findMany({
      where: {
        status: { not: 'CANCELLED' },
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
      select: { createdAt: true, totalProfit: true },
      orderBy: { createdAt: 'asc' },
    }),
  ])

  const dailyMap = new Map<string, number>()
  for (const o of recentOrders) {
    const day = o.createdAt.toISOString().slice(0, 10)
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + o.totalProfit)
  }
  const dailyData = Array.from(dailyMap.entries()).map(([date, profit]) => ({ date, profit }))

  const stats = [
    { label: 'Beställningar', value: agg._count.toString(), symbol: '◎', accent: false },
    { label: 'Total intäkt', value: formatSEK(agg._sum.totalAmount ?? 0), symbol: '◈', accent: false },
    { label: 'Total vinst', value: formatSEK(agg._sum.totalProfit ?? 0), symbol: '⚑', accent: true },
    { label: 'Aktiva lag', value: teams.length.toString(), symbol: '◉', accent: false },
  ]

  return (
    <div className="space-y-8">
      <div>
        <p style={{ color: 'var(--color-honey)', fontFamily: 'var(--font-fraunces)', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          Organisationsöversikt
        </p>
        <h1 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-forest)' }}>
          Alla lag & försäljning
        </h1>
      </div>

      {/* KPI-kort */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: s.accent ? 'var(--color-forest)' : 'white',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: s.accent ? 'none' : '1px solid rgba(58,73,47,0.12)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {s.accent && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at top right, rgba(212,165,76,0.25) 0%, transparent 60%)',
                pointerEvents: 'none',
              }} />
            )}
            <div style={{
              fontSize: '1.25rem',
              color: s.accent ? 'var(--color-honey)' : 'var(--color-forest)',
              marginBottom: '0.75rem',
              opacity: s.accent ? 1 : 0.5,
            }}>
              {s.symbol}
            </div>
            <p style={{
              fontFamily: 'var(--font-fraunces)',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: s.accent ? 'var(--color-cream)' : 'var(--color-forest)',
              lineHeight: 1,
              marginBottom: '0.375rem',
            }}>
              {s.value}
            </p>
            <p style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: s.accent ? 'rgba(251,247,241,0.65)' : 'rgba(58,73,47,0.55)',
              letterSpacing: '0.04em',
            }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Försäljningsgraf */}
      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid rgba(58,73,47,0.12)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-forest)' }}>
            Vinst per dag
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'rgba(58,73,47,0.45)', letterSpacing: '0.04em' }}>senaste 30 dagarna</span>
        </div>
        <AdminSalesChart data={dailyData} />
      </div>

      {/* Lag-tabell */}
      <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid rgba(58,73,47,0.12)', overflow: 'hidden' }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(58,73,47,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-forest)' }}>
            Lagöversikt
          </h2>
          <Link
            href="/admin/lag"
            style={{ fontSize: '0.8rem', color: 'var(--color-honey)', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.04em' }}
          >
            Hantera lag →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(58,73,47,0.04)' }}>
                {['Lag', 'Beställningar', 'Vinst', '% av mål', ''].map((h, i) => (
                  <th
                    key={h || i}
                    style={{
                      padding: '0.75rem 1.25rem',
                      textAlign: i === 0 || i === 4 ? 'left' : 'right',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'rgba(58,73,47,0.5)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teams.map((t, idx) => {
                const profit = t.orders.reduce((s, o) => s + o.totalProfit, 0)
                const pct = Math.min(Math.round((profit / t.goalAmount) * 100), 100)
                const reached = pct >= 100
                return (
                  <tr
                    key={t.id}
                    className="admin-table-row"
                    style={{ borderTop: idx === 0 ? 'none' : '1px solid rgba(58,73,47,0.07)' }}
                  >
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--color-forest)' }}>
                      {t.name}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right', color: 'rgba(58,73,47,0.6)' }}>
                      {t.orders.length}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right', fontWeight: 600, color: 'var(--color-forest)', fontFamily: 'var(--font-fraunces)' }}>
                      {formatSEK(profit)}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '999px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        background: reached ? 'var(--color-honey)' : 'rgba(58,73,47,0.08)',
                        color: reached ? 'var(--color-forest)' : 'rgba(58,73,47,0.6)',
                      }}>
                        {pct}%
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <Link
                        href={`/lag/${t.slug}`}
                        target="_blank"
                        style={{ fontSize: '0.75rem', color: 'var(--color-honey)', fontWeight: 600, textDecoration: 'none' }}
                      >
                        Öppna →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
