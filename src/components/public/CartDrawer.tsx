'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { formatSEK } from '@/lib/utils'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { OrderForm } from './OrderForm'

export function CartDrawer({ teamId }: { teamId: string }) {
  const { items, removeItem, updateQuantity, totalAmount, totalProfit, totalItems } = useCart()
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [open, setOpen] = useState(false)
  const count = totalItems()

  if (showOrderForm) {
    return (
      <OrderForm
        teamId={teamId}
        onClose={() => { setShowOrderForm(false); setOpen(false) }}
      />
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label={`Kundvagn — ${count} varor`}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full shadow-xl transition-all active:scale-95"
          style={{
            background: count > 0 ? 'var(--color-forest)' : 'var(--color-sage)',
            color: '#fff',
            padding: count > 0 ? '14px 22px' : '16px',
            fontSize: count > 0 ? '0.9rem' : '1.5rem',
            fontWeight: 600,
            opacity: count === 0 ? 0.6 : 1,
          }}
        >
          <span>🛒</span>
          {count > 0 && (
            <>
              <span className="font-display font-bold">{count}</span>
              <span style={{ opacity: 0.8 }}>·</span>
              <span>{formatSEK(totalAmount())}</span>
            </>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        className="w-full sm:max-w-md overflow-y-auto flex flex-col"
        style={{ background: 'var(--color-cream)', borderLeft: '1px solid var(--color-sand)' }}
      >
        <SheetHeader className="pb-4" style={{ borderBottom: '1px solid var(--color-sand)' }}>
          <SheetTitle className="font-display text-xl" style={{ color: 'var(--color-forest)' }}>
            Din kundvagn
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
            <span style={{ fontSize: 56 }}>🛒</span>
            <p className="font-display text-lg mt-4" style={{ color: 'var(--color-charcoal)' }}>
              Kundvagnen är tom
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-charcoal)', opacity: 0.6 }}>
              Lägg till produkter nedan
            </p>
          </div>
        ) : (
          <div className="flex-1 mt-6 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: '#fff', border: '1px solid var(--color-sand)' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-ink)' }}>
                    {item.name}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-charcoal)', opacity: 0.7 }}>
                    {formatSEK(item.pricePerUnit)} / st
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                    style={{ background: 'var(--color-mist)', color: 'var(--color-forest)' }}
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-display font-bold text-sm" style={{ color: 'var(--color-ink)' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                    style={{ background: 'var(--color-forest)', color: '#fff' }}
                  >
                    +
                  </button>
                </div>

                <p className="w-14 text-right font-display font-bold text-sm" style={{ color: 'var(--color-forest)' }}>
                  {formatSEK(item.pricePerUnit * item.quantity)}
                </p>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-sm transition-opacity hover:opacity-100 opacity-40"
                  style={{ color: 'var(--color-rust)' }}
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Totals */}
            <div
              className="rounded-xl p-4 space-y-2"
              style={{ background: 'var(--color-forest)', color: '#fff' }}
            >
              <div className="flex justify-between text-sm" style={{ opacity: 0.7 }}>
                <span>{count} {count === 1 ? 'vara' : 'varor'}</span>
                <span>{formatSEK(totalAmount())}</span>
              </div>
              <div className="flex justify-between font-display font-bold text-lg">
                <span>Totalt</span>
                <span>{formatSEK(totalAmount())}</span>
              </div>
              <div className="flex items-center gap-1.5 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                <span style={{ color: '#d4a84b' }}>💚</span>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  Laget tjänar <strong style={{ color: '#d4a84b' }}>{formatSEK(totalProfit())}</strong> på din beställning
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowOrderForm(true)}
              className="w-full py-4 rounded-xl font-semibold text-base transition-all active:scale-[0.98]"
              style={{ background: 'var(--color-honey)', color: '#fff' }}
            >
              Gå till kassan →
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
