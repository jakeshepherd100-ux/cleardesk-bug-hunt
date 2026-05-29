import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 })
    }

    const existing = await prisma.candidate.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(existing)
    }

    const candidate = await prisma.candidate.create({
      data: { name, email },
    })

    return NextResponse.json(candidate, { status: 201 })
  } catch (error) {
    console.error('Candidates POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (email) {
      const candidate = await prisma.candidate.findUnique({
        where: { email },
        include: { submissions: true },
      })
      if (!candidate) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
      return NextResponse.json(candidate)
    }

    const candidates = await prisma.candidate.findMany({
      include: { submissions: true },
      orderBy: { totalScore: 'desc' },
    })
    return NextResponse.json(candidates)
  } catch (error) {
    console.error('Candidates GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
