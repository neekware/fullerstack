/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { I18nService } from '@fullerstack/nsx-i18n';
import { MailerService } from '@fullerstack/nsx-mailer';
import { PrismaService } from '@fullerstack/nsx-prisma';
import { getMockPrismaService } from '@fullerstack/nsx-prisma/mock';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { AuthResolver } from './auth.resolver';
import { SecurityService } from './auth.security.service';
import { AuthService } from './auth.service';

describe('AuthResolver', () => {
  let service: AuthResolver;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConfigService,
        { provide: PrismaService, useValue: getMockPrismaService() },
        I18nService,
        MailerService,
        AuthService,
        SecurityService,
        AuthResolver,
      ],
    }).compile();

    service = module.get(AuthResolver);
  });

  afterAll(() => {
    service = null;
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
