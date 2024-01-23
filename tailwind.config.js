/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      textColor: {
        darkmaintext: "#e9e9e9", // Set your dark mode main text color
        darksecondtext: "#a4a5a7", // Set your dark mode secondary text color
      },
      backgroundColor: {
        darkbg: "#1b1f23", // Set your dark mode background color
      },
      borderColor: {
        darkborder: "#4A5568", // Set your dark mode border color
      },
    },
  },
  plugins: [],
  darkMode: ["class"],
};
