'use client'

import { useEffect, useState } from 'react'

interface TimerProps {
  startedAt: string
}

export default function Timer({ startedAt }: TimerProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const start = new Date(startedAt).getTime()
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startedAt])

  const hours = Math.floor(elapsed / 3600)
  const minutes = Math.floor((elapsed % 3600) / 60)
  const seconds = elapsed % 60

  const format = (n: number) => n.toString().padStart(2, '0')

  return (
    <div className="flex items-center gap-2 font-mono text-challenge-accent">
      <span className="text-xs text-gray-500 uppercase tracking-widest">Time</span>
      <span className="text-lg font-bold tabular-nums">
        {format(hours)}:{format(minutes)}:{format(seconds)}
      </span>
    </div>
  )
}
