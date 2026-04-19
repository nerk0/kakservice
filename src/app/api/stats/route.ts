import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-helpers'

export async function GET() {
  try {
    await requireAdmin()

    const [totalOrders, teams, recentOrders] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalAmount: true, totalProfit: true },
        _count: true,
        where: { status: { not: 'CANCELLED' } },
      }),
      prisma.team.findMany({
        where: { isActive: true },
        include: {
          orders: {
            where: { status: { not: 'CANCELLED' } },
            select: { totalAmount: true, totalProfit: true, createdAt: true },
          },
        },
        orderBy: { name: 'asc' },
      }),
      // Daglig data senaste 30 dagarna
      prisma.order.findMany({
        where: {
          status: { not: 'CANCELLED' },
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        select: { createdAt: true, totalAmount: true, totalProfit: true },
        orderBy: { createdAt: 'asc' },
      }),
    ])

    // Daglig aggregering
    const dailyMap = new Map<string, { amount: number; profit: number; count: number }>()
    for (const o of recentOrders) {
      const day = o.createdAt.toISOString().slice(0, 10)
      const existing = dailyMap.get(day) || { amount: 0, profit: 0, count: 0 }
      dailyMap.set(day, {
        amount: existing.amount + o.totalAmount,
        profit: existing.profit + o.totalProfit,
        count: existing.count + 1,
      })
    }
    const daily = Array.from(dailyMap.entries()).map(([date, v]) => ({ date, ...v }))

    // Per-lag stats
    const teamStats = teams.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      goalAmount: t.goalAmount,
      orderCount: t.orders.length,
      totalAmount: t.orders.reduce((s, o) => s + o.totalAmount, 0),
      totalProfit: t.orders.reduce((s, o) => s + o.totalProfit, 0),
    }))

    return NextResponse.json({
      totalOrders: totalOrders._count,
      totalAmount: totalOrders._sum.totalAmount ?? 0,
      totalProfit: totalOrders._sum.totalProfit ?? 0,
      activeTeams: teams.length,
      teamStats,
      daily,
    })
  } catch (e: any) {
    if (e.message?.includes('Otillåtet')) return NextResponse.json({ error: e.message }, { status: 401 })
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
