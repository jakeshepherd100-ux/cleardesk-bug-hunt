'use client'

import { useState } from 'react'
import { BugDefinition } from '@/lib/bugs'

interface SubmissionDrawerProps {
  bug: BugDefinition | null
  candidateId: string
  existingSubmission?: {
    score: number | null
    scoreLabel: string | null
    feedback: string | null
  } | null
  onSubmitSuccess: () => void
}

const TIER_BADGE: Record<string, string> = {
  easy: 'bg-green-900/40 text-green-400 border-green-800',
  medium: 'bg-amber-900/40 text-amber-400 border-amber-800',
  hard: 'bg-red-900/40 text-red-400 border-red-800',
}

const SCORE_BG: Record<string, string> = {
  Complete: 'border-challenge-accent bg-challenge-accent/10',
  Partial: 'border-challenge-amber bg-amber-900/20',
  Minimal: 'border-orange-500 bg-orange-900/20',
  Incomplete: 'border-challenge-red bg-red-900/20',
}

export default function SubmissionDrawer({
  bug,
  candidateId,
  existingSubmission,
  onSubmitSuccess,
}: SubmissionDrawerProps) {
  const [description, setDescription] = useState('')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    score: number
    label: string
    feedback: string
  } | null>(null)

  if (!bug) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="font-mono text-lg font-bold text-gray-300 mb-2">Select a Bug</h3>
        <p className="text-gray-600 text-sm max-w-xs">
          Choose a bug from the registry on the left to start your investigation.
        </p>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim() || !prompt.trim()) {
      setError('Both fields are required.')
      return
    }
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/submit-bug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, bugId: bug!.id, description, prompt }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Submission failed')
        return
      }

      setResult(data.scoreData)
      onSubmitSuccess()
    } catch {
      setError('Network error — please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (existingSubmission) {
    const label = existingSubmission.scoreLabel || 'Incomplete'
    return (
      <div className="p-6 max-w-2xl">
        <div className="mb-4">
          <span className={`inline-block px-2 py-0.5 rounded border text-xs font-mono uppercase tracking-widest ${TIER_BADGE[bug.tier]}`}>
            {bug.tier} · {bug.points}pt{bug.points !== 1 ? 's' : ''}
          </span>
        </div>
        <h3 className="font-mono text-xl font-bold text-white mb-1">{bug.id}</h3>
        <p className="text-gray-300 mb-6">{bug.title}</p>

        <div className={`rounded-lg border p-4 ${SCORE_BG[label] || 'border-gray-700'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-sm font-bold text-white">Already Submitted</span>
            <span className="font-mono text-sm font-bold">{label} · {existingSubmission.score}/3</span>
          </div>
          <p className="text-sm text-gray-300">{existingSubmission.feedback}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-4">
        <span className={`inline-block px-2 py-0.5 rounded border text-xs font-mono uppercase tracking-widest ${TIER_BADGE[bug.tier]}`}>
          {bug.tier} · {bug.points}pt{bug.points !== 1 ? 's' : ''}
        </span>
      </div>
      <h3 className="font-mono text-xl font-bold text-white mb-1">{bug.id}</h3>
      <h4 className="text-lg text-challenge-accent mb-3">{bug.title}</h4>
      <p className="text-gray-400 text-sm mb-6">{bug.description}</p>

      {result ? (
        <div className={`rounded-lg border p-4 mb-6 ${SCORE_BG[result.label] || 'border-gray-700'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-sm font-bold text-white">Score</span>
            <span className="font-mono text-lg font-bold">{result.label} · {result.score}/3</span>
          </div>
          <p className="text-sm text-gray-300">{result.feedback}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
              Bug Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what the bug is and where it occurs..."
              rows={4}
              className="w-full bg-challenge-surface border border-challenge-border rounded px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-challenge-accent/50 font-mono resize-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
              Proposed Fix *
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe exactly how you would fix this bug..."
              rows={5}
              className="w-full bg-challenge-surface border border-challenge-border rounded px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-challenge-accent/50 font-mono resize-none"
            />
          </div>

          {error && (
            <p className="text-challenge-red text-sm font-mono">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-challenge-accent text-black font-mono font-bold text-sm py-3 rounded hover:bg-challenge-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase tracking-widest"
          >
            {loading ? 'Scoring...' : 'Submit Fix'}
          </button>
        </form>
      )}
    </div>
  )
}
