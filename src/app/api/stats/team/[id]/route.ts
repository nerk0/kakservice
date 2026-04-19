import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTeamAccess } from '@/lib/auth-helpers'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await requireTeamAccess(id)

    const [team, agg] = await Promise.all([
      prisma.team.findUnique({ where: { id } }),
      prisma.order.aggregate({
        where: { teamId: id, status: { not: 'CANCELLED' } },
        _sum: { totalAmount: true, totalProfit: true },
        _count: true,
      }),
    ])

    if (!team) return NextResponse.json({ error: 'Lag hittades inte' }, { status: 404 })

    return NextResponse.json({
      teamId: id,
      teamName: team.name,
      goalAmount: team.goalAmount,
      orderCount: agg._count,
      totalAmount: agg._sum.totalAmount ?? 0,
      totalProfit: agg._sum.totalProfit ?? 0,
    })
  } catch (e: any) {
    if (e.message?.includes('Otillåtet') || e.message?.includes('Förbjudet'))
      return NextResponse.json({ error: e.message }, { status: 401 })
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
