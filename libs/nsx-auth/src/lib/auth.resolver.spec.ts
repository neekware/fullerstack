import { PrismaService } from '@fullerstack/nsx-prisma';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { SecurityService } from './auth.security.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

describe('AuthResolver', () => {
  let service: AuthResolver;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConfigService,
        PrismaService,
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
