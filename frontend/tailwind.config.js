/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {},
      colors: {},
      fontFamily: {
        spacegroteskbold: "Space Grotesk Bold",
        spacegrotesklight: "Space Grotesk Light",
        spacegroteskmedium: "Space Grotesk Medium",
        spacegroteskregular: "Space Grotesk Regular",
        spacegrotesksemibold: "Space Grotesk Semibold",
      },
    },
  },
  plugins: [],
};
