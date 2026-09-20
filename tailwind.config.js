/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lime: {
          accent: '#D4F547',
          dark: '#b8d93a',
        },
        dark: {
          bg: '#0a0a0a',
          surface: '#141414',
          card: '#1a1a1a',
          border: '#2a2a2a',
          hover: '#222222',
          input: '#111111',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-right': {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-lime': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,245,71,0)' },
          '50%': { boxShadow: '0 0 0 6px rgba(212,245,71,0.12)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.45s cubic-bezier(0.16,1,0.3,1) both',
        'fade-up-slow': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.35s ease both',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16,1,0.3,1) both',
        'slide-down': 'slide-down 0.25s cubic-bezier(0.16,1,0.3,1) both',
        'slide-right': 'slide-right 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-lime': 'pulse-lime 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 1.4s linear infinite',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
