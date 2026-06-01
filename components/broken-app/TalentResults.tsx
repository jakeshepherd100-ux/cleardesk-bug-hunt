'use client'

import { useEffect, useState } from 'react'
import { BusinessProfile } from './BusinessProfiler'

interface MatchResult {
  profile: {
    id: string
    name: string
    roleType: string
    yearsExp: number
    skills: string[]
    coreApps: string[]
    bio: string
    availability: string
  }
  score: number
  breakdown: {
    roleTypeScore: number
    experienceScore: number
    appsScore: number
    skillsScore: number
  }
}

interface TalentResultsProps {
  businessProfile: BusinessProfile
  archetype: string
}

const AVAILABILITY_COLOR: Record<string, string> = {
  Immediate: 'text-green-600',
  '2 weeks': 'text-amber-600',
  '1 month': 'text-orange-500',
}

export default function TalentResults({ businessProfile, archetype }: TalentResultsProps) {
  const [results, setResults] = useState<MatchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalProfile, setModalProfile] = useState<MatchResult['profile'] | null>(null)
  const [requestSent, setRequestSent] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roleType: businessProfile.roleType,
            hoursNeeded: businessProfile.hoursNeeded,
            requiredApps: businessProfile.requiredApps,
            requiredSkills: businessProfile.requiredSkills,
            yearsExpNeeded: businessProfile.yearsExpNeeded,
          }),
        })
        if (!res.ok) throw new Error('Match failed')
        const data = await res.json()
        setResults(data)
      } catch {
        setError('Failed to load matches')
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [businessProfile])

  function handleRequestIntro(profile: MatchResult['profile']) {
    setModalProfile(profile)
  }

  function confirmRequest() {
    if (!modalProfile) return
    setRequestSent((prev) => new Set(prev).add(modalProfile.id))
    setModalProfile(null)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-8 h-8 border-2 border-cd-purple border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">Finding your matches...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-cd-navy mb-1">Your Top Matches</h2>
        <p className="text-gray-500 text-sm">
          Matched for a <span className="text-cd-purple font-medium">{businessProfile.roleType}</span> role
          · {archetype} manager profile
        </p>
      </div>

      <div className="space-y-4">
        {results.map((result, idx) => (
          <div
            key={result.profile.id}
            className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:border-gray-200 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  {idx === 0 && (
                    <span className="text-xs font-semibold text-cd-purple bg-cd-purple/10 border border-cd-purple/20 px-1.5 py-0.5 rounded">
                      Best Match
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-cd-navy">{result.profile.name}</h3>
                <p className="text-sm text-gray-400">
                  {result.profile.roleType} · {result.profile.yearsExp} years exp
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-cd-navy">{result.score}%</div>
                <div className="text-xs text-gray-400">match score</div>
              </div>
            </div>

            {/* BUG-06: Progress bar hardcoded to 0% — should be result.score */}
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-cd-purple rounded-full transition-all"
                style={{ width: '0%' }}
              />
            </div>

            <p className="text-sm text-gray-500 mb-3 leading-relaxed">{result.profile.bio}</p>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {result.profile.coreApps.slice(0, 4).map((app) => (
                <span
                  key={app}
                  className={`text-xs px-2 py-0.5 rounded-full border ${
                    businessProfile.requiredApps.includes(app)
                      ? 'border-cd-purple/40 text-cd-purple bg-cd-purple/5'
                      : 'border-gray-200 text-gray-400'
                  }`}
                >
                  {app}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className={`font-medium ${AVAILABILITY_COLOR[result.profile.availability] || 'text-gray-400'}`}>
                Available: {result.profile.availability}
              </span>
              {requestSent.has(result.profile.id) ? (
                <span className="text-green-600 font-semibold">✓ Introduction requested</span>
              ) : (
                <button
                  onClick={() => handleRequestIntro(result.profile)}
                  className="text-cd-purple hover:underline font-semibold"
                >
                  Request Introduction →
                </button>
              )}
            </div>

            {/* BUG-11: No "Why this match" section — should show matching factors */}
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No matches found. Try adjusting your requirements.
        </div>
      )}

      {/* Modal */}
      {modalProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalProfile(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-cd-purple/10 border-2 border-cd-purple/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-black text-cd-purple">{modalProfile.name[0]}</span>
              </div>
              <h3 className="text-lg font-black text-cd-navy mb-1">Request Introduction</h3>
              <p className="text-gray-500 text-sm">
                We'll connect you with <strong className="text-cd-navy">{modalProfile.name}</strong> and facilitate a discovery call within 24 business hours.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-600">
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Role</span>
                <span className="font-medium text-cd-navy">{modalProfile.roleType}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Experience</span>
                <span className="font-medium text-cd-navy">{modalProfile.yearsExp} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Availability</span>
                <span className="font-medium text-cd-navy">{modalProfile.availability}</span>
              </div>
            </div>
            <button
              onClick={confirmRequest}
              className="w-full py-3 rounded-xl text-white font-bold mb-3 transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #835AFF, #6040dd)' }}
            >
              Confirm Request →
            </button>
            <button
              onClick={() => setModalProfile(null)}
              className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
