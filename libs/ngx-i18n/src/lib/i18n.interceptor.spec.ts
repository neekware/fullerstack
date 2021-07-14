/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { TestBed } from '@angular/core/testing';

import { I18nInterceptor } from './i18n.interceptor';

describe('I18nInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [I18nInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: I18nInterceptor = TestBed.inject(I18nInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
