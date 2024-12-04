import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lightgreen: "#76C163",
        actiongreen: "#76C163",
        darkgreen: "#3E7B32",
        greylight: "#EFEFEF",
        grey10: "#D1D1D1",
        grey30: "#ADADAD",
        grey40: "#A0A0A0",
        grey50: "#7D7D7D",
        blacklight: "#565656",
        medred: "#FF6969",
        lightred: "#FFEDED",
        darkred: "#7B3232",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      padding: {
        lng: "48px 24px",
      },
      height: {
        svh: "100svh", // Define a classe `h-svh`
      },
      transitionDuration: {
        fast: "100ms", // Define `duration-fast`
        medium: "300ms", // Define `duration-medium`
      },
    },
  },
  plugins: [],
} satisfies Config;
