import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ClearDesk | The Right Talent to Scale Smarter',
  description: 'ClearDesk helps you scale smarter with the right virtual assistants matched to your business needs.',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-challenge-bg text-gray-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
