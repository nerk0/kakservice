import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-helpers'
import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
  pricePerUnit: z.number().int().optional(),
  profitPerUnit: z.number().int().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await req.json()
    const data = updateSchema.parse(body)
    const product = await prisma.product.update({ where: { id }, data })
    return NextResponse.json(product)
  } catch (e: any) {
    if (e.message?.includes('Otillåtet')) return NextResponse.json({ error: e.message }, { status: 401 })
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    await prisma.product.update({ where: { id }, data: { isActive: false } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    if (e.message?.includes('Otillåtet')) return NextResponse.json({ error: e.message }, { status: 401 })
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
