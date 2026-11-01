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
        // Map slate to warm deep charcoal/espresso undertones
        slate: {
          950: '#100c08',
          900: '#18120c',
          800: '#271d15',
          700: '#3a2d21',
          600: '#584433',
          500: '#846750',
          400: '#b49980',
          300: '#d7c4b1',
          200: '#ebe0d5',
          100: '#f7f2ed',
        },
      },
    },
  },
  plugins: [],
};


