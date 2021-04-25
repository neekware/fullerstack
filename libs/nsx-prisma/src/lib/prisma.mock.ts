import { mockDeep } from 'jest-mock-extended';

import { PrismaService } from './prisma.service';

export function getMockPrismaService() {
  const prisma = mockDeep<PrismaService>();
  prisma.$connect.mockResolvedValue(Promise.resolve());
  prisma.$disconnect.mockResolvedValue(Promise.resolve());
  return prisma;
}
