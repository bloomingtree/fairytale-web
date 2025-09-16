/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      aspectRatio: {
        '1/2': '1/2',
        '3/4': '3/4',
      },
    },
  },
  plugins: [],
}

