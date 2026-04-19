import { prisma } from '@/lib/prisma'
import { formatSEK } from '@/lib/utils'
import Link from 'next/link'
import { CreateTeamForm } from '@/components/admin/CreateTeamForm'

export const dynamic = 'force-dynamic'

export default async function AdminTeamsPage() {
  const teams = await prisma.team.findMany({
    include: {
      orders: {
        where: { status: { not: 'CANCELLED' } },
        select: { totalProfit: true, totalAmount: true },
      },
      _count: { select: { users: true } },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Lag</h1>
      </div>

      <CreateTeamForm />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Namn</th>
                <th className="text-left px-5 py-3 font-medium">Slug</th>
                <th className="text-right px-5 py-3 font-medium">Mål</th>
                <th className="text-right px-5 py-3 font-medium">Intjänat</th>
                <th className="text-right px-5 py-3 font-medium">Orders</th>
                <th className="text-left px-5 py-3 font-medium">Länk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {teams.map((t) => {
                const profit = t.orders.reduce((s, o) => s + o.totalProfit, 0)
                return (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{t.name}</td>
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">{t.slug}</td>
                    <td className="px-5 py-3 text-right text-gray-600">{formatSEK(t.goalAmount)}</td>
                    <td className="px-5 py-3 text-right font-medium text-green-700">{formatSEK(profit)}</td>
                    <td className="px-5 py-3 text-right text-gray-600">{t.orders.length}</td>
                    <td className="px-5 py-3">
                      <Link href={`/lag/${t.slug}`} className="text-green-700 hover:underline text-xs" target="_blank">
                        /lag/{t.slug} →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {teams.length === 0 && <p className="text-center text-gray-400 py-12">Inga lag ännu</p>}
      </div>
    </div>
  )
}
