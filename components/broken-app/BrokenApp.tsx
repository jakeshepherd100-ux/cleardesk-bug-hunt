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
          <div className="max-w-2xl w-full">

            {/* Welcome heading */}
            <div className="text-center mb-10">
              <p className="text-cd-purple font-semibold text-sm uppercase tracking-widest mb-3">Welcome to ClearDesk!</p>
              <h1 className="text-5xl font-black text-cd-navy mb-4 leading-tight">
                Build the team you need<br />
                <span className="text-cd-purple">anywhere in the world</span>
              </h1>
              <p className="text-gray-500 text-base leading-relaxed max-w-lg mx-auto mb-8">
                ClearDesk helps you scale smarter with the right virtual assistants matched to your business needs — skilled professionals who function as true remote team members.
              </p>
              <button
                onClick={() => setStep('profiler')}
                className="px-10 py-4 rounded-2xl text-white font-bold text-base shadow-lg transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #835AFF, #6040dd)' }}
              >
                Find My Match →
              </button>
              <p className="text-xs text-gray-300 mt-3">Takes about 3 minutes · No commitment required</p>
            </div>

            {/* Real stats from cleardesk.com */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { value: '4.9/5.0', label: 'Avg. client satisfaction' },
                { value: '2,000+', label: 'Business owners served' },
                { value: '70%', label: 'Cost savings vs. US hiring' },
              ].map((s) => (
                <div key={s.label} className="text-center p-4 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="text-2xl font-black text-cd-navy mb-0.5">{s.value}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div className="border-t border-gray-100 pt-8 mb-8">
              <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-300 mb-6">How it works</p>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { step: '1', title: 'Tell us about your business', desc: 'Share your industry, role needs, and the tools your team uses.' },
                  { step: '2', title: 'Take the management quiz', desc: 'We identify your style to surface the best personality and skills fit.' },
                  { step: '3', title: 'Meet your matches', desc: 'Get ranked profiles of pre-vetted talent ready to start within days.' },
                ].map((s) => (
                  <div key={s.step} className="text-center">
                    <div className="w-8 h-8 rounded-full bg-cd-purple/10 border border-cd-purple/20 text-cd-purple font-black text-sm flex items-center justify-center mx-auto mb-3">{s.step}</div>
                    <p className="font-semibold text-cd-navy text-sm mb-1">{s.title}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Industries */}
            <div className="border-t border-gray-100 pt-6 mb-6">
              <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-300 mb-4">Industries we serve</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {['Home Care', 'Real Estate', 'Staffing & Recruiting', 'Solar', 'Financial Services', 'E-Commerce'].map((ind) => (
                  <span key={ind} className="text-xs px-3 py-1 rounded-full border border-gray-200 text-gray-500 bg-gray-50">{ind}</span>
                ))}
              </div>
            </div>

            {/* Testimonial snippet */}
            <div className="border-t border-gray-100 pt-6 text-center">
              <p className="text-gray-500 text-sm italic mb-2">"My VA handles scheduling, emails, and follow-ups — she runs like a true team member. Game changer for our agency."</p>
              <p className="text-xs text-gray-400 font-semibold">— Sarah M., Home Care Agency Owner</p>
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
