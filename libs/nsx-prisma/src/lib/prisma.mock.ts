import { mockDeep } from 'jest-mock-extended';

import { PrismaService } from './prisma.service';

export const PrismaServiceMock = mockDeep<PrismaService>();
PrismaServiceMock.$connect.mockResolvedValue(Promise.resolve());
PrismaServiceMock.$disconnect.mockResolvedValue(Promise.resolve());
