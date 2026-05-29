'use client'

import { BUGS, BugDefinition } from '@/lib/bugs'

interface Submission {
  bugId: string
  score: number | null
  scoreLabel: string | null
}

interface BugTrackerProps {
  submissions: Submission[]
  onSelectBug: (bug: BugDefinition) => void
  selectedBugId: string | null
}

const TIER_ORDER = ['easy', 'medium', 'hard'] as const
const TIER_LABELS: Record<string, string> = {
  easy: 'Easy — 1pt',
  medium: 'Medium — 2pts',
  hard: 'Hard — 3pts',
}

const SCORE_COLORS: Record<string, string> = {
  Complete: 'text-challenge-accent',
  Partial: 'text-challenge-amber',
  Minimal: 'text-orange-400',
  Incomplete: 'text-challenge-red',
}

export default function BugTracker({ submissions, onSelectBug, selectedBugId }: BugTrackerProps) {
  const submissionMap = new Map(submissions.map((s) => [s.bugId, s]))

  const completedIds = new Set(
    submissions.filter((s) => (s.score || 0) > 0).map((s) => s.bugId)
  )

  function isUnlocked(bug: BugDefinition): boolean {
    return bug.prerequisiteIds.every((id) => completedIds.has(id))
  }

  return (
    <aside className="w-72 shrink-0 border-r border-challenge-border overflow-y-auto">
      <div className="p-4">
        <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
          Bug Registry
        </h2>

        {TIER_ORDER.map((tier) => {
          const bugs = BUGS.filter((b) => b.tier === tier)
          return (
            <div key={tier} className="mb-6">
              <div className="font-mono text-xs uppercase tracking-widest text-gray-600 mb-2 px-2">
                {TIER_LABELS[tier]}
              </div>
              <div className="space-y-1">
                {bugs.map((bug) => {
                  const sub = submissionMap.get(bug.id)
                  const unlocked = isUnlocked(bug)
                  const isSelected = bug.id === selectedBugId

                  return (
                    <button
                      key={bug.id}
                      onClick={() => unlocked && onSelectBug(bug)}
                      disabled={!unlocked}
                      className={`w-full text-left px-3 py-2 rounded font-mono text-xs transition-all
                        ${isSelected ? 'bg-challenge-accent/10 border border-challenge-accent/40' : 'border border-transparent'}
                        ${unlocked ? 'hover:bg-challenge-surface cursor-pointer' : 'opacity-40 cursor-not-allowed'}
                      `}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-500 shrink-0">{bug.id}</span>
                        {sub ? (
                          <span className={`text-xs font-bold ${SCORE_COLORS[sub.scoreLabel || ''] || 'text-gray-400'}`}>
                            {sub.scoreLabel}
                          </span>
                        ) : !unlocked ? (
                          <span className="text-gray-600">🔒</span>
                        ) : null}
                      </div>
                      <div className={`mt-0.5 ${unlocked ? 'text-gray-300' : 'text-gray-600'}`}>
                        {bug.title}
                      </div>
                    </button>
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
