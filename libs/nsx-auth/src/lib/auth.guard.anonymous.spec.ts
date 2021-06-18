/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { PrismaService } from '@fullerstack/nsx-prisma';
import { getMockPrismaService } from '@fullerstack/nsx-prisma/mock';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { AuthGuardAnonymousGql } from './auth.guard.anonymous';
import { AuthGuardGql } from './auth.guard.gql';
import { SecurityService } from './auth.security.service';

describe('AuthGuardAnonymousGql', () => {
  let service: AuthGuardAnonymousGql;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConfigService,
        { provide: PrismaService, useValue: getMockPrismaService() },
        SecurityService,
        AuthGuardGql,
        AuthGuardAnonymousGql,
      ],
    }).compile();

    service = module.get(AuthGuardAnonymousGql);
  });

  afterAll(() => {
    service = null;
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
