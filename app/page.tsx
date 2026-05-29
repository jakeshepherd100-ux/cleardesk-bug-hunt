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

export default function Home() {
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

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-challenge-accent animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-challenge-accent">Live Challenge</span>
            </div>
            <h1 className="text-4xl font-black text-white mb-3">
              Clear<span className="text-challenge-accent">Desk</span>
            </h1>
            <h2 className="text-xl font-bold text-gray-300 mb-2">Bug Hunt Challenge</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Find the bugs. Describe the fix. Get scored by AI. 15 bugs · {TOTAL_POINTS} points total.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full bg-challenge-surface border border-challenge-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-challenge-accent/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full bg-challenge-surface border border-challenge-border rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-challenge-accent/50 transition-colors"
              />
            </div>

            {regError && (
              <p className="text-challenge-red text-sm font-mono">{regError}</p>
            )}

            <button
              type="submit"
              disabled={regLoading}
              className="w-full bg-challenge-accent text-black font-bold py-3 rounded-lg hover:bg-challenge-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase tracking-widest text-sm"
            >
              {regLoading ? 'Entering...' : 'Enter the Challenge →'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            Already registered? Enter the same email to resume.
          </p>
        </div>
      </div>
    )
  }

  const existingSubmission = selectedBug
    ? candidate.submissions.find((s) => s.bugId === selectedBug.id) || null
    : null

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <ChallengeHeader
        candidateName={candidate.name}
        totalScore={candidate.totalScore}
        startedAt={candidate.startedAt}
        maxScore={TOTAL_POINTS}
      />

      <div className="flex flex-1 overflow-hidden">
        <BugTracker
          submissions={candidate.submissions}
          onSelectBug={handleSelectBug}
          selectedBugId={selectedBug?.id || null}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Tab bar */}
          <div className="border-b border-challenge-border flex shrink-0">
            <button
              onClick={() => setActiveTab('app')}
              className={`px-6 py-3 font-mono text-xs uppercase tracking-widest border-b-2 transition-colors ${
                activeTab === 'app'
                  ? 'border-challenge-accent text-challenge-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              Broken App
            </button>
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-6 py-3 font-mono text-xs uppercase tracking-widest border-b-2 transition-colors ${
                activeTab === 'submit'
                  ? 'border-challenge-accent text-challenge-accent'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {selectedBug ? `Submit: ${selectedBug.id}` : 'Submit Fix'}
            </button>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'app' ? (
              <BrokenApp />
            ) : (
              <SubmissionDrawer
                bug={selectedBug}
                candidateId={candidate.id}
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
