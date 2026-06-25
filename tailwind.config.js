/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FDF0D5',
        sage: {
          DEFAULT: '#586F6B',
          dark: '#3D504D',
          light: '#7A9E99',
          tint: '#E8F0EF',
        },
        rose: {
          DEFAULT: '#A07178',
          dark: '#7A5159',
          light: '#C9979F',
          tint: '#F5E8EA',
        },
        status: {
          available: '#22C55E',
          'available-bg': '#DCFCE7',
          'available-text': '#166534',
          low: '#F59E0B',
          'low-bg': '#FEF3C7',
          'low-text': '#78350F',
          out: '#EF4444',
          'out-bg': '#FEE2E2',
          'out-text': '#7F1D1D',
        },
        border: '#E2DBD6',
        muted: '#9CA9A7',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0px 2px 10px rgba(88, 111, 107, 0.10)',
        modal: '0px 8px 32px rgba(88, 111, 107, 0.18)',
        floating: '0px 2px 12px rgba(0, 0, 0, 0.15)',
      },
      screens: {
        xs: '320px',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-up': 'slideUp 0.25s ease-out',
      },
    },
  },
  plugins: [],
}