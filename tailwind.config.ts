import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
    "./src/app/**/*.{ts,tsx,mdx}",
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
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
