/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Baloo 2"', '"Nunito"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(28, 20, 12, 0.04), 0 12px 28px -12px rgba(120, 80, 40, 0.16)',
        'card-lg': '0 2px 4px rgba(28, 20, 12, 0.05), 0 24px 48px -16px rgba(120, 80, 40, 0.22)',
        glow: '0 8px 24px -6px rgba(242, 154, 76, 0.45)',
      },
      colors: {
        stone: {
          150: '#eeece8',
          250: '#d9d5cd',
          850: '#292420',
        },
        amber: {
          150: '#fde9c8',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(320px) rotate(var(--confetti-rotate, 360deg))', opacity: '0' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out',
        slideIn: 'slideIn 0.3s ease-out',
        confettiFall: 'confettiFall linear forwards',
      },
    },
  },
  plugins: [],
};
