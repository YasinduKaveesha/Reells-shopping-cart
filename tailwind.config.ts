import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#64BF47",
          primaryDark: "#4fa136",
          primarySoft: "#edf8e9",
          orange: "#FD9C46",
          orangeDark: "#e8852e",
          orangeSoft: "#fff3e8",
          backgroundOrange: "#FFF7EC",
          backgroundGreen: "#F5FBF4",
          dark: "#0f172a",
          darkSoft: "#1e293b",
          accent: "#f59e0b",
          accentDark: "#d97706",
          accentSoft: "#fef3c7",
          canvas: "#ffffff",
          header: "#f8fff5",
          surface: "#ffffff",
          surfaceMuted: "#f7faf5",
          textPrimary: "#1e293b",
          textSecondary: "#334155",
          textMuted: "#64748b",
          textInverse: "#ffffff",
          border: "#e2e8f0",
          borderStrong: "#cbd5e1",
          success: "#16a34a",
          warning: "#f59e0b",
          danger: "#dc2626",
          dangerSoft: "#fee2e2"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        panel: "0 16px 50px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
