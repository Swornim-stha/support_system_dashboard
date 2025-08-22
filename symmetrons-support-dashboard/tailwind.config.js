/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f8ff',
          100: '#e6f1ff',
          200: '#cce3ff',
          300: '#99c7ff',
          400: '#66abff',
          500: '#338fff',
          600: '#0a74ff',
          700: '#005ed6',
          800: '#0049a3',
          900: '#003470',
        },
      },
    },
  },
  plugins: [],
}