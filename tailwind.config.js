/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#0B0E1F',
        'night-2': '#141A35',
        parchment: '#F1E9D2',
        'parchment-dim': '#CFC6A9',
        ink: '#1B140C',
        grass: '#4C7A2E',
        'grass-dark': '#345319',
        'grass-light': '#6FA043',
        torch: '#FF9130',
        'torch-light': '#FFB35C',
        tnt: '#E33D2E',
        ender: '#7C4DFF',
        'ender-light': '#A88BFF',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        body: ['Rubik', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        site: '1120px',
      },
    },
  },
  plugins: [],
}
