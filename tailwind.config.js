// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amber: '#f5a623',
        ice: '#e8e8e8',
        ink: '#1a1a2e',
        'bg-dark': '#0f0f1a',
      },
      fontFamily: {
        bebas: ['Bebas Neue', 'cursive'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}