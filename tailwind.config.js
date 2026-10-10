/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#070b14',
          panel: '#0d1527',
          cyan: '#00f0ff',
          neon: '#0df',
          purple: '#b026ff',
          amber: '#ffaa00',
          crimson: '#ff2a55',
          frost: '#88e5ff',
          border: '#1b2a47'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
        orbitron: ['Orbitron', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        alarmFlicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' }
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'alarm-flicker': 'alarmFlicker 0.4s infinite ease-in-out'
      }
    },
  },
  plugins: [],
}
