import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-helpers'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    await requireAdmin()
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        teamId: true,
        team: { select: { name: true } },
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(users)
  } catch (e: any) {
    if (e.message?.includes('Otillåtet')) return NextResponse.json({ error: e.message }, { status: 401 })
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  teamId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const data = createSchema.parse(body)

    const org = await prisma.organization.findFirst()
    if (!org) return NextResponse.json({ error: 'Ingen organisation' }, { status: 500 })

    const hashedPassword = await bcrypt.hash(data.password, 12)
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        hashedPassword,
        role: 'TEAM_MANAGER',
        teamId: data.teamId,
        organizationId: org.id,
      },
      select: { id: true, name: true, email: true, role: true, teamId: true },
    })
    return NextResponse.json(user, { status: 201 })
  } catch (e: any) {
    if (e.message?.includes('Otillåtet')) return NextResponse.json({ error: e.message }, { status: 401 })
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
