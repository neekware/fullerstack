import { merge as ldNestedMerge } from 'lodash-es';

/**
 * Options for interpolation
 */
export interface InterpolationOptions {
  singleSpace: boolean;
  trim: boolean;
}

/**
 * Default interpolation options
 */
export const DefaultInterpolationOptions = {
  singleSpace: true,
  trim: true,
};

/**
 * Interpolation of template with args
 */
const template = (tpl, args) => tpl.replace(/\${(\w+)}/g, (_, v) => args[v]);

/**
 * Interpolation of template with args with params
 * @param inputString An input of type string
 * @param params A key:value object of parameters
 * @param options Options for Interpolation
 * @returns A params interpolated string
 */
export const interpolate = (
  inputString: string,
  params: { [id: string]: string | number },
  options?: InterpolationOptions
): string => {
  options = ldNestedMerge(DefaultInterpolationOptions, options || {});
  let output = template(inputString, params);
  if (options.singleSpace) {
    output = output.replace(/\s+/g, ' ');
  }
  if (options.trim) {
    output = output.trim();
  }
  return output;
};
