const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: '',
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class', // false or 'media' or 'class'
  theme: {
    extend: {},
    // container: {
    //   padding: '2rem',
    // },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
