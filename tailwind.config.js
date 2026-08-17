/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#07090c',
        'surface': '#11171e',
        'surface-elevated': '#18212b',
        'primary': '#65dcff',
        'accent': '#618cff',
        'text-primary': '#eef4f8',
        'text-muted': '#8b9aa8',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'hub': '0 0 0 1px rgba(205,230,242,0.08), 0 24px 80px -12px rgba(0,0,0,0.7)',
        'hub-glow': '0 0 60px -12px rgba(101, 220, 255, 0.2)',
      },
      backgroundImage: {
        'hub-grid': `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'hub': '72px 72px',
      },
    },
  },
  plugins: [],
}
