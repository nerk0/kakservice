import { prisma } from '@/lib/prisma'
import { formatSEK } from '@/lib/utils'
import { CreateProductForm } from '@/components/admin/CreateProductForm'
import { Badge } from '@/components/ui/badge'
import { CATEGORY_LABELS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Produkter</h1>

      <CreateProductForm />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className={`bg-white border rounded-xl p-5 ${!p.isActive ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between mb-3">
              <Badge variant="secondary">{CATEGORY_LABELS[p.category] ?? p.category}</Badge>
              {!p.isActive && <span className="text-xs text-red-500 font-medium">Inaktiv</span>}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{p.name}</h3>
            {p.description && <p className="text-sm text-gray-500 mb-3">{p.description}</p>}
            <div className="flex justify-between text-sm">
              <span className="font-bold text-gray-900">{formatSEK(p.pricePerUnit)}</span>
              <span className="text-green-600">Vinst: {formatSEK(p.profitPerUnit)}</span>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-gray-400 py-12">Inga produkter ännu</p>
      )}
    </div>
  )
}
