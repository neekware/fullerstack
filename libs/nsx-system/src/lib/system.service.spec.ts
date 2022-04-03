/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { Test } from '@nestjs/testing';

import { SystemService } from './system.service';

describe('SystemService', () => {
  let service: SystemService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SystemService],
    }).compile();

    service = module.get(SystemService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
