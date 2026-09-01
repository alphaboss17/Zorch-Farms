import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#181c20', forest: '#012d1d', moss: '#2c694e', mint: '#aeeecb', canvas: '#f7f9ff', line: '#c1c8c2', clay: '#ff8348',
      },
      fontFamily: { 
      sans: ['Inter', 'sans-serif'], 
      primary: ['Bricolage Grotesque', 'sans-serif'] },
      boxShadow: { soft: '0 10px 40px -10px rgba(0, 0, 0, 0.1)', float: '0 20px 40px -15px rgba(0, 0, 0, 0.15)' },
    },
  },
  plugins: [],
} satisfies Config
