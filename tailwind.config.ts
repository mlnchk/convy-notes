import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        default: [
          '"Euclid Circular A"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      colors: {
        current: "currentColor",
        transparent: "transparent",

        "accent-primary": "var(--accent-primary)",
        "accent-secondary": "var(--accent-secondary)",
        "content-primary": "var(--content-primary)",
        "content-secondary": "var(--content-secondary)",
        "on-surface-primary": "var(--on-surface-primary)",
        "on-surface-secondary": "var(--on-surface-secondary)",
        surface: "var(--surface)",
        background: "var(--background)",

        white: "#FFF",
        black: "#000",
        green: "#20C5A0",
        red: {
          DEFAULT: "#FF6059",
          bright: "#FF3333",
        },
      },
      fontSize: {
        header: ["2rem", "2.5rem"],
        header2: ["1.25rem", "1.75rem"],
        body2: ["1rem", "1.5rem"],
        body: ["0.875rem", "1.25rem"],
        caption: ["0.75rem", "1rem"],
        caption2: ["0.625rem", "0.75rem"],
      },
      borderRadius: {
        none: "0",
        xs: "0.25rem",
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        full: "9999px",
      },
      boxShadow: {
        modal: "var(--shadow-modal)",
        popup: "var(--shadow-popup)",
      },
      screens: {
        sm: "320px",
        md: "588px",
        lg: "960px",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
