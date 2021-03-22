const nxPreset = require('@nrwl/jest/preset');

/**
 * We want tree-shaking during production build, and can skip it in test
 */
module.exports = {
  ...nxPreset,
  ... { 
    moduleNameMapper: {
    "^lodash-es$": "lodash"
    }
  }
};
