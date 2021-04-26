/**
 * Checks if an object is a function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isFunction = (object: any): boolean => {
  return typeof object === 'function' || false;
};
