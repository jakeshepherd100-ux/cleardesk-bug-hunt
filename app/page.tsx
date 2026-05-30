'use client'

import { useState, useCallback } from 'react'
import ChallengeHeader from '@/components/challenge-shell/ChallengeHeader'
import BugTracker from '@/components/challenge-shell/BugTracker'
import SubmissionDrawer from '@/components/challenge-shell/SubmissionDrawer'
import BrokenApp from '@/components/broken-app/BrokenApp'
import { TOTAL_POINTS } from '@/lib/bugs'

interface Candidate {
  id: string
  name: string
  email: string
  startedAt: string
  totalScore: number
  submissions: Array<{
    bugId: string
    score: number | null
    scoreLabel: string | null
    feedback: string | null
  }>
}

type Stage = 'register' | 'challenge'

export default function Home() {
  const [stage, setStage] = useState<Stage>('register')
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'app' | 'report'>('app')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!regName.trim() || !regEmail.trim()) {
      setRegError('Name and email are required.')
      return
    }
    setRegLoading(true)
    setRegError(null)

    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName.trim(), email: regEmail.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setRegError(data.error || 'Registration failed')
        return
      }
      setCandidate({ ...data, submissions: data.submissions || [] })
      setStage('challenge')
    } catch {
      setRegError('Network error — please try again.')
    } finally {
      setRegLoading(false)
    }
  }

  const refreshCandidate = useCallback(async () => {
    if (!candidate) return
    try {
      const res = await fetch(`/api/candidates?email=${encodeURIComponent(candidate.email)}`)
      if (res.ok) {
        const data = await res.json()
        setCandidate(data)
      }
    } catch {
      // silent
    }
  }, [candidate])

  // Registration
  if (stage === 'register') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'linear-gradient(135deg, #092B48 0%, #0d3a60 50%, #092B48 100%)' }}>
        <div className="w-full max-w-lg">

          {/* Persona briefing */}
          <div className="mb-5 bg-cd-blue/10 border border-cd-blue/25 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-cd-blue text-xs font-bold uppercase tracking-widest">📋 Your Scenario</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              <strong className="text-white">You are a potential ClearDesk client.</strong> You came across ClearDesk on LinkedIn and clicked through to their talent-matching tool. You're excited — your business is growing and you need remote support. You've arrived at the tool ready to find your first hire.
            </p>
            <p className="text-cd-blue/70 text-xs mt-2 leading-relaxed">
              🐛 <em>Note: This is a hiring challenge. Use the app as if you're a real client — and report any bugs you find along the way.</em>
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-cd-purple flex items-center justify-center text-white font-bold text-xs">CD</div>
                <span className="text-white font-bold">ClearDesk</span>
              </div>
              <h2 className="text-2xl font-black text-white mb-1">Enter the Challenge</h2>
              <p className="text-white/50 text-sm">Register to start finding bugs and earn points.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/50 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-cd-purple/60 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/50 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-cd-purple/60 transition-colors"
                />
              </div>

              {regError && (
                <p className="text-red-400 text-sm">{regError}</p>
              )}

              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-3 rounded-xl text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #835AFF, #6040dd)' }}
              >
                {regLoading ? 'Entering...' : 'Start the Challenge →'}
              </button>
            </form>

            <p className="text-center text-xs text-white/30 mt-5">
              Already registered? Enter the same email to resume.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Challenge UI
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <ChallengeHeader
        candidateName={candidate!.name}
        totalScore={candidate!.totalScore}
        startedAt={candidate!.startedAt}
        maxScore={TOTAL_POINTS}
      />

      <div className="flex flex-1 overflow-hidden">
        <BugTracker submissions={candidate!.submissions} />

        <main className="flex-1 overflow-hidden flex flex-col">
          <div className="border-b border-challenge-border flex shrink-0">
            <button
              onClick={() => setActiveTab('app')}
              className={`px-6 py-3 font-mono text-xs uppercase tracking-widest border-b-2 transition-colors ${
                activeTab === 'app'
                  ? 'border-cd-purple text-cd-purple-light'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              The App
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-6 py-3 font-mono text-xs uppercase tracking-widest border-b-2 transition-colors ${
                activeTab === 'report'
                  ? 'border-cd-purple text-cd-purple-light'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              Report a Bug
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'app' ? (
              <BrokenApp />
            ) : (
              <SubmissionDrawer
                candidateId={candidate!.id}
                onSubmitSuccess={refreshCandidate}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
