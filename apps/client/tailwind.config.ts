import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          '50': 'hsl(229, 100%, 96.7%)',
          '100': 'hsl(230, 100%, 93.9%)',
          '200': 'hsl(232, 93%, 88.8%)',
          '300': 'hsl(232, 91.4%, 81.8%)',
          '400': 'hsl(242, 81.4%, 68.4%)',
          '500': 'hsl(242, 81.4%, 68.4%)',
          '600': 'hsl(247, 73.5%, 58.6%)',
          '700': 'hsl(248, 56.3%, 50.6%)',
          '800': 'hsl(247, 53.6%, 41.4%)',
          '900': 'hsl(245, 46.3%, 34.3%)',
          '950': 'hsl(247, 45.1%, 20%)',
          main: '#716DF0',
        },
        accent: {
          '50': 'hsl(169, 100%, 96.7%)',
          '100': 'hsl(175, 100%, 88.6%)',
          '200': 'hsl(175, 100%, 77.3%)',
          '300': 'hsl(175, 98.9%, 64.3%)',
          '400': 'hsl(177, 85%, 50.4%)',
          '500': 'hsl(178, 100%, 40.8%)',
          '600': 'hsl(179, 100%, 32.9%)',
          '700': 'hsl(180, 100%, 25.1%)',
          '800': 'hsl(181, 89.2%, 21.8%)',
          '900': 'hsl(180, 79.4%, 19%)',
          '950': 'hsl(183, 100%, 10.4%)',
          main: '#00C2B3',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
