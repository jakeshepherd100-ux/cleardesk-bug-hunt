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
        'challenge-bg': '#092B48',
        'challenge-accent': '#835AFF',
        'challenge-amber': '#F59E0B',
        'challenge-red': '#EF4444',
        'challenge-surface': '#0d3a60',
        'challenge-border': '#1a4a72',
        'cd-navy': '#092B48',
        'cd-purple': '#835AFF',
        'cd-purple-light': '#BCA6FF',
        'cd-blue': '#73C4FF',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
