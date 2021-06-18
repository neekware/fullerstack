/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { TestBed, waitForAsync } from '@angular/core/testing';

import { MaterialModule } from './material.module';

describe('NgxMaterialModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MaterialModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(MaterialModule).toBeDefined();
  });
});
