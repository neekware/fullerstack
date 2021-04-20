import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@fullerstack/nsx-prisma';

import { SecurityService } from './auth.security.service';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ConfigService, PrismaService, SecurityService],
    }).compile();

    service = module.get(SecurityService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
