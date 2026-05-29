import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// BUG-13: System prompt is missing the Ghost tiebreaker rule.
// The ideal fix adds: "When two archetypes are tied, always select Ghost as the winner."
const SYSTEM_PROMPT = `You are a management style classifier for a remote hiring platform.

You will receive quiz scores for five management archetypes: Delegator, Controller, Ghost, Skeptic, Builder.

Based on the scores, determine which archetype is dominant and return a classification.

Archetypes:
- Delegator: Trusts teams fully, focuses on outcomes, needs reliability
- Controller: Hands-on, detail-oriented, needs visibility and control
- Ghost: Hard to reach, inconsistent, needs proactive communication
- Skeptic: Resistant to offshore hiring, needs proof and track record
- Builder: Scaling fast, needs builders who can operate autonomously

Return ONLY valid JSON:
{
  "archetype": "<Delegator|Controller|Ghost|Skeptic|Builder>",
  "tagline": "<A short punchy tagline for this archetype, under 10 words>",
  "description": "<2-3 sentences describing this management style and what it means for hiring>",
  "recommendations": ["<rec 1>", "<rec 2>", "<rec 3>"]
}`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { scores } = body

    if (!scores) {
      return NextResponse.json({ error: 'Missing scores' }, { status: 400 })
    }

    const userMessage = `Quiz scores:
Delegator: ${scores.Delegator || 0}
Controller: ${scores.Controller || 0}
Ghost: ${scores.Ghost || 0}
Skeptic: ${scores.Skeptic || 0}
Builder: ${scores.Builder || 0}

Please classify the dominant management archetype.`

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 512,
      thinking: { type: 'adaptive' },
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
    console.error('Archetype API error:', error)
    return NextResponse.json({ error: 'Classification failed' }, { status: 500 })
  }
}
