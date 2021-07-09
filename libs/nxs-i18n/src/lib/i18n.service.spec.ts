/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { Test } from '@nestjs/testing';

import { I18nService } from './i18n.service';

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [I18nService],
    }).compile();

    service = module.get(I18nService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
