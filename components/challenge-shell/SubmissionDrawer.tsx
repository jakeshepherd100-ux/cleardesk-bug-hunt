'use client'

import { useState } from 'react'

interface SubmissionDrawerProps {
  candidateId: string
  onSubmitSuccess: () => void
}

const SCORE_BG: Record<string, string> = {
  Complete: 'border-green-500 bg-green-900/20',
  Partial: 'border-amber-500 bg-amber-900/20',
  Minimal: 'border-orange-500 bg-orange-900/20',
  Incomplete: 'border-red-500 bg-red-900/20',
}

const SCORE_TEXT: Record<string, string> = {
  Complete: 'text-green-400',
  Partial: 'text-amber-400',
  Minimal: 'text-orange-400',
  Incomplete: 'text-red-400',
}

const APP_AREAS = [
  'Business Profiler form',
  'Management Assessment quiz',
  'Talent Results page',
  'Navigation / buttons',
  'API / data loading',
  'Other',
]

type ResultState =
  | { type: 'no_match'; feedback: string }
  | { type: 'duplicate'; bugId: string; feedback: string }
  | { type: 'scored'; bugId: string; score: number; label: string; feedback: string }

export default function SubmissionDrawer({ candidateId, onSubmitSuccess }: SubmissionDrawerProps) {
  const [area, setArea] = useState('')
  const [description, setDescription] = useState('')
  const [fix, setFix] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ResultState | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim() || !fix.trim()) {
      setError('Both fields are required.')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/submit-bug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, area, description, fix }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Submission failed')
        return
      }

      if (!data.matched) {
        setResult({ type: 'no_match', feedback: data.feedback })
      } else if (data.alreadySubmitted) {
        setResult({ type: 'duplicate', bugId: data.bugId, feedback: data.feedback })
      } else {
        setResult({ type: 'scored', bugId: data.bugId, score: data.score, label: data.label, feedback: data.feedback })
        onSubmitSuccess()
        setDescription('')
        setFix('')
        setArea('')
      }
    } catch {
      setError('Network error — please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-1">Report a Bug</h3>
        <p className="text-sm text-gray-500">
          Found something broken? Describe what you found and how you'd fix it. The system will match it to a known issue and score your report.
        </p>
      </div>

      {result && (
        <div className={`rounded-lg border p-4 mb-6 ${
          result.type === 'scored'
            ? SCORE_BG[result.label] || 'border-gray-700'
            : result.type === 'duplicate'
            ? 'border-amber-600 bg-amber-900/20'
            : 'border-gray-600 bg-gray-900/40'
        }`}>
          {result.type === 'scored' && (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-gray-400">Matched → {result.bugId}</span>
                <span className={`font-mono text-sm font-bold ${SCORE_TEXT[result.label]}`}>
                  {result.label} · {result.score}/3
                </span>
              </div>
              <p className="text-sm text-gray-300">{result.feedback}</p>
            </>
          )}
          {result.type === 'duplicate' && (
            <>
              <div className="font-mono text-xs text-amber-400 mb-1">Already submitted — {result.bugId}</div>
              <p className="text-sm text-gray-300">{result.feedback}</p>
            </>
          )}
          {result.type === 'no_match' && (
            <>
              <div className="font-mono text-xs text-gray-400 mb-1">No match found</div>
              <p className="text-sm text-gray-300">{result.feedback}</p>
            </>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
            Area of the App
          </label>
          <div className="flex flex-wrap gap-2">
            {APP_AREAS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setArea(a)}
                className={`px-3 py-1 rounded-full border text-xs transition-colors font-mono ${
                  area === a
                    ? 'border-cd-purple/60 bg-cd-purple/15 text-cd-purple-light'
                    : 'border-challenge-border text-gray-500 hover:border-gray-600'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
            What's the bug? *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you found — what happens, where, and why it's wrong..."
            rows={4}
            className="w-full bg-challenge-surface border border-challenge-border rounded px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-500 font-mono resize-none"
          />
        </div>

        <div>
          <label className="block font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">
            How would you fix it? *
          </label>
          <textarea
            value={fix}
            onChange={(e) => setFix(e.target.value)}
            placeholder="Describe the fix — what change would you make and where..."
            rows={4}
            className="w-full bg-challenge-surface border border-challenge-border rounded px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-gray-500 font-mono resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm font-mono">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01]"
          style={{ background: loading ? '#444' : 'linear-gradient(135deg, #835AFF, #6040dd)' }}
        >
          {loading ? 'Analyzing...' : 'Submit Report →'}
        </button>
      </form>
    </div>
  )
}
