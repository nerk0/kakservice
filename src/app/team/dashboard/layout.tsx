import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { TeamSidebar } from '@/components/team/TeamSidebar'

export default async function TeamDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'TEAM_MANAGER') {
    if (session && (session.user as any)?.role === 'ADMIN') redirect('/admin')
    redirect('/auth/logga-in')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TeamSidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}
