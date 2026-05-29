// BUG-08: This page has zero authentication — it's completely public.
// Anyone can view candidate match data without logging in.
// Fix: Check for a valid session/token and redirect unauthenticated users.

// BUG-10: No empty state when no match profile is found.

import { prisma } from '@/lib/prisma'

export default async function StatusPage() {
  // BUG-08: No auth check here — should redirect if not authenticated
  const candidates = await prisma.candidate.findMany({
    include: { submissions: true },
    orderBy: { totalScore: 'desc' },
    take: 10,
  })

  return (
    <div className="min-h-screen bg-challenge-bg p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">Candidate Match Status</h1>
        <p className="text-gray-500 text-sm mb-8 font-mono">Live view · {candidates.length} candidates</p>

        {/* BUG-10: No empty state when candidates.length === 0 */}

        <div className="space-y-4">
          {candidates.map((candidate) => {
            const completedBugs = candidate.submissions.filter((s) => (s.score || 0) > 0)
            return (
              <div
                key={candidate.id}
                className="bg-challenge-surface border border-challenge-border rounded-lg p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white">{candidate.name}</h3>
                    <p className="text-sm text-gray-500 font-mono">{candidate.email}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-challenge-accent">{candidate.totalScore}</div>
                    <div className="text-xs text-gray-500 font-mono">total points</div>
                  </div>
                </div>

                <div className="mt-3 flex gap-4 text-sm text-gray-400">
                  <span>{completedBugs.length} bugs fixed</span>
                  <span>·</span>
                  <span>{candidate.submissions.length} submitted</span>
                  <span>·</span>
                  <span>Started {new Date(candidate.startedAt).toLocaleDateString()}</span>
                </div>

                {candidate.submissions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {candidate.submissions.map((sub) => (
                      <span
                        key={sub.id}
                        className={`text-xs px-2 py-0.5 rounded-full border font-mono ${
                          (sub.score || 0) >= 2
                            ? 'border-challenge-accent/40 text-challenge-accent bg-challenge-accent/10'
                            : (sub.score || 0) === 1
                            ? 'border-challenge-amber/40 text-challenge-amber bg-amber-900/10'
                            : 'border-gray-700 text-gray-600'
                        }`}
                      >
                        {sub.bugId}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
