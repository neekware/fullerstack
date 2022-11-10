const nxPreset = require('@nrwl/jest/preset').default;

/**
 * We want tree-shaking during production build, and can skip it in test
 */
module.exports = {
  ...nxPreset,
  ...{
    moduleNameMapper: {
      '^lodash-es$': 'lodash',
      '^crypto-es$': 'crypto-js',
    },
  },
  ...{
    testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
    transform: { '^.+\\.(ts|js|html)$': 'ts-jest' },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageReporters: ['html', 'json', 'lcov'],
  },
};
