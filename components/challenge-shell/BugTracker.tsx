'use client'

import { BUGS } from '@/lib/bugs'

interface Submission {
  bugId: string
  score: number | null
  scoreLabel: string | null
}

interface BugTrackerProps {
  submissions: Submission[]
}

const TIER_ORDER = ['easy', 'medium', 'hard'] as const
const TIER_LABELS: Record<string, string> = {
  easy: 'Easy · 1pt each',
  medium: 'Medium · 2pts each',
  hard: 'Hard · 3pts each',
}
const TIER_COLORS: Record<string, string> = {
  easy: 'text-green-400',
  medium: 'text-amber-400',
  hard: 'text-red-400',
}

const SCORE_COLORS: Record<string, string> = {
  Complete: 'text-green-400',
  Partial: 'text-amber-400',
  Minimal: 'text-orange-400',
  Incomplete: 'text-red-400',
}

export default function BugTracker({ submissions }: BugTrackerProps) {
  const submissionMap = new Map(submissions.map((s) => [s.bugId, s]))
  const totalSubmitted = submissions.length
  const totalBugs = BUGS.length

  return (
    <aside className="w-56 shrink-0 border-r border-challenge-border overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-challenge-border">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded bg-cd-purple flex items-center justify-center text-white font-bold text-xs">CD</div>
          <span className="text-white font-semibold text-sm">Bugs Found</span>
        </div>
        <p className="text-xs text-gray-500 font-mono">{totalSubmitted}/{totalBugs} reported</p>
      </div>

      <div className="p-3 flex-1">
        {TIER_ORDER.map((tier) => {
          const bugs = BUGS.filter((b) => b.tier === tier)
          return (
            <div key={tier} className="mb-5">
              <div className={`font-mono text-xs uppercase tracking-widest mb-2 px-1 ${TIER_COLORS[tier]}`}>
                {TIER_LABELS[tier]}
              </div>
              <div className="space-y-1">
                {bugs.map((bug) => {
                  const sub = submissionMap.get(bug.id)

                  return (
                    <div
                      key={bug.id}
                      className={`px-3 py-2 rounded-lg font-mono text-xs ${
                        sub ? 'bg-white/5' : 'opacity-30'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`shrink-0 font-bold ${sub ? 'text-gray-300' : 'text-gray-600'}`}>
                          {sub ? bug.id : '???'}
                        </span>
                        {sub && (
                          <span className={`text-xs font-bold ${SCORE_COLORS[sub.scoreLabel || ''] || 'text-gray-400'}`}>
                            {sub.scoreLabel}
                          </span>
                        )}
                      </div>
                      {sub && (
                        <div className="mt-0.5 text-gray-500 truncate text-xs">{bug.title}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
