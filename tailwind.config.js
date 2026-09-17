/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pokedex-red': '#E3350D',
        'pokedex-red-dark': '#A81F0E',
        'pokedex-red-darker': '#701509',
        'pokedex-red-highlight': '#FF6B4A',
        'pokedex-white': '#F5F4EF',
        'pokedex-black': '#1B1B19',
        'pokedex-gray-light': '#D9D8CF',
        'pokedex-gray-mid': '#9C9B92',
        'pokedex-gray-dark': '#46453F',
        'pokedex-blue': '#3E82C4',
        'pokedex-blue-light': '#79B7EE',
        'pokedex-blue-dark': '#265D8F',
        'pokedex-green': '#3FAE55',
        'pokedex-green-dark': '#237339',
        'pokedex-yellow': '#FFD93D',
        'screen-bg': '#E9F1E6',
        'screen-line': '#c3d6bd',
        'screen-dark': '#182b1c',
      },
      fontFamily: {
        'display': ['"Press Start 2P"', 'monospace'],
        'screen': ['"VT323"', 'monospace'],
        'body': ['"Rubik"', 'sans-serif'],
      },
      borderRadius: {
        'pokedex-lg': '28px',
        'pokedex-md': '16px',
        'pokedex-sm': '8px',
      }
    },
  },
  plugins: [],
}