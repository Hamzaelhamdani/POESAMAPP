module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        orangeTelecom: {
          50: '#fff5eb',
          100: '#ffe9d6',
          200: '#ffd0a8',
          300: '#ffb97b',
          400: '#ff9a4d',
          500: '#ff7f00',
          600: '#ff6600',
          700: '#e65500',
          800: '#cc4700',
          900: '#993400',
        },
        brand: {
          DEFAULT: '#ff6600',
          light: '#ffd0a8',
          dark: '#e65500',
        },
      },
    },
  },
  plugins: [],
}
