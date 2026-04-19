'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { formatSEK } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

type Props = { teamId: string; onClose: () => void }

export function OrderForm({ teamId, onClose }: Props) {
  const { items, totalAmount, totalProfit, clear } = useCart()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId,
          customerName: name,
          customerEmail: email,
          customerPhone: phone || undefined,
          customerAddress: address || undefined,
          note: note || undefined,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Något gick fel')
      }
      clear()
      setSuccess(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Något gick fel')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center p-8"
        style={{ background: 'var(--color-cream)' }}
      >
        <div style={{ fontSize: 80 }}>🎉</div>
        <h2
          className="font-display text-3xl font-bold mt-5 mb-3"
          style={{ color: 'var(--color-forest)' }}
        >
          Tack för din beställning!
        </h2>
        <p className="text-base max-w-sm" style={{ color: 'var(--color-charcoal)', lineHeight: 1.65 }}>
          Laget kontaktar dig när varan är klar för upphämtning.
          Du betalar vid utlämning.
        </p>
        <p className="mt-3 text-sm font-semibold" style={{ color: 'var(--color-honey)' }}>
          Du bidrog med {formatSEK(totalProfit())} till lagets insamling 💚
        </p>
        <button
          onClick={onClose}
          className="mt-8 px-8 py-3.5 rounded-xl font-semibold text-white transition-all active:scale-95"
          style={{ background: 'var(--color-forest)' }}
        >
          Tillbaka till butiken
        </button>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: 'var(--color-cream)' }}
    >
      <div className="max-w-lg mx-auto px-5 py-8">
        {/* Back button */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm font-medium mb-8 transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-forest)' }}
        >
          ← Tillbaka till butiken
        </button>

        <h2
          className="font-display text-2xl font-bold mb-1"
          style={{ color: 'var(--color-forest)' }}
        >
          Din beställning
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--color-charcoal)', opacity: 0.7 }}>
          Betalar gör du vid upphämtning — inte nu.
        </p>

        {/* Order summary */}
        <div
          className="rounded-xl p-4 mb-6"
          style={{ background: 'var(--color-forest)', color: '#fff' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ opacity: 0.5 }}>
            Sammanfattning
          </p>
          <div className="space-y-1.5">
            {items.map((i) => (
              <div key={i.productId} className="flex justify-between text-sm">
                <span style={{ opacity: 0.8 }}>{i.name} × {i.quantity}</span>
                <span className="font-semibold">{formatSEK(i.pricePerUnit * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div
            className="flex justify-between font-display font-bold text-lg mt-3 pt-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
          >
            <span>Totalt</span>
            <span>{formatSEK(totalAmount())}</span>
          </div>
          <p className="text-xs mt-1" style={{ color: '#d4a84b' }}>
            Laget tjänar {formatSEK(totalProfit())} 💚
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
              Namn *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Anna Svensson"
              required
              style={{ background: '#fff', borderColor: 'var(--color-sand)' }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
              E-post *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anna@example.com"
              required
              style={{ background: '#fff', borderColor: 'var(--color-sand)' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                Telefon
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="070-123 45 67"
                style={{ background: '#fff', borderColor: 'var(--color-sand)' }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                Adress
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Storgatan 1"
                style={{ background: '#fff', borderColor: 'var(--color-sand)' }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note" className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
              Meddelande till laget
            </Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Valfritt..."
              style={{ background: '#fff', borderColor: 'var(--color-sand)' }}
            />
          </div>

          {error && (
            <p
              className="text-sm px-4 py-3 rounded-lg"
              style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-semibold text-white text-base transition-all active:scale-[0.98] disabled:opacity-60 mt-2"
            style={{ background: loading ? 'var(--color-sage)' : 'var(--color-forest)' }}
          >
            {loading ? 'Lägger beställning...' : `Beställ — ${formatSEK(totalAmount())}`}
          </button>

          <p className="text-xs text-center" style={{ color: 'var(--color-charcoal)', opacity: 0.6 }}>
            Betalning sker kontant vid upphämtning. Laget kontaktar dig.
          </p>
        </form>
      </div>
    </div>
  )
}
