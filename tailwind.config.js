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
    extend: {
      colors: {
        'gBackgroundDark': '#182921',
        'gBackgroundLight': '#1D3F2F',
        'gAccent': '#43F2A7',
        'gDark': '#1C1C1C',
        'gLight': '#E8E8E8'
      }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: []
  }
}
