/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpHeaders } from '@angular/common/http';
import { merge as ldNestedMerge } from 'lodash-es';

import { DefaultFetchPolicies, DefaultInterpolationOptions } from './cachify.default';
import {
  CACHIFY_FETCH_POLICY,
  CACHIFY_KEY,
  CACHIFY_TTL,
  CachifyMetaData,
  InterpolationOptions,
} from './cachify.model';

/**
 * Checks if an object is a function
 * @param input An input of any type
 */
export function isFunction(input: any): boolean {
  return typeof input === 'function' || input instanceof Function || false;
}

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

/**
 * Class to create ordered path to our internal state/store
 */
export class OrderedStatePath {
  private map = new Map<string | number, string | number>();

  /**
   * Cleans up an input string consumable by objects as key or value
   * @param input A key or a value
   */
  private cleanString(input: string): string {
    return `${input}`
      .replace(/\s+/gm, '') // convert to single line
      .replace(/\./g, '_') // replace . with _
      .replace(/_+/g, '_') // replace multiple _ with single _
      .replace(/^[_]+|[_]+$/g, '') // remove _ from start & end
      .trim();
  }

  /**
   * Add a key,value pair to internal map
   * @param key Key of a tuple
   * @param value Value of a tuple
   * @returns A map of key,value pairs
   * Note: value = '*' means catch all
   */
  append(key: string | number, value: string | number) {
    key = this.cleanString(`${key}`);
    if (!key || key.length < 1) {
      throw Error('Error: empty key is not allowed!');
    }

    value = this.cleanString(`${value}`);
    if (!value || value.length < 1) {
      throw Error('Error: empty value is not allowed!');
    }

    this.map = this.map.set(key, value);
    return this;
  }

  /**
   * Converts the internal key,value map to a dot-separated string
   * @returns  A dot-separated string (a path into the state object in the store)
   */
  toString() {
    const levels = [];
    this.map.forEach((value, key) => {
      levels.push(`${key}.[${value}]`);
    });
    return levels.join('.').replace(/\s+/g, '');
  }
}

/**
 * Returns true if fetch policy exists and is enabled
 * @param policy Fetch policy type
 */
export function isPolicyEnabled(policy: string): boolean {
  const enabled = Object.keys(DefaultFetchPolicies).find(
    (key) => DefaultFetchPolicies[key] === policy
  );
  return !!enabled;
}

/**
 * Adds Http Cache Meta to headers
 * @param meta Http cache meta data
 * @param headers Http Headers instance
 */
export function addMetaToHttpHeaders(meta: CachifyMetaData, headers?: HttpHeaders): HttpHeaders {
  if (!headers) {
    headers = new HttpHeaders();
  }
  headers = headers
    .append(CACHIFY_FETCH_POLICY, meta.policy)
    .append(CACHIFY_KEY, meta.key)
    .append(CACHIFY_TTL, meta.ttl.toString());
  return headers;
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
