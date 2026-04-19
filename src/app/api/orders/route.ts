import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-helpers'
import { z } from 'zod'

const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(1),
})

const createOrderSchema = z.object({
  teamId: z.string(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  customerAddress: z.string().optional(),
  note: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = createOrderSchema.parse(body)

    // Hämta produktpriser
    const productIds = data.items.map((i) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: 'En eller flera produkter hittades inte' }, { status: 400 })
    }

    const productMap = new Map(products.map((p) => [p.id, p]))

    let totalAmount = 0
    let totalProfit = 0
    const items = data.items.map((item) => {
      const product = productMap.get(item.productId)!
      totalAmount += product.pricePerUnit * item.quantity
      totalProfit += product.profitPerUnit * item.quantity
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.pricePerUnit,
        unitProfit: product.profitPerUnit,
      }
    })

    const order = await prisma.order.create({
      data: {
        teamId: data.teamId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        note: data.note,
        totalAmount,
        totalProfit,
        items: { create: items },
      },
      include: { items: true },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get('teamId') || undefined
    const status = searchParams.get('status') || undefined
    const paymentStatus = searchParams.get('paymentStatus') || undefined

    const orders = await prisma.order.findMany({
      where: {
        ...(teamId ? { teamId } : {}),
        ...(status ? { status: status as any } : {}),
        ...(paymentStatus ? { paymentStatus: paymentStatus as any } : {}),
      },
      include: {
        team: { select: { name: true, slug: true } },
        items: {
          include: { product: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
  } catch (e: any) {
    if (e.message?.includes('Otillåtet')) return NextResponse.json({ error: e.message }, { status: 401 })
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}
