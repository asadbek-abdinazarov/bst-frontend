/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* === PRIMARY (Blue) === */
        primary: {
          DEFAULT: '#2563eb', // asosiy tugmalar
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },

        /* === NEUTRAL (White / Gray) === */
        neutral: {
          50:  '#f9fafb',   // page background
          100: '#f3f4f6',   // card bg
          200: '#e5e7eb',   // border
          300: '#d1d5db',
          400: '#9ca3af',   // placeholder
          500: '#6b7280',   // text secondary
          600: '#4b5563',
          700: '#374151',   // text primary
          800: '#1f2933',
          900: '#111827',
        },

        /* === ACCENT (Soft Blue) === */
        accent: {
          DEFAULT: '#38bdf8', // hover, highlight
          light: '#e0f2fe',
        },

        /* === STATUS COLORS === */
        success: '#22c55e',  // davomati bor
        warning: '#f59e0b',  // kechikkan
        danger:  '#ef4444',  // kelmagan / xato
        info:    '#0ea5e9',
      },
    },
  },
  plugins: [],
}
