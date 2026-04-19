import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export type SessionUser = {
  id: string
  email: string
  name?: string | null
  role: 'ADMIN' | 'TEAM_MANAGER'
  teamId?: string | null
  organizationId: string
}

export async function getSession() {
  const session = await getServerSession(authOptions)
  return session
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    throw new Error('Otillåtet: Kräver adminrättigheter')
  }
  return session.user as unknown as SessionUser
}

export async function requireTeamAccess(teamId: string) {
  const session = await getSession()
  if (!session) throw new Error('Otillåtet: Inte inloggad')
  const user = session.user as unknown as SessionUser
  if (user.role === 'ADMIN') return user
  if (user.teamId !== teamId) throw new Error('Förbjudet: Fel lag')
  return user
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) throw new Error('Otillåtet: Inte inloggad')
  return session.user as unknown as SessionUser
}
