'use client'

import { useState } from 'react'
import BusinessProfiler, { BusinessProfile } from './BusinessProfiler'
import ManagementAssessment from './ManagementAssessment'
import TalentResults from './TalentResults'

type Step = 'profiler' | 'assessment' | 'results'

interface ArchetypeResult {
  archetype: string
  tagline: string
  description: string
  recommendations: string[]
}

export default function BrokenApp() {
  const [step, setStep] = useState<Step>('profiler')
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null)
  const [archetypeResult, setArchetypeResult] = useState<ArchetypeResult | null>(null)

  const STEPS: { id: Step; label: string; num: number }[] = [
    { id: 'profiler', label: 'Business Profile', num: 1 },
    { id: 'assessment', label: 'Management Style', num: 2 },
    { id: 'results', label: 'Your Matches', num: 3 },
  ]

  return (
    <div className="min-h-full">
      {/* Step indicator */}
      <div className="border-b border-challenge-border bg-challenge-surface/50">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            {STEPS.map((s, idx) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 ${step === s.id ? 'text-white' : 'text-gray-600'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border ${
                    step === s.id
                      ? 'border-challenge-accent bg-challenge-accent text-black'
                      : (STEPS.findIndex(x => x.id === step) > idx)
                        ? 'border-gray-600 bg-gray-800 text-gray-300'
                        : 'border-gray-700 text-gray-600'
                  }`}>
                    {s.num}
                  </div>
                  <span className="text-sm hidden sm:block">{s.label}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className="w-8 h-px bg-challenge-border mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {step === 'profiler' && (
          <BusinessProfiler
            onComplete={(profile) => {
              setBusinessProfile(profile)
              setStep('assessment')
            }}
          />
        )}

        {step === 'assessment' && (
          <ManagementAssessment
            onComplete={(result) => {
              setArchetypeResult(result)
              setStep('results')
            }}
            onBack={() => setStep('profiler')}
          />
        )}

        {step === 'results' && businessProfile && (
          <TalentResults
            businessProfile={businessProfile}
            archetype={archetypeResult?.archetype || 'Unknown'}
          />
        )}
      </div>
    </div>
  )
}
