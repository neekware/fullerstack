/**
 * Interim solution till Typescript implements ts39
 * https://github.com/tc39/proposal-optional-chaining
 *
 * Try/Catch method - fast try (when found), slow catch (when undefined)
 * https://un33k-ng-type-error.stackblitz.io/
 *
 * Performant: when loop of 1000 or less.
 * Chrome: try: 0.3ms, catch: 6.2 ms (loop of 1000)
 *         ~1800% faster than lodash get on success (try)
 *         ~10% slower than lodash get on failure (catch)
 * Usage:
 * old way
 * if (a &&
 *     a.b &&
 *     a.b.c &&
 *     a.b.c.d &&
 *     a.b.c.d.name) {
 *   console.log(a.b.c.d.name);
 * } else {
 *   console.log('Hello World');
 * }
 *
 * new way
 * console.log(tryGet(() => a.b.c.name, 'Hello World'));
 */
export function tryGet<T>(fn: () => T, fallback: T = null): T {
  try {
    return fn() || fallback;
  } catch (e) {
    if (e instanceof TypeError) {
      return fallback;
    }
    throw e;
  }
}
