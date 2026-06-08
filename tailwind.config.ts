import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Navy palette */
        navy: {
          950: "#040C18",
          900: "#070F1C",
          800: "#0A1929",
          700: "#0D1F3C",
          600: "#0F2D52",
          500: "#1A3F6F",
          400: "#1E5799",
          300: "#2B6CB0",
        },
        /* Sky accent */
        sky: {
          950: "#082F49",
          900: "#0C4A6E",
          600: "#0284C7",
          500: "#0EA5E9",
          400: "#38BDF8",
          300: "#7DD3FC",
          100: "#E0F2FE",
          50:  "#F0F9FF",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      animation: {
        "pulse-slow":  "pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite",
        "fade-in":     "fadeIn 0.35s ease-out forwards",
        "slide-up":    "slideUp 0.35s ease-out forwards",
        "slide-right": "slideRight 0.35s ease-out forwards",
        shimmer:       "shimmer 1.5s infinite linear",
        "toast-in":    "toastIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
      },
      keyframes: {
        fadeIn:      { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp:     { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideRight:  { "0%": { opacity: "0", transform: "translateX(-12px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        shimmer:     { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        toastIn:     { from: { transform: "translateY(16px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
      },
      boxShadow: {
        /* Elevation system */
        "xs":    "0 1px 2px rgba(0,0,0,0.06)",
        "sm":    "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        "md":    "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)",
        "lg":    "0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04)",
        /* Navy-specific */
        "navy":       "0 4px 24px rgba(10,25,41,0.25)",
        "navy-lg":    "0 8px 40px rgba(10,25,41,0.35)",
        /* Sky glow */
        "sky-glow":   "0 0 20px rgba(56,189,248,0.30)",
        "sky-glow-sm":"0 0 10px rgba(56,189,248,0.20)",
      },
    },
  },
  plugins: [],
};

export default config;
