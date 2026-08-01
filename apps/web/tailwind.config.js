/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#faf8f6', // oklch(98% 0.003 90)
        surface: '#FFFFFF',
        text: {
          primary: '#0A0A0A',
          secondary: 'rgba(10,10,10,0.65)',
          tertiary: 'rgba(10,10,10,0.5)',
        },
        accent: {
          primary: '#7F53F3', // purple
          hover: '#95048B', // magenta-purple
          bright: '#F814E8', // pink
          success: '#25EFB8', // teal
          success_dark: '#0A9B71', // dark green
        },
        border: {
          light: 'rgba(10,10,10,0.08)',
          default: 'rgba(10,10,10,0.06)',
        },
      },
      borderRadius: {
        full: '999px',
        lg: '22px',
        md: '14px',
        sm: '10px',
        xs: '8px',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        light: '500',
        normal: '500',
        medium: '600',
        semibold: '700',
        bold: '800',
      },
      fontSize: {
        xs: ['11.5px', '1.4'],
        sm: ['13.5px', '1.4'],
        base: ['15px', '1.5'],
        lg: ['16px', '1.5'],
        xl: ['19px', '1.6'],
        '2xl': ['22px', '1.6'],
        '3xl': ['26px', '1.6'],
        '4xl': ['30px', '1.6'],
        '5xl': ['34px', '1.6'],
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.1)',
        modal: '0 20px 50px rgba(0,0,0,0.15)',
      },
      backgroundImage: {
        'cta-gradient': 'linear-gradient(135deg, #95048B, #7F53F3)',
      },
    },
  },
  plugins: [],
};
