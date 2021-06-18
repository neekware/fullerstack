/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { TestBed, waitForAsync } from '@angular/core/testing';

import { MsgModule } from './msg.module';

describe('MsgModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MsgModule],
      }).compileComponents();
    })
  );

  it('should have a module definition', () => {
    expect(MsgModule).toBeDefined();
  });
});
