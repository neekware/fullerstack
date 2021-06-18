/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ConfigModule } from '@fullerstack/ngx-config';

import { UixModule } from './uix.module';
import { UixService } from './uix.service';

describe('UixService', () => {
  let service: UixService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, ConfigModule.forRoot(), UixModule],
    });

    service = TestBed.inject(UixService);
  });

  afterAll(() => {
    service = null;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
