/* eslint-disable @typescript-eslint/no-explicit-any */

import { isFunction } from 'lodash-es';

/**
 * Simple Object DeepFreeze implementation
 * https://github.com/ngxs/store/blob/master/packages/store/src/utils/freeze.ts
 */
export const deepFreeze = (obj: any) => {
  Object.freeze(obj);
  const oIsFunction = isFunction(obj);

  Object.getOwnPropertyNames(obj).forEach(function (prop) {
    if (
      Object.prototype.hasOwnProperty.call(obj, prop) &&
      (oIsFunction ? prop !== 'caller' && prop !== 'callee' && prop !== 'arguments' : true) &&
      obj[prop] !== null &&
      (typeof obj[prop] === 'object' || typeof obj[prop] === 'function') &&
      !Object.isFrozen(obj[prop])
    ) {
      deepFreeze(obj[prop]);
    }
  });

  return obj;
};
