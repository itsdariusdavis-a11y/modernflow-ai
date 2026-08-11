/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // MFA Ops palette. Deliberately no cyan anywhere — that belongs to
        // another project and this build must have zero visual overlap.
        bg: '#0a0f14',
        surface: '#131b23',
        surface2: '#1a242e',
        line: '#22303c',
        accent: '#22c55e',
        warn: '#f59e0b',
        danger: '#ef4444',
        muted: '#8b9aa8',
        ink: '#e8eef4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        fade: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        // The only animation in the build, per spec: a fade on route change.
        fade: 'fade 140ms ease-out',
      },
    },
  },
  plugins: [],
};
