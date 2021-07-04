/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { deepFreeze } from "@fullerstack/agx-store";

describe('DeepFreeze', () => {
  it('should mutate an unfrozen flat object', () => {
    const flatObject = { a: 1 };
    flatObject.a = 1;
    expect(flatObject.a).toEqual(1);
  });

  it('should not mutate a frozen flat object', () => {
    const flatObject = { a: 1 };
    const frozenValue = deepFreeze(flatObject);
    expect(() => {
      frozenValue.a = 1;
    }).toThrow("Cannot assign to read only property 'a' of object '[object Object]'");
  });

  it('should mutate an unfrozen nested object', () => {
    const nestObject = {
      a: 1,
      b: {
        c: {
          d: 1,
        },
      },
    };

    nestObject.b = { c: { d: 2 } };
    expect(nestObject.b.c.d).toEqual(2);
  });

  it('should not mutate a frozen nested object', () => {
    const nestObject = {
      a: 1,
      b: {
        c: {
          d: 1,
        },
      },
    };

    const frozenValue = deepFreeze(nestObject);

    expect(() => {
      frozenValue.b = { c: { d: 2 } };
    }).toThrow("Cannot assign to read only property 'b' of object '[object Object]'");
  });

  it('should mutate a frozen nested object after object.assign()', () => {
    const nestObject = {
      a: 1,
      b: {
        c: {
          d: 1,
        },
      },
    };

    const frozenValue = deepFreeze(nestObject);

    const newNestObject = Object.assign({}, frozenValue, { b: { c: { d: 1 } } });

    expect(() => {
      newNestObject.b = { c: { d: 2 } };
    }).not.toThrow("Cannot assign to read only property 'b' of object '[object Object]'");
  });

  it('should mutate a frozen nested object after spread operation {...}', () => {
    const nestObject = {
      a: 1,
      b: {
        c: {
          d: 1,
        },
      },
    };

    const frozenValue = deepFreeze(nestObject);

    const newNestObject = { ...frozenValue, ...{ b: { c: { d: 1 } } } };

    expect(() => {
      newNestObject.b = { c: { d: 2 } };
    }).not.toThrow("Cannot assign to read only property 'b' of object '[object Object]'");
  });
});
