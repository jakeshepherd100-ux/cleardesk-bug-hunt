'use client'

import { useState } from 'react'

export interface BusinessProfile {
  businessName: string
  industry: string
  roleType: string
  hoursNeeded: number
  requiredApps: string[]
  requiredSkills: string[]
  yearsExpNeeded: number
  timezone: string
}

interface BusinessProfilerProps {
  onComplete: (profile: BusinessProfile) => void
}

const INDUSTRIES = [
  'Home Health Care',
  'Real Estate',
  'Professional Services',
  'Staffing & Recruiting',
  'E-Commerce',
  'Construction',
  'Financial Services',
  'Other',
]

const ROLE_TYPES = ['VA', 'Scheduler', 'Recruiter', 'Ops Support', 'Bookkeeper']

const APP_OPTIONS = [
  'Google Workspace',
  'HubSpot',
  'Slack',
  'QuickBooks',
  'Xero',
  'Asana',
  'LinkedIn Recruiter',
  'Bullhorn',
  'Deputy Workforce',
  'Tanda',
  'Canva',
  'Hubstaff',
  'Office 365',
]

const SKILL_OPTIONS = [
  'Calendar management',
  'Email triage',
  'CRM data entry',
  'Appointment setting',
  'Route optimization',
  'Candidate sourcing',
  'Resume screening',
  'SOP documentation',
  'AR/AP',
  'Bank reconciliation',
  'Payroll support',
  'Social media scheduling',
]

// BUG-01: No form validation — form submits with empty required fields
// BUG-02: No confirmation state — form silently resets after submission

export default function BusinessProfiler({ onComplete }: BusinessProfilerProps) {
  const [form, setForm] = useState<BusinessProfile>({
    businessName: '',
    industry: '',
    roleType: '',
    hoursNeeded: 40,
    requiredApps: [],
    requiredSkills: [],
    yearsExpNeeded: 0,
    timezone: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // BUG-01: No validation here — should check required fields
    onComplete(form)
    // BUG-02: No success confirmation — just calls onComplete and the form resets
  }

  function toggleArray(arr: string[], value: string): string[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Tell us about your business</h2>
        <p className="text-gray-400">
          We'll use this to match you with the right remote talent.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Business Name <span className="text-challenge-red">*</span>
          </label>
          <input
            type="text"
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            placeholder="Acme Home Care"
            className="w-full bg-challenge-surface border border-challenge-border rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Industry <span className="text-challenge-red">*</span>
          </label>
          <select
            value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
            className="w-full bg-challenge-surface border border-challenge-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gray-500"
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Role Type Needed <span className="text-challenge-red">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ROLE_TYPES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setForm({ ...form, roleType: role })}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  form.roleType === role
                    ? 'border-cd-purple bg-cd-purple/20 text-cd-purple-light'
                    : 'border-white/15 text-white/50 hover:border-white/30'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Hours Per Week Needed <span className="text-challenge-red">*</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Part-Time', sub: '10–15 hrs', value: 12 },
              { label: 'Half-Time', sub: '20 hrs', value: 20 },
              { label: 'Full-Time', sub: '40 hrs', value: 40 },
              { label: 'Flex', sub: 'Varies', value: 0 },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, hoursNeeded: opt.value })}
                className={`py-2.5 px-2 rounded-lg border text-center transition-colors ${
                  form.hoursNeeded === opt.value
                    ? 'border-cd-purple bg-cd-purple/20 text-cd-purple-light'
                    : 'border-white/15 text-white/50 hover:border-white/30'
                }`}
              >
                <div className="text-sm font-semibold">{opt.label}</div>
                <div className="text-xs opacity-60">{opt.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Required Apps
          </label>
          <div className="flex flex-wrap gap-2">
            {APP_OPTIONS.map((app) => (
              <button
                key={app}
                type="button"
                onClick={() => setForm({ ...form, requiredApps: toggleArray(form.requiredApps, app) })}
                className={`px-3 py-1.5 rounded-full border text-xs transition-colors ${
                  form.requiredApps.includes(app)
                    ? 'border-cd-purple bg-cd-purple/20 text-cd-purple-light'
                    : 'border-white/15 text-white/40 hover:border-white/30'
                }`}
              >
                {app}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Key Skills Required
          </label>
          <div className="flex flex-wrap gap-2">
            {SKILL_OPTIONS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => setForm({ ...form, requiredSkills: toggleArray(form.requiredSkills, skill) })}
                className={`px-3 py-1.5 rounded-full border text-xs transition-colors ${
                  form.requiredSkills.includes(skill)
                    ? 'border-cd-purple bg-cd-purple/20 text-cd-purple-light'
                    : 'border-white/15 text-white/40 hover:border-white/30'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Min. Years Experience
            </label>
            <input
              type="number"
              min={0}
              max={20}
              value={form.yearsExpNeeded}
              onChange={(e) => setForm({ ...form, yearsExpNeeded: parseInt(e.target.value) || 0 })}
              className="w-full bg-challenge-surface border border-challenge-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Your Timezone
            </label>
            <select
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.target.value })}
              className="w-full bg-challenge-surface border border-challenge-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gray-500"
            >
              <option value="">Select timezone</option>
              <option value="EST">Eastern (EST)</option>
              <option value="CST">Central (CST)</option>
              <option value="MST">Mountain (MST)</option>
              <option value="PST">Pacific (PST)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full font-bold py-3 rounded-lg transition-colors text-white"
          style={{ background: 'linear-gradient(135deg, #835AFF, #6040dd)' }}
        >
          Find My Match →
        </button>
      </form>

      {/* Testimonials — BUG-03: undefined onClick handlers */}
      <div className="mt-12 border-t border-challenge-border pt-8">
        <h3 className="text-lg font-bold text-white mb-4">What our clients say</h3>
        <div className="space-y-4">
          {[
            { name: 'Sarah M.', role: 'Home Care Agency Owner', quote: 'My scheduler handles everything now. Game changer.' },
            { name: 'Tom R.', role: 'Staffing Firm Partner', quote: 'Our recruiter sources better candidates than we did in-house.' },
          ].map((t) => (
            <div key={t.name} className="bg-challenge-surface border border-challenge-border rounded-lg p-4">
              <p className="text-gray-300 text-sm mb-3">"{t.quote}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
                {/* BUG-03: onClick is undefined */}
                <button
                  onClick={undefined as unknown as React.MouseEventHandler}
                  className="text-xs text-cd-purple-light hover:underline"
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer — BUG-05: Admin link has no label */}
      <footer className="mt-8 pt-4 border-t border-challenge-border flex justify-between text-xs text-gray-600">
        <span>© 2024 ClearDesk</span>
        <a href="/admin" className="hover:text-gray-400 transition-colors">
          {/* BUG-05: No label text here — should say "Admin Dashboard" */}
          admin
        </a>
      </footer>
    </div>
  )
}
