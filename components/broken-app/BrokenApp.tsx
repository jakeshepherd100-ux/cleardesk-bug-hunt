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
      <div className="min-h-full bg-white flex flex-col">
        {/* Fake ClearDesk nav */}
        <nav className="border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cd-purple flex items-center justify-center text-white font-bold text-sm">CD</div>
            <span className="text-cd-navy font-bold text-lg">ClearDesk</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400 font-medium">
            <span>How It Works</span>
            <span>Pricing</span>
            <span>Case Studies</span>
          </div>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="max-w-xl w-full">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-cd-purple/10 border border-cd-purple/20">
              <div className="w-1.5 h-1.5 rounded-full bg-cd-purple animate-pulse" />
              <span className="text-cd-purple text-xs font-semibold uppercase tracking-widest">Talent Matching</span>
            </div>

            <h1 className="text-4xl font-black text-cd-navy mb-4 leading-tight">
              Find Your Perfect<br />
              <span className="text-cd-purple">Remote Talent</span>
            </h1>

            <p className="text-gray-600 text-base mb-3 leading-relaxed">
              ClearDesk's talent matching algorithm connects US businesses with the right pre-vetted, Philippines-based remote professionals — built around your specific needs, industry, and management style.
            </p>

            <p className="text-gray-500 text-sm mb-10 leading-relaxed">
              Answer a few quick questions and we'll surface your top matches — VAs, schedulers, bookkeepers, recruiters, and more — ranked by fit.
            </p>

            <button
              onClick={() => setStep('profiler')}
              className="px-10 py-4 rounded-2xl text-white font-bold text-base shadow-lg transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #835AFF, #6040dd)' }}
            >
              Find Your Talent →
            </button>

            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-300">
              <span>3 quick steps</span>
              <span>·</span>
              <span>AI-matched results</span>
              <span>·</span>
              <span>No commitment</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-white">
      {/* Fake ClearDesk nav */}
      <nav className="border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cd-purple flex items-center justify-center text-white font-bold text-xs">CD</div>
          <span className="text-cd-navy font-bold">ClearDesk</span>
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 ${step === s.id ? 'text-cd-navy' : 'text-gray-300'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border ${
                  step === s.id
                    ? 'border-cd-purple bg-cd-purple text-white'
                    : (STEPS.findIndex(x => x.id === step) > idx)
                      ? 'border-gray-300 bg-gray-100 text-gray-400'
                      : 'border-gray-200 text-gray-300'
                }`}>
                  {s.num}
                </div>
                <span className="text-sm hidden sm:block font-medium">{s.label}</span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className="w-6 h-px bg-gray-200 mx-1" />
              )}
            </div>
          ))}
        </div>
      </nav>

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
