/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        maroon: "#730000",
        darkmaroon: "#500000",
      },
      
      screens: {
        print: { 'raw': 'print' },
      },
    },
  },
  plugins: [],
};