/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2386C8',
          dark: '#1E75AE',
          light: '#4DA3D9',
        },
        secondary: '#F59E0B',
        accent: '#10B981',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        border: '#E2E8F0',
        text: {
          primary: '#1E293B',
          secondary: '#64748B',
          muted: '#94A3B8',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#2386C8',
      },
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
        heading: ['Amiri', 'serif'],
        body: ['Tajawal', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
  ],
}
