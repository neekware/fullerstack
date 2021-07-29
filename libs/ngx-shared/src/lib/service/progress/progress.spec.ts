/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { TestBed } from '@angular/core/testing';

import { ProgressService } from './progress.service';

describe('ProgressService', () => {
  let guard: ProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProgressService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
