import { Test } from '@nestjs/testing';

import { NsxMailerService } from './nsx-mailer.service';

describe('NsxMailerService', () => {
  let service: NsxMailerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [NsxMailerService],
    }).compile();

    service = module.get(NsxMailerService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
