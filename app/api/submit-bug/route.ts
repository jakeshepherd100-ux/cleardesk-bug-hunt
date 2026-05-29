import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from '@/lib/prisma'
import { BUGS } from '@/lib/bugs'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const bugList = BUGS.map((b) =>
  `${b.id} (${b.tier}, ${b.points}pt): ${b.title} — ${b.idealFixSummary}`
).join('\n')

const SYSTEM_PROMPT = `You are evaluating a bug report submitted during a software QA hiring challenge.

The app being tested has exactly these known bugs:
${bugList}

Given the candidate's report, you must:
1. Identify which known bug it most closely matches (if any)
2. Score the quality of their description and proposed fix

Matching rules:
- Match if the candidate clearly identified the same root cause, even if they describe it differently
- If the report vaguely gestures at a real bug area but misses the root cause, still match but score low
- Only return "none" if the report describes something that is NOT one of the known bugs

Scoring (0-3):
- 3: Correctly identifies root cause AND proposes a complete, correct fix
- 2: Identifies the bug but fix is incomplete or has gaps
- 1: Shows awareness of the issue but misses key details
- 0: Does not demonstrate understanding

Return ONLY valid JSON:
{
  "bugId": "<BUG-XX or none>",
  "score": <0-3>,
  "label": "<Complete|Partial|Minimal|Incomplete>",
  "feedback": "<1-2 sentences of specific feedback>"
}`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { candidateId, area, description, fix } = body

    if (!candidateId || !description || !fix) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const userMessage = `Area of the app: ${area || 'Not specified'}

Candidate's bug description:
${description}

Candidate's proposed fix:
${fix}`

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const textBlock = message.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text in response')
    }

    const parsed = JSON.parse(textBlock.text) as {
      bugId: string
      score: number
      label: string
      feedback: string
    }

    // Not a recognized bug
    if (!parsed.bugId || parsed.bugId === 'none') {
      return NextResponse.json({
        matched: false,
        feedback: parsed.feedback || 'This does not match any known bug in the app.',
      })
    }

    // Already submitted this bug
    const existing = await prisma.submission.findFirst({
      where: { candidateId, bugId: parsed.bugId },
    })
    if (existing) {
      return NextResponse.json({
        matched: true,
        alreadySubmitted: true,
        bugId: parsed.bugId,
        feedback: `You already reported ${parsed.bugId}. Each bug can only be submitted once.`,
      })
    }

    const submission = await prisma.submission.create({
      data: {
        candidateId,
        bugId: parsed.bugId,
        description,
        prompt: fix,
        score: parsed.score,
        scoreLabel: parsed.label,
        feedback: parsed.feedback,
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

    return NextResponse.json({
      matched: true,
      alreadySubmitted: false,
      bugId: parsed.bugId,
      score: parsed.score,
      label: parsed.label,
      feedback: parsed.feedback,
      submission,
    })
  } catch (error) {
    console.error('Submit bug error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
