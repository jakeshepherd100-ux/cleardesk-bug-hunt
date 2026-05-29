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
    <header className="sticky top-0 z-50 border-b border-challenge-border bg-cd-navy/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-cd-purple flex items-center justify-center text-white font-bold text-xs">CD</div>
            <span className="font-semibold text-sm text-white">ClearDesk</span>
            <span className="font-mono text-xs text-cd-purple-light bg-cd-purple/20 border border-cd-purple/30 px-2 py-0.5 rounded-full">Bug Hunt</span>
          </div>
          <span className="text-white/20">|</span>
          <span className="text-sm text-white/60">{candidateName}</span>
        </div>

        <div className="flex items-center gap-8">
          <Timer startedAt={startedAt} />

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40 uppercase tracking-widest font-mono">Score</span>
            <span className="text-lg font-bold text-cd-purple-light tabular-nums font-mono">
              {totalScore}
              <span className="text-white/30">/{maxScore}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
