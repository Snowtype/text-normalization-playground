/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'monospace',
        ],
      },
      colors: {
        // Dark "developer tool" surface palette.
        ink: {
          950: '#070a12',
          900: '#0b0f1a',
          850: '#0f1422',
          800: '#141a2b',
          700: '#1d2540',
          600: '#2a3458',
        },
        // Per-semiotic-class accent hues used to highlight normalized spans.
        accent: {
          cyan: '#38bdf8',
          violet: '#a78bfa',
          emerald: '#34d399',
          amber: '#fbbf24',
          rose: '#fb7185',
          blue: '#60a5fa',
          lime: '#a3e635',
          orange: '#fb923c',
          pink: '#f472b6',
          teal: '#2dd4bf',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(56,189,248,0.15), 0 8px 30px -12px rgba(56,189,248,0.25)',
      },
    },
  },
  plugins: [],
};
