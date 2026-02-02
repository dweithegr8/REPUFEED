/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        primary: {
          orange: '#FF7F16',
          dark: '#08062A',
        },
        // Neutral Colors
        neutral: {
          white: '#FFFFFF',
          offWhite: '#FAFBFD',
          lightGray: '#E7E9ED',
          slate: '#64748B',
          darkGray: '#23272E',
        },
        // Semantic aliases for easier use
        brand: {
          accent: '#FF7F16',
          navy: '#08062A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(8, 6, 42, 0.1), 0 2px 4px -1px rgba(8, 6, 42, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(8, 6, 42, 0.1), 0 4px 6px -2px rgba(8, 6, 42, 0.05)',
      },
    },
  },
  plugins: [],
}
