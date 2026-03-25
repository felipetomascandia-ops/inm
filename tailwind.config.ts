import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dusk: {
          50: "#f5f2ff",
          100: "#e8e0ff",
          200: "#cdb8ff",
          300: "#b28fff",
          400: "#9563ff",
          500: "#7b3ff4",
          600: "#6429d1",
          700: "#4c1ea2",
          800: "#341473",
          900: "#210b47"
        },
        gold: {
          100: "#fff1c7",
          200: "#ffe09a",
          300: "#ffcf6b",
          400: "#ffbe3d",
          500: "#f3a61b",
          600: "#cc8212",
          700: "#9e5f0c"
        },
        turtle: {
          100: "#e7f5d5",
          200: "#c8e7a6",
          300: "#a2d76f",
          400: "#7fbd48",
          500: "#5d9a30",
          600: "#3f6f1d"
        },
        bag: {
          200: "#f2b27f",
          300: "#e8955c",
          400: "#d87543",
          500: "#b85a2f",
          600: "#8f4322"
        }
      },
      boxShadow: {
        glow: "0 0 30px rgba(123, 63, 244, 0.35)",
        gold: "0 0 35px rgba(255, 190, 61, 0.4)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
}

export default config
