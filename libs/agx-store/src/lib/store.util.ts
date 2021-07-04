/**
 * Return true if input is a function
 * @param input value of type any
 * @returns true if input is of type function
 */

export function isFunction(value: any): value is (...args: any[]) => any {
  return typeof value === 'function';
}

/**
 * A high performance low-collision unique number generator
 * @returns unique string
 */
export function getUniqueString(): string {
  return (Date.now() + Math.random()).toString(36);
}

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
