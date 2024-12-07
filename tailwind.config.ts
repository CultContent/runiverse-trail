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
          'custom-pattern': "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22-50 -50 580 580%22%3E%3Cfilter id=%22b%22%3E%3CfeGaussianBlur stdDeviation=%2225%22/%3E%3C/filter%3E%3Cpath filter=%22url(%23b)%22 fill=%22%23808080%22 d=%22M398.7 240A239.4 239.4 0 0 0 480 60V0h-60c-71.7 0-136 31.4-180 81.3A239.4 239.4 0 0 0 60 0H0v60c0 71.7 31.4 136 81.3 180A239.4 239.4 0 0 0 0 420v60h60c71.7 0 136-31.4 180-81.3A239.4 239.4 0 0 0 420 480h60v-60c0-71.7-31.4-136-81.3-180Z%22/%3E%3C/svg%3E')"
      },
      fontFamily: {
        atirose: ['Atirose', 'sans-serif'],
        ocra: ['OCRAStd', 'sans-serif'],
      },
      colors:{
        yellow: "#fabd2f",
        darkyellow: "#d79921",
        darkgray: "#504945",
        blue: "#458588",
        bg0: "#3c3836",
        fg3: "#bdae93"
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

