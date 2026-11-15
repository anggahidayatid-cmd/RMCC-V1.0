/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C73E8',
          light: '#8B72DE',
          accent: '#668BE8',
          dark: '#25283A',
        },
        background: 'var(--bg-color)',
        surface: 'var(--surface-color)',
        border: 'var(--border-color)',
        dark: 'var(--text-color)',
        muted: 'var(--muted-color)',
      },
    },
  },
  plugins: [],
};
