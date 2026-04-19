import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-helpers'
import { z } from 'zod'

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
  return NextResponse.json(products)
}

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  category: z.string().default('övrigt'),
  pricePerUnit: z.number().int().default(7500),
  profitPerUnit: z.number().int().default(3500),
  sortOrder: z.number().int().default(0),
})

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin()
    const body = await req.json()
    const data = createSchema.parse(body)

    const org = await prisma.organization.findFirst()
    if (!org) return NextResponse.json({ error: 'Ingen organisation hittades' }, { status: 500 })

    const product = await prisma.product.create({
      data: { ...data, organizationId: org.id },
    })
    return NextResponse.json(product, { status: 201 })
  } catch (e: any) {
    if (e.message?.includes('Otillåtet')) return NextResponse.json({ error: e.message }, { status: 401 })
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
