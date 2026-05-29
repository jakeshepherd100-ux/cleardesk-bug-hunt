// BUG-09: HubSpot integration monitor maps business name to Last Name field instead of Company Name
// Errors are also swallowed and not surfaced to the user.

'use client'

import { useState, useEffect } from 'react'

interface IntegrationField {
  source: string
  hubspotField: string  // BUG-09: should be 'company' for business name, not 'lastname'
  status: 'ok' | 'error' | 'warning'
  lastSync: string | null
}

const FIELD_MAPPINGS: IntegrationField[] = [
  {
    source: 'businessName',
    hubspotField: 'lastname',  // BUG-09: Should be 'company' — wrong field mapping
    status: 'ok',
    lastSync: new Date().toISOString(),
  },
  {
    source: 'industry',
    hubspotField: 'industry',
    status: 'ok',
    lastSync: new Date().toISOString(),
  },
  {
    source: 'roleType',
    hubspotField: 'jobtitle',
    status: 'ok',
    lastSync: new Date().toISOString(),
  },
  {
    source: 'email',
    hubspotField: 'email',
    status: 'ok',
    lastSync: new Date().toISOString(),
  },
  {
    source: 'hoursNeeded',
    hubspotField: 'hours_needed__c',
    status: 'warning',
    lastSync: null,
  },
]

export default function IntegrationStatusPage() {
  const [syncing, setSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)
  // BUG-09: Errors are not surfaced — error state exists but is never shown
  const [_syncError, _setSyncError] = useState<string | null>(null)

  useEffect(() => {
    setLastSyncTime(new Date().toISOString())
  }, [])

  async function handleManualSync() {
    setSyncing(true)
    try {
      // Simulated sync — in real implementation this would call HubSpot API
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setLastSyncTime(new Date().toISOString())
      // BUG-09: If this threw an error, it would be swallowed — not shown to user
    } catch (err) {
      // BUG-09: Error is caught but never surfaced:
      // _setSyncError('Sync failed: ' + err)
      console.error('Sync error:', err)
    } finally {
      setSyncing(false)
    }
  }

  const STATUS_STYLE: Record<string, string> = {
    ok: 'text-challenge-accent bg-challenge-accent/10 border-challenge-accent/30',
    warning: 'text-challenge-amber bg-amber-900/20 border-challenge-amber/30',
    error: 'text-challenge-red bg-red-900/20 border-challenge-red/30',
  }

  return (
    <div className="min-h-screen bg-challenge-bg p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">HubSpot Integration Monitor</h1>
            <p className="text-gray-500 text-sm font-mono">
              {lastSyncTime
                ? `Last sync: ${new Date(lastSyncTime).toLocaleTimeString()}`
                : 'Never synced'}
            </p>
          </div>

          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="px-4 py-2 bg-challenge-surface border border-challenge-border rounded-lg text-sm font-mono text-gray-300 hover:border-gray-500 disabled:opacity-50 transition-colors"
          >
            {syncing ? 'Syncing...' : '↺ Manual Sync'}
          </button>
        </div>

        {/* BUG-09: _syncError is never rendered — error state is invisible to users */}

        <div className="bg-challenge-surface border border-challenge-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-challenge-border">
            <div className="grid grid-cols-3 text-xs font-mono uppercase tracking-widest text-gray-500">
              <span>Source Field</span>
              <span>HubSpot Field</span>
              <span>Status</span>
            </div>
          </div>

          <div className="divide-y divide-challenge-border">
            {FIELD_MAPPINGS.map((mapping) => (
              <div key={mapping.source} className="px-5 py-3 grid grid-cols-3 items-center">
                <span className="font-mono text-sm text-gray-300">{mapping.source}</span>
                <span className="font-mono text-sm text-gray-400">
                  {mapping.hubspotField}
                  {/* BUG-09: 'lastname' shown here — should be 'company' for businessName */}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${STATUS_STYLE[mapping.status]}`}>
                    {mapping.status}
                  </span>
                  {mapping.lastSync && (
                    <span className="text-xs text-gray-600 font-mono">
                      {new Date(mapping.lastSync).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-challenge-surface border border-challenge-border rounded-xl p-5">
          <h3 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-3">
            Integration Health
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-black text-challenge-accent">4</div>
              <div className="text-xs text-gray-500 font-mono">Fields OK</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-challenge-amber">1</div>
              <div className="text-xs text-gray-500 font-mono">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-challenge-red">0</div>
              <div className="text-xs text-gray-500 font-mono">Errors</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
