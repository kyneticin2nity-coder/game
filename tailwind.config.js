/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0c',
        primary: {
          DEFAULT: '#00f2ff',
          glow: '#00f2ffaa',
        },
        secondary: {
          DEFAULT: '#ff00d4',
          glow: '#ff00d4aa',
        },
        tactical: {
          bg: '#1a1a1f',
          border: '#3a3a45',
          text: '#e2e2e8',
        },
      },
      boxShadow: {
        'glow-primary': '0 0 15px rgba(0, 242, 255, 0.4)',
        'glow-secondary': '0 0 15px rgba(255, 0, 212, 0.4)',
        'lifted': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
}
