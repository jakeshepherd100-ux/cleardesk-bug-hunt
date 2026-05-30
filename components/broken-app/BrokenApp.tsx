'use client'

import { useState } from 'react'
import BusinessProfiler, { BusinessProfile } from './BusinessProfiler'
import ManagementAssessment from './ManagementAssessment'
import TalentResults from './TalentResults'

type Step = 'welcome' | 'profiler' | 'assessment' | 'results'

interface ArchetypeResult {
  archetype: string
  tagline: string
  description: string
  recommendations: string[]
}

export default function BrokenApp() {
  const [step, setStep] = useState<Step>('welcome')
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null)
  const [archetypeResult, setArchetypeResult] = useState<ArchetypeResult | null>(null)

  const STEPS: { id: Step; label: string; num: number }[] = [
    { id: 'profiler', label: 'Business Profile', num: 1 },
    { id: 'assessment', label: 'Management Style', num: 2 },
    { id: 'results', label: 'Your Matches', num: 3 },
  ]

  if (step === 'welcome') {
    return (
      <div className="min-h-full flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-xl w-full text-center">
          {/* ClearDesk nav bar feel */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-cd-purple flex items-center justify-center text-white font-bold text-sm">CD</div>
            <span className="text-white font-bold text-lg">ClearDesk</span>
          </div>

          <h1 className="text-4xl font-black text-white mb-4 leading-tight">
            Find Your Perfect<br />
            <span className="text-cd-purple-light">Remote Talent</span>
          </h1>

          <p className="text-white/60 text-base mb-3 leading-relaxed">
            One of the tools ClearDesk has built is a <strong className="text-white/80">talent matching algorithm</strong> — designed to connect US businesses with the right pre-vetted, Philippines-based remote professionals for their specific needs.
          </p>

          <p className="text-white/50 text-sm mb-10 leading-relaxed">
            Answer a few questions about your business and management style, and we'll surface your top matches — VAs, schedulers, bookkeepers, recruiters, and more — ranked by fit.
          </p>

          <button
            onClick={() => setStep('profiler')}
            className="px-10 py-4 rounded-2xl text-white font-bold text-base shadow-xl transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #835AFF, #6040dd)' }}
          >
            Find Your Talent →
          </button>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-white/30">
            <span>3 quick steps</span>
            <span>·</span>
            <span>AI-matched results</span>
            <span>·</span>
            <span>No commitment</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full">
      {/* Step indicator */}
      <div className="border-b border-challenge-border bg-challenge-surface/50">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            {STEPS.map((s, idx) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 ${step === s.id ? 'text-white' : 'text-white/40'}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border ${
                    step === s.id
                      ? 'border-cd-purple bg-cd-purple text-white'
                      : (STEPS.findIndex(x => x.id === step) > idx)
                        ? 'border-white/20 bg-white/10 text-white/60'
                        : 'border-white/15 text-white/30'
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
