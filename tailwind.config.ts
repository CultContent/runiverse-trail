import {nextui} from '@nextui-org/theme'

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    './node_modules/@nextui-org/theme/dist/components/(button|navbar|link).js'
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        meksans: ['MEKSANS', 'sans-serif'],
        vcr: ['VCR', 'sans-serif'],
        upheav: ['Upheav', 'sans-serif'],
        thaleahfat: ['ThaleahFat', 'sans-serif'],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

