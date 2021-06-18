/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { tryGet } from './util.tryget';

interface D {
  name: string;
}
interface C {
  name: string;
  d: D;
}
interface B {
  name: string;
  c?: C;
}
interface A {
  name: string;
  b: B;
}

const fullData: A = {
  name: 'A',
  b: {
    name: 'B',
    c: {
      name: 'C',
      d: {
        name: 'D',
      },
    },
  },
};

const partialData: A = {
  name: 'A',
  b: {
    name: 'B',
  },
};

const HELLO_WORLD = 'Hello World';

describe('tryGet (TypedGet)', function () {
  it('should get nested object attribute', () => {
    expect(tryGet(() => fullData.b.c.d.name)).toBe('D');
  });

  it('should get return null for undefined nested object attribute', () => {
    expect(tryGet(() => partialData.b.c.d.name)).toBe(null);
  });

  it('should get return default value for undefined nested object attribute', () => {
    expect(tryGet(() => partialData.b.c.d.name, HELLO_WORLD)).toBe(HELLO_WORLD);
  });

  it('should get the correct object type', () => {
    const isC = (obj: any): obj is C => obj !== undefined;
    const value = tryGet<C>(() => fullData.b.c);
    expect(value).toBeTruthy();
    expect(isC(value)).toBe(true);
  });

  it('should get the default value for undefined nested object', () => {
    const cObj: C = { name: 'C', d: { name: 'D' } };
    const value = tryGet<C>(() => partialData.b.c, cObj);
    expect(value).toBe(cObj);
  });

  it('should get the default value of defined type', () => {
    const value = tryGet<string>(() => partialData.b.c.d.name, HELLO_WORLD);
    expect(value).toBe(HELLO_WORLD);
    expect(typeof value === 'string').toBe(true);
  });

  it('should get the default value of inferred type', () => {
    const value = tryGet(() => partialData.b.c.d.name, HELLO_WORLD);
    expect(value).toBe(HELLO_WORLD);
    expect(typeof value === 'string').toBe(true);
  });
});
