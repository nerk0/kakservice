import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-helpers'
import { z } from 'zod'

const updateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED']).optional(),
  paymentStatus: z.enum(['UNPAID', 'PAID']).optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) return NextResponse.json({ error: 'Order hittades inte' }, { status: 404 })

    // Teamledare kan bara uppdatera egna lagets orders
    if (user.role === 'TEAM_MANAGER' && order.teamId !== user.teamId) {
      return NextResponse.json({ error: 'Förbjudet' }, { status: 403 })
    }

    const body = await req.json()
    const data = updateSchema.parse(body)
    const updated = await prisma.order.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch (e: any) {
    if (e.message?.includes('Otillåtet')) return NextResponse.json({ error: e.message }, { status: 401 })
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
