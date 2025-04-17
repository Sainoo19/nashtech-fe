
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    screens: {
      'xs': '480px', // Màn nhỏ hơn sm
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: '#373739', // Màu xám chính
        secondary: '#FFD154', // Màu vàng đậm
        text_color_secondary: '#FFFFFF',
        text_color_primary: '#000000',
        accent: '#657786', // Màu xám nhạt
        customGreen: '#00FF00', // Màu xanh lá tùy chỉnh
        background_admin: '#E7E7E3'// màu xám nhạt
      },
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}