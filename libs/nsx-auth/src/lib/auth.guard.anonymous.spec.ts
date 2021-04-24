import { PrismaService } from '@fullerstack/nsx-prisma';
import { PrismaServiceMock } from '@fullerstack/nsx-prisma-mock';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { SecurityService } from './auth.security.service';
import { AuthGuardGql } from './auth.guard.gql';
import { AuthGuardAnonymousGql } from './auth.guard.anonymous';

describe('AuthGuardAnonymousGql', () => {
  let service: AuthGuardAnonymousGql;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConfigService,
        { provide: PrismaService, useValue: PrismaServiceMock },
        SecurityService,
        AuthGuardGql,
        AuthGuardAnonymousGql,
      ],
    }).compile();

    service = module.get(AuthGuardAnonymousGql);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
