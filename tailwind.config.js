/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Map slate to rich dark orange / warm golden undertones (no mud brown)
        slate: {
          950: '#150702', // deepest dark-orange obsidian
          900: '#230e04', // rich dark-orange card base
          800: '#3a1707', // warm dark-orange border
          700: '#54220b', // lighter dark-orange border/divider
          600: '#753211', // muted dark-orange
          500: '#9e4618', // warm ember
          400: '#f59e0b', // glowing amber text
          300: '#fde047', // bright warm yellow text
          200: '#fef08a', // pale yellow text
          100: '#fffbeb', // warm white
        },
      },
    },
  },
  plugins: [],
};
