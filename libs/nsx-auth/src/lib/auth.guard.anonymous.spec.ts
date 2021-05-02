import { PrismaService } from '@fullerstack/nsx-prisma';
import { getMockPrismaService } from '@fullerstack/nsx-prisma/mock';
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
        { provide: PrismaService, useValue: getMockPrismaService() },
        SecurityService,
        AuthGuardGql,
        AuthGuardAnonymousGql,
      ],
    }).compile();

    service = module.get(AuthGuardAnonymousGql);
  });

  afterAll(() => {
    service = null;
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
