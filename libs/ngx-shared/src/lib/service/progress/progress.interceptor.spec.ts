/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { TestBed } from '@angular/core/testing';

import { ProgressInterceptor } from './progress.interceptor';

describe('ProgressInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [ProgressInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: ProgressInterceptor = TestBed.inject(ProgressInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
