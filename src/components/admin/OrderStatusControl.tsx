'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type Props = {
  orderId: string
  status: string
  paymentStatus: string
}

export function OrderStatusControl({ orderId, status, paymentStatus }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function update(data: object) {
    setLoading(true)
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setLoading(false)
    if (res.ok) {
      toast.success('Uppdaterad')
      router.refresh()
    } else {
      toast.error('Något gick fel')
    }
  }

  return (
    <div className="flex gap-1 flex-wrap">
      {status !== 'DELIVERED' && status !== 'CANCELLED' && (
        <button
          onClick={() => update({ status: 'DELIVERED' })}
          disabled={loading}
          className="text-xs px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-md font-medium"
        >
          Levererad
        </button>
      )}
      {paymentStatus !== 'PAID' && (
        <button
          onClick={() => update({ paymentStatus: 'PAID' })}
          disabled={loading}
          className="text-xs px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md font-medium"
        >
          Betald
        </button>
      )}
    </div>
  )
}
