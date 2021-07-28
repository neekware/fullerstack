/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { TestBed } from '@angular/core/testing';

import { LoggerInterceptor } from './logger.interceptor';

describe('LoggerInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [LoggerInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: LoggerInterceptor = TestBed.inject(LoggerInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
