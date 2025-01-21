import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // whitegreen: '#EFFFEB',
        // lightgreen: '#76C163',
        // darkgreen: '#3E7B32',
        whitegreen: '#EFFFEB',
        lightgreen: '#549843',
        actiongreen: '#549843',
        darkgreen: '#417B32',
        ulgrey: '#FAFAFA',
        greylight: '#EFEFEF',
        grey5: '#E5E7EB',
        grey10: '#D1D1D1',
        grey30: '#ADADAD',
        grey40: '#A0A0A0',
        grey50: '#7D7D7D',
        blacklight: '#565656',
        blackmed: '#313131',
        blackblack: '#2B2B2B',
        medred: '#FF6969',
        lightred: '#FFEDED',
        darkred: '#7B3232',
        neutralgreen: '#F3F9F2'
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem'
      },
      padding: {
        lng: '48px 24px',
        db: '0px 0px 3px 12px',
        db1: '9px 11px 5px 11px'
      },
      boxShadow: {
        toogle: ' 0px 0px 0px 1px #417B32',
        dbbd: '0 0 0 2px #549843',
        dbde: '0 0 0 1px #D1D1D1',
        dt: '0 4px 8px 0 #00000008'
      },
      height: {
        svh: '100svh'
      },
      borderWidth: {
        '1': '1px'
      },
      transitionDuration: {
        fast: '100ms',
        medium: '300ms'
      },
      gridTemplateColumns: {
        frq: 'repeat(4,  1fr)',
        edref: '56px 56px 1fr 15px'
      },
      backgroundImage: {
        'half-lightred-transparent':
          'linear-gradient(to top, #FFEDED 50%, transparent 51%)'
      }
    }
  },
  plugins: []
} satisfies Config
