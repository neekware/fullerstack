import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@fullerstack/nsx-prisma';
import { getMockPrismaService } from '@fullerstack/nsx-prisma/mock';

import { SecurityService } from './auth.security.service';
import { AuthGuardRole } from './auth.guard.role';

describe('AuthGuardRole', () => {
  let service: AuthGuardRole;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: PrismaService, useValue: getMockPrismaService() },
        ConfigService,
        SecurityService,
        AuthGuardRole,
      ],
    }).compile();

    service = module.get(AuthGuardRole);
  });

  afterAll(() => {
    service = null;
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
