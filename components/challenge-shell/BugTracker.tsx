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

export default function BugTracker({ submissions, onSelectBug, selectedBugId }: BugTrackerProps) {
  const submissionMap = new Map(submissions.map((s) => [s.bugId, s]))

  const completedIds = new Set(
    submissions.filter((s) => (s.score || 0) > 0).map((s) => s.bugId)
  )
  const submittedIds = new Set(submissions.map((s) => s.bugId))

  function isUnlocked(bug: BugDefinition): boolean {
    return bug.prerequisiteIds.every((id) => completedIds.has(id))
  }

  const totalSubmitted = submissions.length
  const totalBugs = BUGS.length

  return (
    <aside className="w-64 shrink-0 border-r border-challenge-border overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-challenge-border">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded bg-cd-purple flex items-center justify-center text-white font-bold text-xs">CD</div>
          <span className="text-white font-semibold text-sm">Bug Registry</span>
        </div>
        <p className="text-xs text-gray-500 font-mono">{totalSubmitted}/{totalBugs} submitted</p>
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
                  const unlocked = isUnlocked(bug)
                  const submitted = submittedIds.has(bug.id)
                  const isSelected = bug.id === selectedBugId

                  return (
                    <button
                      key={bug.id}
                      onClick={() => unlocked && onSelectBug(bug)}
                      disabled={!unlocked}
                      className={`w-full text-left px-3 py-2 rounded-lg font-mono text-xs transition-all
                        ${isSelected ? 'bg-cd-purple/15 border border-cd-purple/40' : 'border border-transparent'}
                        ${unlocked ? 'hover:bg-white/5 cursor-pointer' : 'opacity-35 cursor-not-allowed'}
                      `}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-400 shrink-0 font-bold">{bug.id}</span>
                        {sub ? (
                          <span className={`text-xs font-bold ${SCORE_COLORS[sub.scoreLabel || ''] || 'text-gray-400'}`}>
                            {sub.scoreLabel}
                          </span>
                        ) : !unlocked ? (
                          <span className="text-gray-700">🔒</span>
                        ) : (
                          <span className="text-gray-700 text-xs">—</span>
                        )}
                      </div>
                      <div className={`mt-0.5 text-xs truncate ${
                        submitted ? 'text-gray-400' : unlocked ? 'text-gray-500 italic' : 'text-gray-700'
                      }`}>
                        {submitted ? bug.title : unlocked ? 'Click to investigate' : '???'}
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
