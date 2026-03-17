/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean:  { DEFAULT: "#0077B6", light: "#00B4D8", dark: "#023E8A" },
        sand:   { DEFAULT: "#F4A261", light: "#FFDDD2", dark: "#E76F51" },
        coral:  { DEFAULT: "#E63946" },
        mist:   { DEFAULT: "#F8FAFC" },
        slate:  { 850: "#1A2332" },
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body:    ["'DM Sans'", "system-ui", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #023E8A 0%, #0077B6 45%, #00B4D8 100%)",
        "card-gradient": "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)",
      },
      boxShadow: {
        card:  "0 4px 24px rgba(0,119,182,0.10)",
        float: "0 8px 40px rgba(0,0,0,0.12)",
      },
      animation: {
        "fade-up":    "fadeUp 0.6s ease forwards",
        "slide-in":   "slideIn 0.4s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:  { "0%": { opacity: 0, transform: "translateY(20px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        slideIn: { "0%": { opacity: 0, transform: "translateX(-12px)" }, "100%": { opacity: 1, transform: "translateX(0)" } },
      },
    },
  },
  plugins: [],
};
