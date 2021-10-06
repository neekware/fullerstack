/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import crypto from 'crypto-es';

export function signObject<T extends { signature: string }>(obj: T): T {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { signature, ...newObj } = obj || ({} as T);
  return {
    ...obj,
    ...{
      signature: crypto.MD5(JSON.stringify(newObj)).toString(),
    },
  } as T;
}

export function sanitizeJsonStringOrObject<T extends { signature: string }>(
  obj: T | string
): T | undefined {
  let origObj: T;

  if (typeof obj === 'string') {
    try {
      origObj = JSON.parse(obj) as T;
    } catch (e) {
      return undefined;
    }
  } else {
    origObj = obj;
  }

  const testObj = signObject<T>(origObj);
  return origObj?.signature === testObj?.signature ? origObj : undefined;
}
