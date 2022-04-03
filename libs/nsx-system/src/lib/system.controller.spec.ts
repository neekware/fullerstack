/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { Test } from '@nestjs/testing';

import { SystemController } from './system.controller';
import { SystemService } from './system.service';

describe('SystemController', () => {
  let controller: SystemController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [SystemService],
      controllers: [SystemController],
    }).compile();

    controller = module.get(SystemController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
