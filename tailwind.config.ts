import type { Config } from 'tailwindcss';

// Brand colours carried over from the Angular app's stylesheets.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#F0F0F0', // app background
        nav: '#d8deeb', // header + footer
        chart: {
          views: '#2a78d6',
          visitors: '#eb6834',
        },
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
