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
        /* Secondary: deep navy — structural elements and primary text */
        navy: {
          950: "#050F1F",
          900: "#081A33",
          800: "#0D2547",
          700: "#122E59",
          600: "#16325A",
          500: "#1B3A66",
        },
        /* Tertiary: mid-to-dark blue — interactive elements and accents */
        blue: {
          700: "#0E3568",
          600: "#15498C",
          500: "#3D6FB5",
          400: "#6C9BD8",
          300: "#A8C3E8",
          100: "#CBDDF2",
          50:  "#EEF4FB",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      animation: {
        "fade-in":  "fadeIn 0.3s ease-out forwards",
        "slide-up": "slideUp 0.3s ease-out forwards",
        shimmer:    "shimmer 1.5s infinite linear",
        "toast-in": "toastIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        toastIn: { from: { transform: "translateY(12px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
      },
      boxShadow: {
        /* Hairline elevation only — no ambient glows */
        xs: "0 1px 2px rgba(11,31,58,0.05)",
        sm: "0 1px 3px rgba(11,31,58,0.07), 0 1px 2px rgba(11,31,58,0.04)",
        md: "0 3px 8px rgba(11,31,58,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
