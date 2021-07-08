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
