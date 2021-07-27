/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { MailerService } from './mailer.service';

const getMockConfigService = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get: (key: string): string => '',
};

describe('MailerService', () => {
  let service: MailerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [{ provide: ConfigService, useValue: getMockConfigService }, MailerService],
    }).compile();

    service = module.get(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
