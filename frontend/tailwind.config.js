/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef4ff',
          100: '#dbe6fe',
          500: '#4f6ef7',
          600: '#3d56e6',
          700: '#3245c4',
        },
      },
    },
  },
  plugins: [],
}
