/**
 * NOTE: This project uses Tailwind CSS v4.
 * In Tailwind v4, configuration is handled via CSS @theme in globals.css.
 * This file is kept for reference only and is NOT processed by the v4 engine.
 *
 * All design tokens are defined in: app/globals.css → @theme { ... }
 */

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b2545",
        deep: "#13315c",
        "deep-2": "#0a1f3d",
        teal: "#1d6a96",
        "teal-2": "#2e8bb8",
        cyan: "#5aaed1",
        sky: "#8dc7dc",
        mist: "#d6e6ef",
        foam: "#eef6fa",
        sand: "#f1f6f9",
        "sand-2": "#e2ecf2",
        warm: "#d98b3f",
        gold: "#b8860b",
        bg: "#f7fbfc",
        card: "#ffffff",
      },
      fontFamily: {
        sans: [
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        serif: [
          "Playfair Display",
          "Georgia",
          "serif",
        ],
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "14px",
        lg: "22px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(11,42,80,.06), 0 1px 3px rgba(11,42,80,.04)",
        DEFAULT: "0 4px 12px rgba(11,42,80,.09), 0 2px 4px rgba(11,42,80,.05)",
        lg: "0 24px 48px -12px rgba(11,42,80,.24), 0 12px 24px -12px rgba(11,42,80,.14)",
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "14": "56px",
        "20": "80px",
        "30": "120px",
      },
    },
  },
  plugins: [],
};

export default config;
