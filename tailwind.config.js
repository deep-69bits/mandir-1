/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./pages/*.{js,ts,jsx,tsx}",
    "./pages/index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      backgroundImage: {
        "hero-bg": "url('/assets/images/ramMandirbackground.png')",
        "hero-bg-mobile": "url('/assets/images/bg-mobile.webp')",
      },
      colors: {
        "primaryBloodRed": "#FF0034",
        "lightPinkBg": "#feabbc",
        "secondary": "#1f2937",
        "accent": "#10b981",
        "custom-orange": "#F35E01",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
