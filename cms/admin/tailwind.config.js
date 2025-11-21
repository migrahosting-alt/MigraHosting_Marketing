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
          purple: '#6A5CFF',
          'purple-dark': '#8A4DFF',
          pink: '#FF6584',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
