/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2E7D32",
          hover: "#1B5E20",
        },
        secondary: {
          DEFAULT: "#F59E0B",
        },
        surface: {
          bg: "#FAFAF8",
          card: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#1F2937",
        },
        status: {
          success: "#22C55E",
          pending: "#FBBF24",
          transit: "#3B82F6",
          error: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "16px",
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(31, 41, 55, 0.06), 0 1px 2px rgba(31, 41, 55, 0.04)",
        "soft-lg": "0 8px 24px rgba(31, 41, 55, 0.08), 0 2px 6px rgba(31, 41, 55, 0.04)",
      },
      animation: {
        fadeIn: "fadeIn 0.25s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-in": "slideIn 0.25s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
