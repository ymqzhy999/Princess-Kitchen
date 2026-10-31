/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#fff7f9',
          100: '#ffeef3',
          200: '#ffdbe6',
          300: '#ffc0d3',
          400: '#ff9bb8',
          500: '#f9739b',
          600: '#e8547f',
          700: '#c73a66',
          800: '#a32d53',
          900: '#862946',
        },
        cream: {
          50: '#fffdf8',
          100: '#fff8ec',
          200: '#fdefd9',
          300: '#f8e0bd',
          400: '#eecb9d',
        },
        lilac: {
          50: '#faf7ff',
          100: '#f2ecff',
          200: '#e5d8ff',
          300: '#d1b8f7',
          400: '#b392e8',
          500: '#9873d3',
          600: '#7d59b5',
        },
        ink: {
          300: '#c2b6bb',
          400: '#a19299',
          500: '#8a7a82',
          600: '#6f5f66',
          700: '#544449',
          800: '#3d2f34',
          900: '#2c2024',
        },
        // Theme-aware colours, driven by CSS variables on <html data-theme>.
        theme: {
          DEFAULT: 'rgb(var(--pk-accent) / <alpha-value>)',
          deep: 'rgb(var(--pk-accent-deep) / <alpha-value>)',
          soft: 'rgb(var(--pk-accent-soft) / <alpha-value>)',
          tint: 'rgb(var(--pk-accent-tint) / <alpha-value>)',
        },
        canvas: 'rgb(var(--pk-canvas) / <alpha-value>)',
      },
      fontFamily: {
        display: [
          '"Noto Serif SC"',
          '"Songti SC"',
          '"STSong"',
          '"Source Han Serif SC"',
          'Georgia',
          'serif',
        ],
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Noto Sans SC"',
          'sans-serif',
        ],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(199, 58, 102, 0.20)',
        card: '0 18px 40px -24px rgba(163, 45, 83, 0.35)',
        float: '0 12px 32px -8px rgba(199, 58, 102, 0.28)',
        innerSoft: 'inset 0 1px 0 rgba(255,255,255,0.8)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.94) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.35s ease-out both',
        'pop-in': 'pop-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};
