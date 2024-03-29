/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { TestBed, async } from '@angular/core/testing';

import { UserModule } from './user.module';

describe('UserModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UserModule],
    }).compileComponents();
  }));

  it('should have a module definition', () => {
    expect(UserModule).toBeDefined();
  });
});
