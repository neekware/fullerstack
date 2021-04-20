import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@fullerstack/nsx-prisma';

import { SecurityService } from './auth.security.service';
import { AuthGuardRole } from './auth.guard.role';

describe('AuthGuardRole', () => {
  let service: AuthGuardRole;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PrismaService, ConfigService, SecurityService, AuthGuardRole],
    }).compile();

    service = module.get(AuthGuardRole);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
