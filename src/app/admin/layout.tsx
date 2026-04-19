import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/auth/logga-in')
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#F5F2EE' }}>
      <AdminSidebar />
      <main className="flex-1 p-7 overflow-auto">{children}</main>
    </div>
  )
}
