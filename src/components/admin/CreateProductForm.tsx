'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const CATEGORIES = ['kakor', 'knäckesticks', 'godis', 'övrigt']

export function CreateProductForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('kakor')
  const [price, setPrice] = useState('75')
  const [profit, setProfit] = useState('35')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description: description || undefined,
        category,
        pricePerUnit: Math.round(parseFloat(price) * 100),
        profitPerUnit: Math.round(parseFloat(profit) * 100),
      }),
    })
    setLoading(false)
    if (res.ok) {
      toast.success('Produkt skapad!')
      setOpen(false)
      setName('')
      setDescription('')
      setPrice('75')
      setProfit('35')
      router.refresh()
    } else {
      const d = await res.json()
      toast.error(d.error || 'Något gick fel')
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="bg-green-600 hover:bg-green-700">
        + Lägg till produkt
      </Button>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Ny produkt</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="prod-name">Produktnamn *</Label>
          <Input id="prod-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Mammas Chokladbollar" required />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="prod-desc">Beskrivning</Label>
          <Input id="prod-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Klassiska chokladbollar med kokosflingor..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prod-cat">Kategori</Label>
          <select
            id="prod-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="prod-price">Pris (kr) *</Label>
          <Input id="prod-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="1" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prod-profit">Lagvinst (kr) *</Label>
          <Input id="prod-profit" type="number" value={profit} onChange={(e) => setProfit(e.target.value)} min="1" required />
        </div>
        <div className="sm:col-span-2 flex gap-3">
          <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
            {loading ? 'Skapar...' : 'Lägg till'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>Avbryt</Button>
        </div>
      </form>
    </div>
  )
}
