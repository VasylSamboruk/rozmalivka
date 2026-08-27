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
          orange: '#FF5F15',
          pink: '#FF1493',
          blue: '#4169E1'
        }
      }
    },
  },
  plugins: [],
}