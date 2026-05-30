'use client'

import { useState } from 'react'

// BUG-14: NEXT_PUBLIC_ANTHROPIC_API_KEY is referenced here — this exposes the key to the browser.
// API keys must NEVER be prefixed with NEXT_PUBLIC_. Anthropic calls should go through server-side API routes.
const _EXPOSED_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY

type Archetype = 'Delegator' | 'Controller' | 'Ghost' | 'Skeptic' | 'Builder'

interface ArchetypeResult {
  archetype: Archetype
  tagline: string
  description: string
  recommendations: string[]
}

interface ManagementAssessmentProps {
  onComplete: (result: ArchetypeResult) => void
  onBack: () => void
}

const QUESTIONS = [
  {
    id: 1,
    question: "How do you prefer to manage your remote team's daily output?",
    answers: [
      { label: 'A', text: 'Set goals and let them run — I check in on results, not process', archetypes: ['Delegator'] },
      { label: 'B', text: "I want to see what they're working on at all times", archetypes: ['Controller'] },
      { label: 'C', text: "I'm often unavailable but expect things to get done", archetypes: ['Ghost'] },
      { label: 'D', text: "I'm skeptical it works without someone in the office", archetypes: ['Skeptic'] },
    ],
  },
  {
    id: 2,
    question: 'How often do you check in with your team?',
    answers: [
      { label: 'A', text: 'Weekly syncs, async the rest', archetypes: ['Delegator'] },
      { label: 'B', text: 'Daily standups, sometimes twice a day', archetypes: ['Controller'] },
      { label: 'C', text: 'When I remember or when there\'s a fire', archetypes: ['Ghost'] },
      { label: 'D', text: 'I haven\'t had a remote team before', archetypes: ['Skeptic'] },
    ],
  },
  {
    id: 3,
    question: 'What keeps you up at night about hiring remote?',
    answers: [
      { label: 'A', text: 'Finding someone truly self-directed', archetypes: ['Delegator'] },
      { label: 'B', text: 'Not being able to see what they\'re actually doing', archetypes: ['Controller'] },
      { label: 'C', text: 'Honestly, I don\'t have time to manage anyone closely', archetypes: ['Ghost'] },
      { label: 'D', text: 'Quality — will the work actually be good enough?', archetypes: ['Skeptic'] },
      { label: 'E', text: 'I need someone who can grow with us as we scale', archetypes: ['Builder'] },
    ],
  },
  {
    id: 4,
    question: 'How do you handle mistakes or missed deadlines?',
    answers: [
      { label: 'A', text: 'Coach through it and adjust expectations going forward', archetypes: ['Delegator'] },
      { label: 'B', text: 'Review what went wrong and add a checkpoint to prevent it', archetypes: ['Controller'] },
      { label: 'C', text: 'Usually find out too late to course-correct', archetypes: ['Ghost'] },
      { label: 'D', text: 'Use it as evidence to question the whole arrangement', archetypes: ['Skeptic'] },
    ],
  },
  {
    id: 5,
    question: 'How would you describe your communication style?',
    answers: [
      { label: 'A', text: 'Clear and outcomes-oriented — I say what I need', archetypes: ['Delegator'] },
      { label: 'B', text: 'Detailed and frequent — I like to stay in the loop', archetypes: ['Controller'] },
      { label: 'C', text: 'Sporadic — I respond when I can', archetypes: ['Ghost'] },
      { label: 'D', text: 'Cautious — I want to understand before committing', archetypes: ['Skeptic'] },
      { label: 'E', text: 'Direct and fast — we move quick around here', archetypes: ['Builder'] },
    ],
  },
  {
    id: 6,
    question: "What's your biggest day-to-day challenge right now?",
    answers: [
      // BUG-07: Answer A should increment BOTH Delegator AND Ghost, but only Delegator is listed
      { label: 'A', text: "I'm stretched too thin — I need someone to take things off my plate", archetypes: ['Delegator'] },
      { label: 'B', text: "I need more visibility into what my team is actually doing", archetypes: ['Controller'] },
      { label: 'C', text: "Keeping up with everything — I\'m in reactive mode constantly", archetypes: ['Ghost'] },
      { label: 'D', text: "Proving ROI to myself or stakeholders on remote hiring", archetypes: ['Skeptic'] },
    ],
  },
  {
    id: 7,
    question: "How do you feel about using tools like Hubstaff or time-tracking software?",
    answers: [
      { label: 'A', text: "Fine with it — accountability is good", archetypes: ['Delegator', 'Controller'] },
      { label: 'B', text: "I'd require it — I want screenshots and logs", archetypes: ['Controller'] },
      { label: 'C', text: "Haven't thought about it", archetypes: ['Ghost'] },
      { label: 'D', text: "I'd want to verify they're actually working, so yes", archetypes: ['Skeptic'] },
    ],
  },
  {
    id: 8,
    question: "How are you planning to grow your business in the next 12 months?",
    answers: [
      { label: 'A', text: "Steady growth — optimize what we have", archetypes: ['Delegator'] },
      { label: 'B', text: "Controlled expansion — new locations or services", archetypes: ['Controller'] },
      { label: 'C', text: "Honestly I'm just trying to keep the lights on", archetypes: ['Ghost'] },
      { label: 'D', text: "Exploring remote but need to see it work first", archetypes: ['Skeptic'] },
      { label: 'E', text: "Aggressive — we're in scale mode", archetypes: ['Builder'] },
    ],
  },
]

const ARCHETYPE_COLORS: Record<Archetype, string> = {
  Delegator: 'text-green-700 border-green-300 bg-green-50',
  Controller: 'text-blue-700 border-blue-300 bg-blue-50',
  Ghost: 'text-cd-purple border-cd-purple/30 bg-cd-purple/5',
  Skeptic: 'text-amber-700 border-amber-300 bg-amber-50',
  Builder: 'text-orange-700 border-orange-300 bg-orange-50',
}

export default function ManagementAssessment({ onComplete, onBack }: ManagementAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [scores, setScores] = useState<Record<Archetype, number>>({
    Delegator: 0,
    Controller: 0,
    Ghost: 0,
    Skeptic: 0,
    Builder: 0,
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ArchetypeResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleAnswer(archetypes: string[]) {
    const newScores = { ...scores }
    for (const arch of archetypes) {
      newScores[arch as Archetype] = (newScores[arch as Archetype] || 0) + 1
    }
    setScores(newScores)

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // All questions answered — call archetype API
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/archetype', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scores: newScores }),
        })
        if (!res.ok) throw new Error('Classification failed')
        const data = await res.json()
        setResult(data)
      } catch (err) {
        setError('Failed to classify archetype. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-8 h-8 border-2 border-cd-purple border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">Analyzing your management style...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => { setError(null); setCurrentQuestion(0); setScores({ Delegator: 0, Controller: 0, Ghost: 0, Skeptic: 0, Builder: 0 }) }}
          className="text-cd-purple underline"
        >
          Start Over
        </button>
      </div>
    )
  }

  if (result) {
    const colorClass = ARCHETYPE_COLORS[result.archetype as Archetype] || 'text-gray-700 border-gray-200 bg-gray-50'
    return (
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-cd-navy mb-1">Your Management Archetype</h2>
          <p className="text-gray-400 text-sm">Based on your responses</p>
        </div>

        <div className={`rounded-xl border-2 p-6 mb-6 ${colorClass}`}>
          <div className="text-4xl font-black mb-1">{result.archetype}</div>
          <div className="text-lg mb-4 opacity-80">"{result.tagline}"</div>
          <p className="text-sm leading-relaxed opacity-90">{result.description}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Recommendations for you</h3>
          <ul className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-cd-purple mt-0.5 font-bold">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* BUG-04: Back button does nothing — no handler */}
        {/* BUG-15: No CTA or next steps after archetype reveal */}
        <div className="flex gap-3">
          <button
            onClick={undefined as unknown as React.MouseEventHandler}
            className="flex-1 border border-gray-200 text-gray-400 py-3 rounded-lg hover:border-gray-300 transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>
    )
  }

  const q = QUESTIONS[currentQuestion]
  const progress = ((currentQuestion) / QUESTIONS.length) * 100

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Question {currentQuestion + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-cd-purple transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-bold text-cd-navy mb-6">{q.question}</h2>

      <div className="space-y-3">
        {q.answers.map((answer) => (
          <button
            key={answer.label}
            onClick={() => handleAnswer(answer.archetypes)}
            className="w-full text-left flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-cd-purple/40 hover:bg-cd-purple/5 transition-all group"
          >
            <span className="font-mono text-cd-purple font-bold text-sm mt-0.5 shrink-0">
              {answer.label}
            </span>
            <span className="text-gray-700 text-sm leading-relaxed">{answer.text}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onBack}
        className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        ← Back to profiler
      </button>
    </div>
  )
}
