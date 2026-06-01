import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './emails/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        nuit: '#1A1612',
        'nuit-2': '#231F1A',
        'nuit-3': '#2C2620',
        champagne: '#F5E6C8',
        sable: '#F0E0C4',
        or: '#C9A84C',
        'or-hover': '#E2C06A',
        'rose-gold': '#B76E79',
        creme: '#FDFAF4',
        muted: '#7a6e64',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Satoshi', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
