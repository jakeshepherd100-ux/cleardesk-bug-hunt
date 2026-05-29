import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BUGS, TOTAL_POINTS } from '@/lib/bugs'

async function getAdminData() {
  const cookieStore = cookies()
  const adminToken = cookieStore.get('admin_token')

  if (adminToken?.value !== process.env.ADMIN_PASSWORD) {
    redirect('/admin')
  }

  const candidates = await prisma.candidate.findMany({
    include: { submissions: true },
    orderBy: { totalScore: 'desc' },
  })

  return { candidates }
}

export default async function AdminDashboard() {
  const { candidates } = await getAdminData()

  const totalSubmissions = candidates.reduce((sum, c) => sum + c.submissions.length, 0)
  const avgScore =
    candidates.length > 0
      ? Math.round(candidates.reduce((sum, c) => sum + c.totalScore, 0) / candidates.length)
      : 0

  const bugSubmissionCounts = BUGS.map((bug) => ({
    bug,
    count: candidates.reduce(
      (sum, c) => sum + c.submissions.filter((s) => s.bugId === bug.id).length,
      0
    ),
    avgScore: (() => {
      const subs = candidates.flatMap((c) =>
        c.submissions.filter((s) => s.bugId === bug.id && s.score !== null)
      )
      return subs.length > 0
        ? Math.round(subs.reduce((sum, s) => sum + (s.score || 0), 0) / subs.length * 10) / 10
        : null
    })(),
  }))

  return (
    <div className="min-h-screen bg-challenge-bg p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm font-mono">ClearDesk Bug Hunt · Live results</p>
          </div>
          <form action="/api/admin" method="GET">
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors font-mono"
            >
              ← Challenge view
            </a>
          </form>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Candidates', value: candidates.length },
            { label: 'Submissions', value: totalSubmissions },
            { label: 'Avg Score', value: `${avgScore}/${TOTAL_POINTS}` },
            { label: 'Max Possible', value: TOTAL_POINTS },
          ].map((stat) => (
            <div key={stat.label} className="bg-challenge-surface border border-challenge-border rounded-xl p-4">
              <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 font-mono uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Candidate leaderboard */}
          <div className="bg-challenge-surface border border-challenge-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-challenge-border">
              <h2 className="font-mono text-xs uppercase tracking-widest text-gray-500">Leaderboard</h2>
            </div>
            <div className="divide-y divide-challenge-border">
              {candidates.length === 0 ? (
                <div className="p-6 text-center text-gray-600 text-sm">No candidates yet</div>
              ) : (
                candidates.map((c, idx) => (
                  <div key={c.id} className="px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-gray-600 w-4">{idx + 1}</span>
                      <div>
                        <div className="text-sm font-medium text-white">{c.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{c.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-challenge-accent">{c.totalScore}pts</div>
                      <div className="text-xs text-gray-500">{c.submissions.length} submitted</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bug attempt stats */}
          <div className="bg-challenge-surface border border-challenge-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-challenge-border">
              <h2 className="font-mono text-xs uppercase tracking-widest text-gray-500">Bug Attempt Rates</h2>
            </div>
            <div className="divide-y divide-challenge-border max-h-[500px] overflow-y-auto">
              {bugSubmissionCounts.map(({ bug, count, avgScore: avg }) => (
                <div key={bug.id} className="px-5 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-500 w-14">{bug.id}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${
                      bug.tier === 'easy' ? 'bg-green-900/30 text-green-500' :
                      bug.tier === 'medium' ? 'bg-amber-900/30 text-amber-500' :
                      'bg-red-900/30 text-red-500'
                    }`}>
                      {bug.tier}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-300">{count} attempts</span>
                    {avg !== null && (
                      <span className="text-xs text-gray-500 ml-2 font-mono">avg {avg}/3</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed submissions table */}
        {candidates.length > 0 && (
          <div className="mt-6 bg-challenge-surface border border-challenge-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-challenge-border">
              <h2 className="font-mono text-xs uppercase tracking-widest text-gray-500">All Submissions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-challenge-border text-xs font-mono uppercase tracking-widest text-gray-500">
                    <th className="px-5 py-2.5 text-left">Candidate</th>
                    <th className="px-5 py-2.5 text-left">Bug</th>
                    <th className="px-5 py-2.5 text-left">Score</th>
                    <th className="px-5 py-2.5 text-left">Label</th>
                    <th className="px-5 py-2.5 text-left">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-challenge-border">
                  {candidates.flatMap((c) =>
                    c.submissions.map((s) => (
                      <tr key={s.id} className="hover:bg-challenge-bg/50 transition-colors">
                        <td className="px-5 py-2.5 text-gray-300">{c.name}</td>
                        <td className="px-5 py-2.5 font-mono text-gray-400">{s.bugId}</td>
                        <td className="px-5 py-2.5 font-mono text-white">{s.score}/3</td>
                        <td className={`px-5 py-2.5 font-mono text-xs ${
                          s.scoreLabel === 'Complete' ? 'text-challenge-accent' :
                          s.scoreLabel === 'Partial' ? 'text-challenge-amber' :
                          'text-gray-500'
                        }`}>
                          {s.scoreLabel}
                        </td>
                        <td className="px-5 py-2.5 text-gray-500 text-xs font-mono">
                          {new Date(s.submittedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
