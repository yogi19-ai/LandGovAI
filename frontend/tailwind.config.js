/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: "#0A2540",
          navy: "#0F172A",
          saffron: "#FF9933",
          green: "#138808",
          sky: "#0284C7",
          gold: "#D97706",
          light: "#F8FAFC",
          slate: "#334155",
          card: "#1E293B"
        }
      }
    },
  },
  plugins: [],
}
