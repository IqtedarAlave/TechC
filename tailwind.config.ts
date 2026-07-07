import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // TechC Brand Palette
        brand: {
          50:  "#eef5ff",
          100: "#d9e8ff",
          200: "#bbd4ff",
          300: "#8ab8ff",
          400: "#5590f7",
          500: "#3b6ef0",  // Primary
          600: "#2a52d6",
          700: "#2240ac",
          800: "#21388b",
          900: "#1e3270",
          950: "#161f47",
        },
        accent: {
          400: "#34d399",  // Emerald — validation/success
          500: "#10b981",
          600: "#059669",
        },
        surface: {
          DEFAULT: "#0f1117",   // Near-black background
          card:    "#16181f",   // Card surface
          border:  "#252836",   // Borders
          muted:   "#2a2d3e",   // Subtle dividers
        },
      },
      fontFamily: {
        sans:  ["Inter", "system-ui", "sans-serif"],
        mono:  ["JetBrains Mono", "monospace"],
        display: ["Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease both",
        "fade-in": "fadeIn 0.3s ease both",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
