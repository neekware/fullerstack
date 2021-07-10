/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { merge as ldNestedMerge } from 'lodash';

export interface RenderOptions {
  singleSpace: boolean;
  trim: boolean;
}

export interface RenderContext {
  [name: string]: string | number;
}

export const DefaultRenderOptions = {
  singleSpace: false,
  trim: false,
};

/**
 * Interpolation of template with args
 */
const template = (tpl, args) => tpl.replace(/\${(\w+)}/g, (_, v) => args[v]);

/**
 * Interpolation of template with args with params
 * Ex: input: 'user/${{id}}', params: {id: '222'}, output: 'user/222')
 * @param inputString An input of type string
 * @param params A key:value object of parameters
 * @param options Options for Interpolation
 * @returns A params interpolated string
 */
export const renderTemplate = (
  inputString: string,
  params: RenderContext,
  options?: RenderOptions
): string => {
  options = ldNestedMerge(DefaultRenderOptions, options || {});
  let output = template(inputString, params);
  if (options.singleSpace) {
    output = output.replace(/\s+/g, ' ');
  }
  if (options.trim) {
    output = output.trim();
  }
  return output;
};
