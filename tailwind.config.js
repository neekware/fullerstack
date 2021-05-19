const { guessProductionMode } = require('@ngneat/tailwind');

module.exports = {
  prefix: '',
  purge: {
    enabled: guessProductionMode(),
    content: ['./apps/**/*.{html,ts}', './libs/**/*.{html,ts}'],
  },
  darkMode: 'class', // false or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        xs: { min: '0px', max: '599px' },
        'gt-xs': { min: '600px' },
        sm: { min: '600px', max: '959px' },
        'lt-sm': { max: '599px' },
        'gt-sm': { min: '960px' },
        md: { min: '960px', max: '1279px' },
        'lt-md': { max: '959px' },
        'gt-md': { min: '1280px' },
        lg: { min: '1280px', max: '1919px' },
        'lt-lg': { max: '1279px' },
        'gt-lg': { min: '1920px' },
        xl: { min: '1920px' },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
