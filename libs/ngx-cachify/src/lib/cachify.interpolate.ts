/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { cloneDeep as ldDeepClone, mergeWith as ldMergeWith } from 'lodash-es';

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
const template = (tpl, args) => tpl.replace(/{(\w+)}/g, (t, v) => args[v] || t);

/**
 * Interpolation of template with args with params
 * Ex: input: 'user/${id}', params: {id: '222'}, output: 'user/222')
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
  options = ldMergeWith(ldDeepClone(DefaultInterpolationOptions), options, (dest, src) =>
    Array.isArray(dest) ? src : undefined
  );
  let output = template(inputString, params);
  if (options.singleSpace) {
    output = output.replace(/\s+/g, ' ');
  }
  if (options.trim) {
    output = output.trim();
  }
  return output;
};
