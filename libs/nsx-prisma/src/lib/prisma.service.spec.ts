/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { Test } from '@nestjs/testing';

import { getMockPrismaService } from './prisma.mock';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [{ provide: PrismaService, useValue: getMockPrismaService() }],
    }).compile();

    service = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
