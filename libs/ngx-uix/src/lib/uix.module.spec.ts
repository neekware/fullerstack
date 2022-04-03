/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { TestBed, waitForAsync } from '@angular/core/testing';

import { UixModule } from './uix.module';

describe('UixModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [UixModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(UixModule).toBeDefined();
  });
});
