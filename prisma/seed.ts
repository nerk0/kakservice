import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('Skapar demodata...')

  // Organisation
  const org = await prisma.organization.upsert({
    where: { slug: 'ifk-demo' },
    update: {},
    create: {
      name: 'IFK Demo IF',
      slug: 'ifk-demo',
      description: 'Idrottsföreningen som samlar alla våra lag',
      primaryColor: '#16a34a',
    },
  })

  // Produkter
  const produkter = await Promise.all([
    prisma.product.upsert({
      where: { id: 'prod-1' },
      update: {},
      create: {
        id: 'prod-1',
        organizationId: org.id,
        name: 'Mammas Chokladbollar',
        description: 'Klassiska chokladbollar med kokosflingor. 500g per burk.',
        category: 'kakor',
        imageUrl: '/images/chokladbollar.svg',
        pricePerUnit: 7500,
        profitPerUnit: 3500,
        sortOrder: 1,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-2' },
      update: {},
      create: {
        id: 'prod-2',
        organizationId: org.id,
        name: 'Farfars Favoriter',
        description: 'Krispiga havrekakor med chokladbitar. 400g per burk.',
        category: 'kakor',
        imageUrl: '/images/havrekakor.svg',
        pricePerUnit: 7500,
        profitPerUnit: 3500,
        sortOrder: 2,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-3' },
      update: {},
      create: {
        id: 'prod-3',
        organizationId: org.id,
        name: 'Camillas Gårdsknäcke',
        description: 'Krispigt knäckebröd med oregano, ost och soltorkade tomater.',
        category: 'knäckesticks',
        imageUrl: '/images/knackebrod.svg',
        pricePerUnit: 7500,
        profitPerUnit: 3500,
        sortOrder: 3,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-4' },
      update: {},
      create: {
        id: 'prod-4',
        organizationId: org.id,
        name: 'Josefinas Finknäcke',
        description: 'Delikat knäcke med vallmo, linfrö och sesam.',
        category: 'knäckesticks',
        imageUrl: '/images/finknaecke.svg',
        pricePerUnit: 7500,
        profitPerUnit: 3500,
        sortOrder: 4,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-5' },
      update: {},
      create: {
        id: 'prod-5',
        organizationId: org.id,
        name: 'Smillas Sursockrade Godisar',
        description: 'Surt sortimentsgodis, veganskt och glutenfritt. 500g per burk.',
        category: 'godis',
        imageUrl: '/images/godis.svg',
        pricePerUnit: 7500,
        profitPerUnit: 3500,
        sortOrder: 5,
      },
    }),
    prisma.product.upsert({
      where: { id: 'prod-6' },
      update: {},
      create: {
        id: 'prod-6',
        organizationId: org.id,
        name: 'Kapten Pelles Sjörövarlakrits',
        description: 'Blandad lakritssortiment för alla lakritsälskare.',
        category: 'godis',
        imageUrl: '/images/lakrits.svg',
        pricePerUnit: 7500,
        profitPerUnit: 3500,
        sortOrder: 6,
      },
    }),
  ])

  // Lag
  const lag = await Promise.all([
    prisma.team.upsert({
      where: { slug: 'fotbollslaget-alfa' },
      update: {},
      create: {
        organizationId: org.id,
        name: 'Fotbollslaget Alfa',
        slug: 'fotbollslaget-alfa',
        description: 'Vi samlar in pengar till vår sommarturné 2025!',
        goalAmount: 1000000,
      },
    }),
    prisma.team.upsert({
      where: { slug: 'klass-5b' },
      update: {},
      create: {
        organizationId: org.id,
        name: 'Klass 5B',
        slug: 'klass-5b',
        description: 'Skolresa till Stockholm i juni – hjälp oss nå målet!',
        goalAmount: 750000,
      },
    }),
    prisma.team.upsert({
      where: { slug: 'simklubben-vagen' },
      update: {},
      create: {
        organizationId: org.id,
        name: 'Simklubben Vågen',
        slug: 'simklubben-vagen',
        description: 'Ny utrustning till träningslägret behövs – stöd oss!',
        goalAmount: 600000,
      },
    }),
  ])

  // Användare
  const adminHash = await bcrypt.hash('admin123', 12)
  const teamHash = await bcrypt.hash('team123', 12)

  await prisma.user.upsert({
    where: { email: 'admin@ifkdemo.se' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'admin@ifkdemo.se',
      name: 'Admin',
      hashedPassword: adminHash,
      role: 'ADMIN',
    },
  })

  await prisma.user.upsert({
    where: { email: 'fotboll@ifkdemo.se' },
    update: {},
    create: {
      organizationId: org.id,
      teamId: lag[0].id,
      email: 'fotboll@ifkdemo.se',
      name: 'Fotbollsledare',
      hashedPassword: teamHash,
      role: 'TEAM_MANAGER',
    },
  })

  await prisma.user.upsert({
    where: { email: 'klass5b@ifkdemo.se' },
    update: {},
    create: {
      organizationId: org.id,
      teamId: lag[1].id,
      email: 'klass5b@ifkdemo.se',
      name: 'Lärare Karlsson',
      hashedPassword: teamHash,
      role: 'TEAM_MANAGER',
    },
  })

  await prisma.user.upsert({
    where: { email: 'simklubben@ifkdemo.se' },
    update: {},
    create: {
      organizationId: org.id,
      teamId: lag[2].id,
      email: 'simklubben@ifkdemo.se',
      name: 'Simtränare Lindgren',
      hashedPassword: teamHash,
      role: 'TEAM_MANAGER',
    },
  })

  // Exempelbeställningar
  const kundNamn = ['Anna Svensson', 'Lars Johansson', 'Maria Pettersson', 'Erik Karlsson', 'Sara Lindqvist', 'Johan Nilsson', 'Karin Berg', 'Anders Holm']

  for (let i = 0; i < 15; i++) {
    const team = lag[i % 3]
    const prod1 = produkter[i % 6]
    const prod2 = produkter[(i + 2) % 6]
    const qty1 = Math.floor(Math.random() * 4) + 1
    const qty2 = Math.floor(Math.random() * 3) + 1
    const total = qty1 * 7500 + qty2 * 7500
    const profit = qty1 * 3500 + qty2 * 3500

    await prisma.order.create({
      data: {
        teamId: team.id,
        customerName: kundNamn[i % kundNamn.length],
        customerEmail: `kund${i + 1}@example.com`,
        customerPhone: `070-${String(i + 1).padStart(3, '0')} 00 ${String(i + 1).padStart(2, '0')}`,
        status: i < 5 ? 'DELIVERED' : i < 10 ? 'CONFIRMED' : 'PENDING',
        paymentStatus: i < 5 ? 'PAID' : 'UNPAID',
        totalAmount: total,
        totalProfit: profit,
        createdAt: new Date(Date.now() - (15 - i) * 24 * 60 * 60 * 1000),
        items: {
          create: [
            { productId: prod1.id, quantity: qty1, unitPrice: 7500, unitProfit: 3500 },
            { productId: prod2.id, quantity: qty2, unitPrice: 7500, unitProfit: 3500 },
          ],
        },
      },
    })
  }

  console.log('✅ Demodata skapad!')
  console.log('Admin:       admin@ifkdemo.se / admin123')
  console.log('Fotboll:     fotboll@ifkdemo.se / team123')
  console.log('Klass 5B:    klass5b@ifkdemo.se / team123')
  console.log('Simklubben:  simklubben@ifkdemo.se / team123')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
