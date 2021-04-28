const { guessProductionMode } = require("@ngneat/tailwind");

module.exports = {
    prefix: '',
    purge: {
      enabled: guessProductionMode(),
      content: [
        './apps/**/*.{html,ts}',
        './libs/**/*.{html,ts}',
      ]
    },
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
