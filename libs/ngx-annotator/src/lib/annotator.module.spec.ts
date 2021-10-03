/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { TestBed, waitForAsync } from '@angular/core/testing';

import { AnnotatorModule } from './annotator.module';

describe('AnnotatorService', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [AnnotatorModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(AnnotatorModule).toBeDefined();
  });
});
