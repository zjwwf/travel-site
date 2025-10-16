module.exports = {
  content: [
    './index.html',
    './public/index.html',
    './src/**/*.{vue,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primaryBlue: '#1e75d8',
        primaryGreen: '#1fae81'
      },
      container: { center: true, padding: '1rem' }
    }
  },
  plugins: []
};