import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatSEK } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [teams, org] = await Promise.all([
    prisma.team.findMany({
      where: { isActive: true },
      include: {
        orders: {
          where: { status: { not: 'CANCELLED' } },
          select: { totalProfit: true },
        },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.organization.findFirst(),
  ])

  return (
    <div className="relative min-h-screen overflow-x-hidden">

      {/* ── Decorative background blobs ── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%',
          width: '55vw', height: '55vw', maxWidth: 700,
          borderRadius: '62% 38% 45% 55% / 50% 60% 40% 50%',
          background: 'radial-gradient(circle, #3D6B5222 0%, transparent 70%)',
          filter: 'blur(48px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', left: '-8%',
          width: '40vw', height: '40vw', maxWidth: 500,
          borderRadius: '50% 50% 38% 62% / 60% 44% 56% 40%',
          background: 'radial-gradient(circle, #C97B2E18 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
      </div>

      {/* ── Nav ── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🍪</span>
          <span className="font-display text-xl font-semibold tracking-tight" style={{ color: 'var(--color-forest)' }}>
            KakKampanjen
          </span>
        </div>
        <Link
          href="/auth/logga-in"
          className="login-btn text-sm font-medium px-4 py-2 rounded-full border transition-all"
        >
          Logga in
        </Link>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-20">
        <div className="max-w-3xl">
          <div className="market-tag mb-6 fade-up">
            {org?.name ?? 'IFK Demo IF'} &middot; Försäljningskampanj 2025
          </div>
          <h1
            className="font-display fade-up fade-up-1"
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'var(--color-forest)',
              fontWeight: 700,
            }}
          >
            Stöd ditt lag —<br />
            <em style={{ color: 'var(--color-honey)', fontStyle: 'italic' }}>köp något gott.</em>
          </h1>
          <p
            className="mt-6 text-lg fade-up fade-up-2"
            style={{ color: 'var(--color-charcoal)', maxWidth: 480, lineHeight: 1.7 }}
          >
            Kakor, knäckesticks och godis à <strong>75 kr</strong> — varav <strong>35 kr</strong> går
            direkt till det lag du väljer. Enkelt, gott och meningsfullt.
          </p>

          <div className="flex flex-wrap gap-6 mt-10 fade-up fade-up-3">
            {[
              { num: '62 000+', label: 'lag sedan 1984' },
              { num: '350 mkr', label: 'insamlat totalt' },
              { num: '35 kr', label: 'per burk till laget' },
            ].map(s => (
              <div key={s.label}>
                <p className="font-display text-3xl font-bold" style={{ color: 'var(--color-forest)' }}>
                  {s.num}
                </p>
                <p className="text-sm" style={{ color: 'var(--color-charcoal)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Teams ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-baseline justify-between mb-8">
          <h2
            className="font-display text-3xl font-bold"
            style={{ color: 'var(--color-forest)' }}
          >
            Välj ditt lag
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-charcoal)' }}>
            {teams.length} aktiva lag
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {teams.map((team, i) => {
            const profit = team.orders.reduce((s, o) => s + o.totalProfit, 0)
            const pct = Math.min(Math.round((profit / team.goalAmount) * 100), 100)
            const reached = profit >= team.goalAmount
            return (
              <Link
                key={team.id}
                href={`/lag/${team.slug}`}
                className={`card-lift block rounded-2xl overflow-hidden fade-up fade-up-${Math.min(i + 1, 6)}`}
                style={{ background: 'var(--color-forest)', color: '#fff' }}
              >
                {/* Top accent */}
                <div style={{
                  height: 6,
                  background: reached
                    ? 'linear-gradient(90deg, #d4a84b, #c97b2e)'
                    : 'linear-gradient(90deg, var(--color-meadow), var(--color-sage))',
                }} />

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest mb-1"
                        style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Lag
                      </p>
                      <h3 className="font-display text-xl font-bold leading-tight" style={{ color: '#fff' }}>
                        {team.name}
                      </h3>
                    </div>
                    {reached && (
                      <span className="text-xl" title="Målet nått!">🏆</span>
                    )}
                  </div>

                  {team.description && (
                    <p className="text-sm mb-5 line-clamp-2"
                      style={{ color: 'rgba(255,255,255,0.65)' }}>
                      {team.description}
                    </p>
                  )}

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="jar-progress">
                      <div className="jar-progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      <span>{formatSEK(profit)} insamlat</span>
                      <span className="font-semibold" style={{ color: pct >= 100 ? '#d4a84b' : 'rgba(255,255,255,0.85)' }}>
                        {pct}%
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div
                    className="mt-5 flex items-center gap-2 text-sm font-semibold"
                    style={{ color: 'rgba(255,255,255,0.9)' }}
                  >
                    <span>Handla här</span>
                    <span style={{ fontSize: '1.1em' }}>→</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {teams.length === 0 && (
          <div className="text-center py-20">
            <p className="font-display text-2xl" style={{ color: 'var(--color-charcoal)' }}>
              Inga aktiva lag just nu
            </p>
          </div>
        )}
      </section>

      {/* ── How it works ── */}
      <section style={{ background: 'var(--color-forest)' }} className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="font-display text-3xl font-bold text-center mb-12"
            style={{ color: '#fff' }}>
            Hur fungerar det?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                n: '01', icon: '🛒',
                title: 'Välj produkter',
                desc: 'Bläddra bland kakor, knäckesticks och godis. Lägg ditt favoritval i kundvagnen.'
              },
              {
                n: '02', icon: '📦',
                title: 'Laget levererar',
                desc: 'Du beställer, laget sammanställer och delar ut direkt till dig. Du betalar vid utlämning.'
              },
              {
                n: '03', icon: '💚',
                title: '35 kr till laget',
                desc: 'Per burk du köper tjänar laget 35 kr — direkt, utan mellanhänder och utan förskott.'
              },
            ].map(s => (
              <div key={s.n} className="flex gap-5">
                <div>
                  <p className="font-display text-5xl font-bold" style={{ color: 'rgba(255,255,255,0.1)', lineHeight: 1 }}>
                    {s.n}
                  </p>
                </div>
                <div>
                  <p className="text-3xl mb-3">{s.icon}</p>
                  <h3 className="font-display text-lg font-bold mb-2" style={{ color: '#fff' }}>
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 text-center py-8 text-sm" style={{ color: 'var(--color-charcoal)', borderTop: '1px solid var(--color-sand)' }}>
        <Link href="/auth/logga-in" className="hover:underline" style={{ color: 'var(--color-sage)' }}>
          Logga in som lagledare eller admin →
        </Link>
      </footer>
    </div>
  )
}
