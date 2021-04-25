import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@fullerstack/nsx-prisma';
import { getMockPrismaService } from '@fullerstack/nsx-prisma-mock';

import { SecurityService } from './auth.security.service';
import { AuthResolver } from './auth.resolver';
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

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
