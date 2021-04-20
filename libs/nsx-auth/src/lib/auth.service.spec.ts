import { PrismaService } from '@fullerstack/nsx-prisma';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { SecurityService } from './auth.security.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ConfigService, PrismaService, SecurityService, AuthService],
    }).compile();

    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
