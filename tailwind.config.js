/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Preset B: Midnight Luxe
        primary: "#0D0D12",       // Obsidian
        accent: "#C9A84C",        // Champagne
        background: "#FAF8F5",    // Ivory
        textDark: "#2A2A35",      // Slate
        accentLight: "#E8CD82",   // Champagne Light
        accentDark: "#A68630",    // Champagne Dark
        surface: "#1A1A22",       // Card surface
        surfaceBorder: "#2A2A35", // Card border
        muted: "#8A8A9E",         // Muted text
      },
      fontFamily: {
        heading: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"Figtree"', 'sans-serif'],
        drama: ['"Instrument Serif"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        'magnetic': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
    },
  },
  plugins: [],
}
