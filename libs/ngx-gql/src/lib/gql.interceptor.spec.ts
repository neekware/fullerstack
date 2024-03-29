/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { TestBed } from '@angular/core/testing';

import { GqlInterceptor } from './gql.interceptor';

describe('GqlInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [GqlInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: GqlInterceptor = TestBed.inject(GqlInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
