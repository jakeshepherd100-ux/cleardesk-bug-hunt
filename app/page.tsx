'use client'

import { useState, useCallback } from 'react'
import ChallengeHeader from '@/components/challenge-shell/ChallengeHeader'
import BugTracker from '@/components/challenge-shell/BugTracker'
import SubmissionDrawer from '@/components/challenge-shell/SubmissionDrawer'
import BrokenApp from '@/components/broken-app/BrokenApp'
import { BugDefinition } from '@/lib/bugs'
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

type Stage = 'landing' | 'register' | 'challenge'

export default function Home() {
  const [stage, setStage] = useState<Stage>('landing')
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState<string | null>(null)

  const [selectedBug, setSelectedBug] = useState<BugDefinition | null>(null)
  const [activeTab, setActiveTab] = useState<'app' | 'submit'>('app')

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

  const handleSelectBug = useCallback((bug: BugDefinition) => {
    setSelectedBug(bug)
    setActiveTab('submit')
  }, [])

  // Landing page
  if (stage === 'landing') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #092B48 0%, #0d3a60 50%, #092B48 100%)' }}>
        {/* Nav */}
        <nav className="px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cd-purple flex items-center justify-center text-white font-bold text-sm">CD</div>
            <span className="text-white font-bold text-lg">ClearDesk</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/60 font-medium">
            <span>How It Works</span>
            <span>Pricing</span>
            <span>Case Studies</span>
          </div>
        </nav>

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center pb-20">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-cd-purple/20 border border-cd-purple/30">
            <div className="w-1.5 h-1.5 rounded-full bg-cd-purple-light animate-pulse" />
            <span className="text-cd-purple-light text-xs font-semibold uppercase tracking-widest">Hiring Challenge · Live</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 leading-tight">
            Find Your<br />
            <span className="text-cd-purple-light">Remote Talent</span>
          </h1>

          <p className="text-white/60 text-lg max-w-lg mb-4 font-medium">
            ClearDesk matches US businesses with pre-vetted, Philippines-based remote professionals — VAs, schedulers, bookkeepers, and more.
          </p>

          <p className="text-cd-blue/80 text-sm max-w-md mb-10 font-medium bg-cd-blue/10 border border-cd-blue/20 rounded-xl px-5 py-3">
            This is a <strong className="text-cd-blue">hiring challenge</strong>. The app below has intentional bugs — find them, describe the fix, and prove your skills.
          </p>

          <button
            onClick={() => setStage('register')}
            className="px-10 py-4 rounded-2xl text-white font-bold text-lg shadow-2xl transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #835AFF, #6040dd)' }}
          >
            Find Your Talent →
          </button>

          <p className="text-white/30 text-xs mt-5">15 bugs · {TOTAL_POINTS} points · AI-scored</p>
        </div>

        {/* Bottom features */}
        <div className="px-8 pb-10 grid grid-cols-3 gap-4 max-w-3xl mx-auto w-full">
          {[
            { title: 'Pre-vetted talent', desc: 'Every candidate is skills-tested before placement' },
            { title: 'US business hours', desc: 'Team members work your timezone, your schedule' },
            { title: 'Managed & supported', desc: 'We handle HR, payroll, and ongoing management' },
          ].map((f) => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="font-bold text-white text-sm mb-1">{f.title}</div>
              <div className="text-white/40 text-xs">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Registration
  if (stage === 'register') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #092B48 0%, #0d3a60 50%, #092B48 100%)' }}>
        <div className="w-full max-w-md">
          <button
            onClick={() => setStage('landing')}
            className="text-white/40 text-sm mb-6 hover:text-white/60 transition-colors flex items-center gap-1"
          >
            ← Back
          </button>

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
  const existingSubmission = selectedBug
    ? candidate!.submissions.find((s) => s.bugId === selectedBug.id) || null
    : null

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <ChallengeHeader
        candidateName={candidate!.name}
        totalScore={candidate!.totalScore}
        startedAt={candidate!.startedAt}
        maxScore={TOTAL_POINTS}
      />

      <div className="flex flex-1 overflow-hidden">
        <BugTracker
          submissions={candidate!.submissions}
          onSelectBug={handleSelectBug}
          selectedBugId={selectedBug?.id || null}
        />

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
              Broken App
            </button>
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-6 py-3 font-mono text-xs uppercase tracking-widest border-b-2 transition-colors ${
                activeTab === 'submit'
                  ? 'border-cd-purple text-cd-purple-light'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {selectedBug ? `Submit: ${selectedBug.id}` : 'Submit Fix'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'app' ? (
              <BrokenApp />
            ) : (
              <SubmissionDrawer
                key={selectedBug?.id ?? 'none'}
                bug={selectedBug}
                candidateId={candidate!.id}
                existingSubmission={existingSubmission}
                onSubmitSuccess={refreshCandidate}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
