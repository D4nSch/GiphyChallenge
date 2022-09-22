/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    // default breakpoints but with 40px removed
    screens: {
      sm: '550px',
      md: '700px',
      lg: '900px',
      xl: '1100px',
      '2xl': '1300px',
    },
    colors: {
      primary: '#5c6ac4',
      secondary: '#ecc94b'
    },
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: []
  }
}
