import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ClearDesk Bug Hunt',
  description: 'Find the bugs. Fix the prompt. Prove your skills.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-challenge-bg text-gray-100 font-mono antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
