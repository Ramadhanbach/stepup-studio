export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#00ebc7',
        secondary: '#ff5470',
        dark: '#00214d',
        light: '#ffffff',
        paragraph: '#1b2d45',
        tertiary: '#fde24f'
      }
    },
  },
  plugins: [],
}
