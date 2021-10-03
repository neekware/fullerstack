/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { TestBed } from '@angular/core/testing';

import { AnnotatorService } from './annotator.service';

describe('AnnotatorService', () => {
  let service: AnnotatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnotatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
