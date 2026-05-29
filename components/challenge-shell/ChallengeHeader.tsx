'use client'

import Timer from './Timer'

interface ChallengeHeaderProps {
  candidateName: string
  totalScore: number
  startedAt: string
  maxScore: number
}

export default function ChallengeHeader({
  candidateName,
  totalScore,
  startedAt,
  maxScore,
}: ChallengeHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-challenge-border bg-challenge-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-challenge-accent animate-pulse" />
            <span className="font-mono text-sm font-bold uppercase tracking-widest text-challenge-accent">
              ClearDesk Bug Hunt
            </span>
          </div>
          <span className="text-gray-600">|</span>
          <span className="font-mono text-sm text-gray-400">{candidateName}</span>
        </div>

        <div className="flex items-center gap-8">
          <Timer startedAt={startedAt} />

          <div className="flex items-center gap-2 font-mono">
            <span className="text-xs text-gray-500 uppercase tracking-widest">Score</span>
            <span className="text-lg font-bold text-white tabular-nums">
              {totalScore}
              <span className="text-gray-600">/{maxScore}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
