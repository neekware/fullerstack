import { Test } from '@nestjs/testing';

import { PrismaService } from '@fullerstack/nsx-prisma';
import { getMockPrismaService } from '@fullerstack/nsx-prisma/mock';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: PrismaService, useValue: getMockPrismaService() },
        UserService,
      ],
    }).compile();

    service = module.get(UserService);
  });

  afterAll(() => {
    service = null;
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
