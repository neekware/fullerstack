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
