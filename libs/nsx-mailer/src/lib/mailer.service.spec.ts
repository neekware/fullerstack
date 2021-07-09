/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Test } from '@nestjs/testing';

import { MailerService } from './mailer.service';

describe('MailerService', () => {
  let service: MailerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MailerService],
    }).compile();

    service = module.get(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
