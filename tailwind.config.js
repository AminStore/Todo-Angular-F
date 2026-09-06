/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        ink: '#f7f7fb',
        muted: '#9b9caf',
        subtle: '#6c6c7e',
        panel: '#191a27',
        purple: '#7568f6',
        'purple-light': '#aaa0ff',
        line: 'rgb(255 255 255 / 8%)'
      },
      fontFamily: {
        sans: ['DM Sans', 'Helvetica Neue', 'sans-serif'],
        display: ['Space Grotesk', 'DM Sans', 'sans-serif']
      }
    }
  },
  plugins: []
};