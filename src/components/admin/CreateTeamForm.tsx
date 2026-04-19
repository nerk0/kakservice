'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { slugify } from '@/lib/utils'

export function CreateTeamForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [goalAmount, setGoalAmount] = useState('5000')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description: description || undefined,
        goalAmount: Math.round(parseFloat(goalAmount) * 100),
        slug: slugify(name),
      }),
    })
    setLoading(false)
    if (res.ok) {
      toast.success('Lag skapat!')
      setOpen(false)
      setName('')
      setDescription('')
      setGoalAmount('5000')
      router.refresh()
    } else {
      const d = await res.json()
      toast.error(d.error || 'Något gick fel')
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="bg-green-600 hover:bg-green-700">
        + Skapa nytt lag
      </Button>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Skapa nytt lag</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="team-name">Lagnamn *</Label>
          <Input id="team-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Fotbollslaget Alfa" required />
          {name && <p className="text-xs text-gray-500">Slug: /lag/{slugify(name)}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="team-goal">Målbelopp (kr) *</Label>
          <Input id="team-goal" type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} min="100" required />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="team-desc">Beskrivning</Label>
          <Input id="team-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Vi samlar in pengar till..." />
        </div>
        <div className="sm:col-span-2 flex gap-3">
          <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
            {loading ? 'Skapar...' : 'Skapa lag'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>Avbryt</Button>
        </div>
      </form>
    </div>
  )
}
