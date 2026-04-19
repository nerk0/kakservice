import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTeamAccess } from '@/lib/auth-helpers'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await requireTeamAccess(id)

    const orders = await prisma.order.findMany({
      where: { teamId: id },
      include: {
        items: {
          include: { product: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
  } catch (e: any) {
    if (e.message?.includes('Otillåtet') || e.message?.includes('Förbjudet'))
      return NextResponse.json({ error: e.message }, { status: 401 })
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
