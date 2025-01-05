/** @type {import('tailwindcss').Config} */
export default {
   content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
   theme: {
      extend: {
         colors: {
            dark: {
               sidebar: '#262629',
               normal: '#1e1e1e',
               from: '#1e1e1e',
               to: '#6f6f6f',
            },
            orange: {
               low: '#FFBC81',
               mid: '#FFBC81',
               high: '#FF9232',
            },
            blue: {
               'ex-low': '#F1F0F0',
            },
            red: {
               base: '#FF3332',
               shallow: '#FF6565',
            },
            green: {
               base: '#94B889',
            },
            background: '#F5F7FB',
         },
         boxShadow: {
            inside: '0 0.25rem 1rem 0 rgba(0, 0, 0, 0.15)',
            outside: '0 0.25rem 0.75rem 0 rgba(0, 0, 0, 0.25)',
         },
         borderRadius: {
            inside: '0.375rem',
            outside: '0.75rem',
            extra: '0.875rem',
         },
         transitionTimingFunction: {
            bounce: 'cubic-bezier(0.32, -0.3, 0.32, 2.6)',
         },
         fontSize: {
            '2xs': 'fontSize: 0.625rem; lineHeight: 0.75rem;',
         },
      },
   },
   plugins: [],
};
