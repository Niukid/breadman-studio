import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fondos por sección
        slate: "#283035",
        bark: "#732706",
        steel: "#5F7884",
        terracotta: "#B65534",
        plum: "#6F4B52",
        overlayBlack: "#101010",
        // Acentos por sección
        fog: "#899EAA",
        skyLight: "#B7D0DE",
        worksAccent: "#C9DCE6",
        sandAccent: "#E7CBAD",
        aboutAccent: "#C6D2DB",
        caseAccent: "#C9D6DE",
        onAccent: "#16191c",
        cardBg: "#263038",
        cardBgHover: "#2C3841",
        chatPanel: "#1b1f23",
        chatText: "#DDE6EA",
      },
      fontFamily: {
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      letterSpacing: {
        widest2: "0.14em",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.03)" },
        },
        "home-bg": {
          "0%, 100%": { backgroundColor: "#732706" },
          "20%": { backgroundColor: "#5F7884" },
          "40%": { backgroundColor: "#6F4B52" },
          "60%": { backgroundColor: "#283035" },
          "80%": { backgroundColor: "#B65534" },
        },
        "btn-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.95)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 1000ms ease-in-out infinite",
        "home-bg": "home-bg 60s ease-in-out infinite",
        "btn-pulse": "btn-pulse 500ms ease-in-out",
        "spin-slow": "spin-slow 16000ms linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
