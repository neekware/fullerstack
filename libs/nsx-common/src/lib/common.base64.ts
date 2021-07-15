/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

export class Base64 {
  public static encode(str: string): string {
    return Buffer.from(str).toString('base64').replace(/=+$/, ''); // Remove ending '='
  }

  public static decode(str: string): string {
    str = str + Array(5 - (str.length % 4)).join('='); // Adding ending '='
    return Buffer.from(str, 'base64').toString();
  }

  public static validate(str: string): boolean {
    return /^[A-Za-z0-9\-_]+$/.test(str);
  }
}
