import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        stor: {
          950: "#0a1628",
          900: "#0f2744",
          800: "#163556",
          700: "#1e4a6e",
          accent: "#00b8a9",
          muted: "#7dd3c0",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
