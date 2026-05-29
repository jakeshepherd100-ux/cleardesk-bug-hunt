import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getBugById } from '@/lib/bugs'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a senior software engineer evaluating candidate bug fix submissions for a hiring challenge.

You will receive:
1. A bug ID and its ideal fix summary
2. The candidate's description of the bug
3. The candidate's proposed fix prompt

Evaluate the submission on a scale of 0-3:
- 3 (Complete): Correctly identifies the root cause AND proposes a complete, correct fix
- 2 (Partial): Identifies the bug but fix is incomplete or has gaps
- 1 (Minimal): Shows awareness of the issue but misses key details
- 0 (Incomplete): Does not demonstrate understanding of the bug or fix

Return ONLY valid JSON in this exact format:
{
  "score": <0-3>,
  "label": "<Complete|Partial|Minimal|Incomplete>",
  "feedback": "<1-2 sentence specific feedback on their answer>"
}`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { bugId, description, prompt } = body

    if (!bugId || !description || !prompt) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const bug = getBugById(bugId)
    if (!bug) {
      return NextResponse.json({ error: 'Invalid bug ID' }, { status: 400 })
    }

    const userMessage = `Bug ID: ${bug.id}
Bug Title: ${bug.title}
Ideal Fix Summary: ${bug.idealFixSummary}

Candidate's Bug Description:
${description}

Candidate's Proposed Fix:
${prompt}

Please evaluate this submission.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const textBlock = message.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text in response')
    }

    const parsed = JSON.parse(textBlock.text)
    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Score API error:', error)
    return NextResponse.json(
      { score: 0, label: 'Incomplete', feedback: 'Scoring error — please try again.' },
      { status: 500 }
    )
  }
}
