import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@fullerstack/nsx-prisma';
import { PrismaServiceMock } from '@fullerstack/nsx-prisma-mock';

import { SecurityService } from './auth.security.service';
import { AuthGuardPermission } from './auth.guard.permission';

describe('AuthGuardPermission', () => {
  let service: AuthGuardPermission;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: PrismaService, useValue: PrismaServiceMock },
        ConfigService,
        SecurityService,
        AuthGuardPermission,
      ],
    }).compile();

    service = module.get(AuthGuardPermission);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
