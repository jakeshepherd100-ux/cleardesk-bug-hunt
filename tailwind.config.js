/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'challenge-bg': '#0A0A0A',
        'challenge-accent': '#00FF87',
        'challenge-amber': '#F59E0B',
        'challenge-red': '#EF4444',
        'challenge-surface': '#111111',
        'challenge-border': '#222222',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
