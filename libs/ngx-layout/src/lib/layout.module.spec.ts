/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { TestBed, waitForAsync } from '@angular/core/testing';

import { LayoutModule } from './layout.module';

describe('LayoutModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [LayoutModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(LayoutModule).toBeDefined();
  });
});
