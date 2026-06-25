import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        signal: "#0f766e",
        flare: "#f97316",
        horizon: "#0f172a",
        mist: "#f8fafc",
      },
      boxShadow: {
        panel: "0 20px 60px rgba(15, 23, 42, 0.14)",
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at top left, rgba(249,115,22,0.18), transparent 28%), radial-gradient(circle at top right, rgba(20,184,166,0.16), transparent 26%), linear-gradient(180deg, rgba(248,250,252,1), rgba(241,245,249,1))",
      },
    },
  },
  plugins: [],
};

export default config;
