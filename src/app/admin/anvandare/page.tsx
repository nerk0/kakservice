import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { CreateUserForm } from '@/components/admin/CreateUserForm'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const [users, teams] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        team: { select: { name: true } },
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.team.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Användare</h1>

      <CreateUserForm teams={teams} />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Namn</th>
              <th className="text-left px-5 py-3 font-medium">E-post</th>
              <th className="text-left px-5 py-3 font-medium">Roll</th>
              <th className="text-left px-5 py-3 font-medium">Lag</th>
              <th className="text-left px-5 py-3 font-medium">Skapad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-900">{u.name ?? '—'}</td>
                <td className="px-5 py-3 text-gray-600">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {u.role === 'ADMIN' ? 'Admin' : 'Lagledare'}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-600">{u.team?.name ?? '—'}</td>
                <td className="px-5 py-3 text-gray-500 text-xs">{formatDate(u.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-center text-gray-400 py-12">Inga användare</p>}
      </div>
    </div>
  )
}
