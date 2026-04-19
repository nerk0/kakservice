import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { TeamHero } from '@/components/public/TeamHero'
import { ProductCard } from '@/components/public/ProductCard'
import { CartDrawer } from '@/components/public/CartDrawer'
import { CartInitializer } from '@/components/public/CartInitializer'
import { CATEGORY_LABELS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const team = await prisma.team.findUnique({ where: { slug } })
  if (!team) return { title: 'Lag hittades inte' }
  return {
    title: `${team.name} – KakKampanjen`,
    description: team.description ?? `Stöd ${team.name} genom att köpa produkter!`,
  }
}

export default async function LagPage({ params }: Props) {
  const { slug } = await params

  const [team, products] = await Promise.all([
    prisma.team.findUnique({
      where: { slug, isActive: true },
      include: {
        orders: {
          where: { status: { not: 'CANCELLED' } },
          select: { totalProfit: true },
        },
      },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ])

  if (!team) notFound()

  const totalProfit = team.orders.reduce((s, o) => s + o.totalProfit, 0)

  // Gruppera efter kategori
  const categories = Array.from(new Set(products.map((p) => p.category)))

  return (
    <>
      <CartInitializer teamId={team.id} />
      <SiteHeader teamName={team.name} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <TeamHero
          name={team.name}
          description={team.description}
          goalAmount={team.goalAmount}
          totalProfit={totalProfit}
        />

        {categories.map((cat) => {
          const catProducts = products.filter((p) => p.category === cat)
          return (
            <section key={cat} className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-4 capitalize">
                {CATEGORY_LABELS[cat] ?? cat}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {catProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )
        })}

        {products.length === 0 && (
          <p className="text-center text-gray-500 py-12">Inga produkter tillgängliga just nu.</p>
        )}
      </div>
      <CartDrawer teamId={team.id} />
    </>
  )
}
