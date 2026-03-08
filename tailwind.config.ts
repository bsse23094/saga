import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        saga: {
          bg:      '#f5f0e6',
          surface: '#faf7f0',
          card:    '#fffdf8',
          border:  '#e2d9c8',
          muted:   '#d4cbb8',
          ink:     '#2c2417',
          body:    '#4a3f30',
          caption: '#7a6f5e',
          faint:   '#a69d8c',
          crimson: '#8b2a2a',
          ember:   '#a63d2f',
          forest:  '#2e6b3a',
          moss:    '#4a8a56',
          gold:    '#b8922e',
          wheat:   '#c4a55a',
          steel:   '#5a6a7a',
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        fell:   ['"IM Fell English"', 'serif'],
        mono:   ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'micro':  ['7px',  { lineHeight: '1' }],
        'tiny':   ['9px',  { lineHeight: '1.2' }],
        'mini':   ['10px', { lineHeight: '1.3' }],
        'small':  ['11px', { lineHeight: '1.4' }],
      },
    },
  },
  plugins: [],
} satisfies Config
