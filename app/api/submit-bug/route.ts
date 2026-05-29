import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getBugById } from '@/lib/bugs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { candidateId, bugId, description, prompt } = body

    if (!candidateId || !bugId || !description || !prompt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const bug = getBugById(bugId)
    if (!bug) {
      return NextResponse.json({ error: 'Invalid bug ID' }, { status: 400 })
    }

    // Check prerequisites
    if (bug.prerequisiteIds.length > 0) {
      const completedSubmissions = await prisma.submission.findMany({
        where: {
          candidateId,
          bugId: { in: bug.prerequisiteIds },
          score: { gt: 0 },
        },
      })
      if (completedSubmissions.length < bug.prerequisiteIds.length) {
        return NextResponse.json(
          { error: 'Prerequisites not completed', prerequisiteIds: bug.prerequisiteIds },
          { status: 403 }
        )
      }
    }

    // Check if already submitted
    const existing = await prisma.submission.findFirst({
      where: { candidateId, bugId },
    })
    if (existing) {
      return NextResponse.json({ error: 'Already submitted this bug' }, { status: 409 })
    }

    // Score via Claude
    const scoreRes = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/score`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bugId, description, prompt }),
      }
    )

    let scoreData = { score: 0, label: 'Incomplete', feedback: 'Scoring unavailable.' }
    if (scoreRes.ok) {
      scoreData = await scoreRes.json()
    }

    const submission = await prisma.submission.create({
      data: {
        candidateId,
        bugId,
        description,
        prompt,
        score: scoreData.score,
        scoreLabel: scoreData.label,
        feedback: scoreData.feedback,
      },
    })

    // Update candidate total score
    const allSubmissions = await prisma.submission.findMany({
      where: { candidateId },
      select: { score: true },
    })
    const totalScore = allSubmissions.reduce((sum, s) => sum + (s.score || 0), 0)
    await prisma.candidate.update({
      where: { id: candidateId },
      data: { totalScore },
    })

    return NextResponse.json({ submission, scoreData })
  } catch (error) {
    console.error('Submit bug error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
