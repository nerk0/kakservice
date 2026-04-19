'use client'

import { useCart } from '@/hooks/useCart'
import { formatSEK } from '@/lib/utils'
import { toast } from 'sonner'

type Product = {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  category: string
  pricePerUnit: number
  profitPerUnit: number
}

const CATEGORY_EMOJI: Record<string, string> = {
  kakor: '🍪',
  'knäckesticks': '🌾',
  godis: '🍬',
  övrigt: '📦',
}

const CATEGORY_BG: Record<string, string> = {
  kakor: '#F5EBD8',
  'knäckesticks': '#EBF0DC',
  godis: '#F5DDE8',
  övrigt: '#E8E8E8',
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem, items } = useCart()
  const cartItem = items.find((i) => i.productId === product.id)
  const emoji = CATEGORY_EMOJI[product.category] || '📦'
  const bg = CATEGORY_BG[product.category] || '#E8E8E8'

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      pricePerUnit: product.pricePerUnit,
      profitPerUnit: product.profitPerUnit,
    })
    toast.success(`${product.name} lagd i kundvagnen`)
  }

  return (
    <div
      className="card-lift relative rounded-xl overflow-hidden"
      style={{
        background: '#fff',
        border: '1px solid var(--color-sand)',
      }}
    >
      {/* Cart badge */}
      {cartItem && (
        <div
          className="absolute top-3 right-3 z-10 font-display font-bold text-sm w-7 h-7 flex items-center justify-center rounded-full"
          style={{ background: 'var(--color-forest)', color: '#fff' }}
        >
          {cartItem.quantity}
        </div>
      )}

      {/* Image area */}
      <div
        className="flex items-center justify-center"
        style={{ height: 140, background: bg }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span style={{ fontSize: 64 }}>{emoji}</span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category tag */}
        <div className="market-tag mb-3">{product.category}</div>

        {/* Name */}
        <h3
          className="font-display font-bold text-base leading-snug mb-1"
          style={{ color: 'var(--color-ink)' }}
        >
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--color-charcoal)', lineHeight: 1.55 }}>
            {product.description}
          </p>
        )}

        {/* Price row */}
        <div className="flex items-end justify-between mt-4">
          <div>
            <p
              className="font-display font-bold text-2xl leading-none"
              style={{ color: 'var(--color-forest)' }}
            >
              {formatSEK(product.pricePerUnit)}
            </p>
            <p className="text-xs mt-1 font-medium" style={{ color: 'var(--color-honey)' }}>
              Laget tjänar {formatSEK(product.profitPerUnit)}
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95"
            style={{
              background: 'var(--color-forest)',
              color: '#fff',
            }}
          >
            + Lägg till
          </button>
        </div>
      </div>
    </div>
  )
}
