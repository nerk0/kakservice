'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

type Team = { id: string; name: string }

export function CreateUserForm({ teams }: { teams: Team[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [teamId, setTeamId] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, teamId: teamId || undefined }),
    })
    setLoading(false)
    if (res.ok) {
      toast.success('Användare skapad!')
      setOpen(false)
      setName(''); setEmail(''); setPassword(''); setTeamId('')
      router.refresh()
    } else {
      const d = await res.json()
      toast.error(d.error || 'Något gick fel')
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="bg-green-600 hover:bg-green-700">
        + Lägg till lagledare
      </Button>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Ny lagledare</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Namn *</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Johan Svensson" required />
        </div>
        <div className="space-y-2">
          <Label>E-post *</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="johan@lag.se" required />
        </div>
        <div className="space-y-2">
          <Label>Lösenord *</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 tecken" minLength={6} required />
        </div>
        <div className="space-y-2">
          <Label>Lag</Label>
          <select
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Välj lag...</option>
            {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2 flex gap-3">
          <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
            {loading ? 'Skapar...' : 'Skapa lagledare'}
          </Button>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>Avbryt</Button>
        </div>
      </form>
    </div>
  )
}
