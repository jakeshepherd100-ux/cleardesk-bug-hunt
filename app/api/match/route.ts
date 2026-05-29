import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rankProfiles, ClientProfile } from '@/lib/matching'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { roleType, hoursNeeded, requiredApps, requiredSkills, yearsExpNeeded } = body

    const client: ClientProfile = {
      roleType: roleType || '',
      hoursNeeded: hoursNeeded || 40,
      requiredApps: requiredApps || [],
      requiredSkills: requiredSkills || [],
      yearsExpNeeded: yearsExpNeeded || 0,
    }

    const profiles = await prisma.rtmProfile.findMany()
    const ranked = rankProfiles(client, profiles)

    return NextResponse.json(ranked.slice(0, 5))
  } catch (error) {
    console.error('Match API error:', error)
    return NextResponse.json({ error: 'Matching failed' }, { status: 500 })
  }
}
