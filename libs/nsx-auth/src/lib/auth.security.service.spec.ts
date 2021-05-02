import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@fullerstack/nsx-prisma';
import { getMockPrismaService } from '@fullerstack/nsx-prisma/mock';

import { SecurityService } from './auth.security.service';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConfigService,
        { provide: PrismaService, useValue: getMockPrismaService() },
        SecurityService,
      ],
    }).compile();

    service = module.get(SecurityService);
  });

  afterAll(() => {
    service = null;
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
