import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

function isAuthenticated(req: NextRequest): boolean {
  const cookieStore = cookies()
  const adminToken = cookieStore.get('admin_token')
  return adminToken?.value === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const candidates = await prisma.candidate.findMany({
      include: { submissions: true },
      orderBy: { totalScore: 'desc' },
    })

    const bugDefs = await prisma.bugDefinition.findMany()

    return NextResponse.json({ candidates, bugDefs })
  } catch (error) {
    console.error('Admin GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { password } = body

    if (password === process.env.ADMIN_PASSWORD) {
      const res = NextResponse.json({ success: true })
      res.cookies.set('admin_token', password, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
      })
      return res
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch (error) {
    console.error('Admin POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
