/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    container: {
      center: true,
      padding: {
        'DEFAULT': "12px",
      },
    },
    screens: {
      'sm': '1024px',
    },
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'sans-serif', 'system-ui'],
        'montserrat': ['Montserrat', 'sans-serif', 'system-ui'],
      },
      screens: {
        'mobile': {'max': '640px', 'min': '370px'},
        // => @media (min-width: 370px) { ... }
        'tablet': '640px',
        // => @media (min-width: 640px) { ... }
        'laptop': '1920px',
        // => @media (min-width: 1024px) { ... }
        'desktop': '1024px',
        // => @media (min-width: 1024px) { ... }
      }
    },
  },
  plugins: [],
}

