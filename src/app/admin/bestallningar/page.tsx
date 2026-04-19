import { prisma } from '@/lib/prisma'
import { formatSEK, formatDateTime } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/constants'
import { OrderStatusControl } from '@/components/admin/OrderStatusControl'

export const dynamic = 'force-dynamic'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      team: { select: { name: true } },
      items: {
        include: { product: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Alla beställningar</h1>
        <span className="text-sm text-gray-500">{orders.length} beställningar totalt</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Kund</th>
                <th className="text-left px-4 py-3 font-medium">Lag</th>
                <th className="text-left px-4 py-3 font-medium">Produkter</th>
                <th className="text-right px-4 py-3 font-medium">Summa</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Betalt</th>
                <th className="text-left px-4 py-3 font-medium">Datum</th>
                <th className="text-left px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.team.name}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {order.items.map((i) => `${i.product.name} ×${i.quantity}`).join(', ')}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{formatSEK(order.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDateTime(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusControl orderId={order.id} status={order.status} paymentStatus={order.paymentStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
          <p className="text-center text-gray-400 py-12">Inga beställningar ännu</p>
        )}
      </div>
    </div>
  )
}
