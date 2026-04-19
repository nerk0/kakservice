import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-helpers'
import { z } from 'zod'
import { slugify } from '@/lib/utils'

export async function GET() {
  const teams = await prisma.team.findMany({
    where: { isActive: true },
    include: {
      _count: { select: { orders: true } },
    },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(teams)
}

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  goalAmount: z.number().int().default(500000),
  slug: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const data = createSchema.parse(body)
    const slug = data.slug || slugify(data.name)

    const org = await prisma.organization.findFirst()
    if (!org) return NextResponse.json({ error: 'Ingen organisation' }, { status: 500 })

    const team = await prisma.team.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        goalAmount: data.goalAmount,
        organizationId: org.id,
      },
    })
    return NextResponse.json(team, { status: 201 })
  } catch (e: any) {
    if (e.message?.includes('Otillåtet')) return NextResponse.json({ error: e.message }, { status: 401 })
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
