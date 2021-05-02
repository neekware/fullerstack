import { Test } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { getMockPrismaService } from '@fullerstack/nsx-prisma/mock';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [{ provide: PrismaService, useValue: getMockPrismaService() }],
    }).compile();

    service = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
