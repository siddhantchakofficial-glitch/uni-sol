/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0a6eab',
          secondary: '#1380c2',
          dark: '#014b78',
          deepFooter: '#004b78',
          lightBg: '#f8fafc',
          cardBg: '#ffffff',
          textMain: '#0f172a',
          textMuted: '#475569'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 30px rgba(10, 110, 171, 0.15)',
        'glow': '0 0 25px -5px rgba(10, 110, 171, 0.4)',
      }
    },
  },
  plugins: [],
}
